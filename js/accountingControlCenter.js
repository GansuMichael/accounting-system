// js/accountingControlCenter.js

import {
    runFinancialStatementIntegrityCheck
} from "./financialStatementIntegrity.js";

import {
    checkReceivables,
    checkPayables
} from "./accountingIntegrity.js";

import {
    getTransactions
} from "./storage.js";


/**
 * Check that every journal entry is balanced.
 */
function checkJournalEntries(endDate) {

    const transactions =
        getTransactions().filter(
            transaction =>
                transaction.date <= endDate
        );


    const errors = [];


    transactions.forEach(transaction => {

        const totalDebit =
            transaction.lines.reduce(
                (total, line) =>
                    total +
                    Number(line.debit || 0),
                0
            );


        const totalCredit =
            transaction.lines.reduce(
                (total, line) =>
                    total +
                    Number(line.credit || 0),
                0
            );


        const difference =
            totalDebit -
            totalCredit;


        if (Math.abs(difference) >= 0.01) {

            errors.push({

                transactionId:
                    transaction.id,

                reference:
                    transaction.reference,

                date:
                    transaction.date,

                difference
            });
        }
    });


    return {

        name:
            "Journal Entries",

        passed:
            errors.length === 0,

        errorCount:
            errors.length,

        errors
    };
}


/**
 * Run the complete accounting control center.
 */
export function runAccountingControlCenter({
    startDate,
    endDate
}) {

    if (!startDate) {

        throw new Error(
            "Start date is required."
        );
    }


    if (!endDate) {

        throw new Error(
            "End date is required."
        );
    }


    if (startDate > endDate) {

        throw new Error(
            "Start date cannot be after end date."
        );
    }


    /*
     * Financial statement controls.
     */
    const financialStatements =
        runFinancialStatementIntegrityCheck({
            startDate,
            endDate
        });


    /*
     * Journal control.
     */
    const journal =
        checkJournalEntries(
            endDate
        );


    /*
     * Accounts Receivable control.
     */
    const receivables =
        checkReceivables(
            endDate
        );


    /*
     * Accounts Payable control.
     */
    const payables =
        checkPayables(
            endDate
        );


    const checks = [

        {
            name:
                "Journal Entries",

            passed:
                journal.passed,

            difference:
                0,

            details:
                journal
        },


        ...financialStatements.checks,


        {
            name:
                "Accounts Receivable",

            passed:
                receivables.reconciled,

            difference:
                receivables.difference,

            details:
                receivables
        },


        {
            name:
                "Accounts Payable",

            passed:
                payables.reconciled,

            difference:
                payables.difference,

            details:
                payables
        }

    ];


    const passed =
        checks.every(
            check => check.passed
        );


    return {

        startDate,

        endDate,

        passed,

        checks,

        journal,

        financialStatements,

        receivables,

        payables
    };
}