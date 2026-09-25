// js/reversalEngine.js

import {
    getTransactions,
    saveTransactions
} from "./storage.js";

import {
    createJournalEntry
} from "./journal.js";

import {
    createAuditLog
} from "./auditLog.js";

import {
    ensurePeriodOpen
} from "./accountingPeriods.js";

import {
    ensureTransactionReversible
} from "./periodControl.js";


// ============================================
// GET TRANSACTION
// ============================================

function getTransaction(
    transactions,
    transactionId
) {

    const transaction =
        transactions.find(
            item =>
                item.id === transactionId
        );

    if (!transaction) {
        throw new Error(
            "Transaction not found."
        );
    }

    return transaction;
}


// ============================================
// CHECK WHETHER ALREADY VOIDED
// ============================================

function ensureNotVoided(
    transaction
) {

    if (
        transaction.status ===
        "voided"
    ) {

        throw new Error(
            "This transaction has already been voided."
        );

    }

}


// ============================================
// CREATE REVERSING LINES
// ============================================

function createReversingLines(
    lines
) {
    ensureTransactionReversible(
        transaction
    );
    
    return lines.map(
        line => ({

            accountCode:
                line.accountCode,

            accountName:
                line.accountName,

            debit:
                Number(
                    line.credit || 0
                ),

            credit:
                Number(
                    line.debit || 0
                )

        })
    );

}


// ============================================
// REVERSE TRANSACTION
// ============================================

export function reverseTransaction({

    transactionId,

    reason,

    reversedBy = "System"

}) {
    ensureTransactionReversible(
        transaction
    );

    if (
        !reason ||
        !reason.trim()
    ) {

        throw new Error(
            "A reversal reason is required."
        );

    }


    const transactions =
        getTransactions();


    const original =
        getTransaction(
            transactions,
            transactionId
        );


    ensureNotVoided(
        original
    );


    if (
        !Array.isArray(
            original.lines
        ) ||
        original.lines.length === 0
    ) {

        throw new Error(
            "Transaction has no journal lines to reverse."
        );

    }


    // ========================================
    // CREATE REVERSING JOURNAL
    // ========================================

    const reversalDate =
    new Date()
        .toISOString()
        .slice(0, 10);

    ensurePeriodOpen(
    reversalDate
    );

    const reversingEntry =
        createJournalEntry({

            date:
                new Date()
                    .toISOString()
                    .slice(0, 10),

            description:
                `Reversal of ${
                    original.reference
                }: ${
                    original.description
                }`,

            reference:
                `REV-${original.reference}`,

            lines:
                createReversingLines(
                    original.lines
                )

        });


    const reversal = {

        ...reversingEntry,

        type:
            "reversal",

        reversalOf:
            original.id,

        originalReference:
            original.reference,

        reason:
            reason.trim(),

        reversedBy,

        status:
            "posted"

    };


    // ========================================
    // MARK ORIGINAL AS VOIDED
    // ========================================

    original.status =
        "voided";


    original.voidedAt =
        new Date()
            .toISOString();


    original.voidedBy =
        reversedBy;


    original.voidReason =
        reason.trim();


    original.reversalId =
        reversal.id;


    // ========================================
    // SAVE BOTH
    // ========================================

    transactions.push(
        reversal
    );


    saveTransactions(
        transactions
    );


    // ========================================
    // AUDIT TRAIL
    // ========================================

    createAuditLog({

        action:
            "TRANSACTION_REVERSAL",

        entityType:
            "TRANSACTION",

        entityId:
            original.id,

        description:
            `Transaction ${original.reference} reversed.`,

        oldValue: {

            status:
                "posted",

            reference:
                original.reference,

            amount:
                original.amount || 0

        },

        newValue: {

            status:
                "voided",

            reversalId:
                reversal.id,

            reason:
                reason.trim()

        },

        reason:
            reason.trim(),

        user:
            reversedBy

    });


    return {

        original,

        reversal

    };

}


// ============================================
// CHECK REVERSAL
// ============================================

export function isReversed(
    transactionId
) {

    const transactions =
        getTransactions();


    return transactions.some(
        transaction =>
            transaction.type ===
                "reversal" &&

            transaction.reversalOf ===
                transactionId
    );

}