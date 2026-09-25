// js/periodControl.js

import {
    ensurePeriodOpen,
    isPeriodClosed
} from "./accountingPeriods.js";


/**
 * Ensure a transaction date belongs
 * to an open accounting period.
 */
export function validateTransactionDate(date) {

    if (!date) {
        throw new Error(
            "Transaction date is required."
        );
    }

    ensurePeriodOpen(date);

    return true;
}


/**
 * Ensure an existing transaction
 * can be modified.
 */
export function ensureTransactionEditable(
    transaction
) {

    if (!transaction) {
        throw new Error(
            "Transaction not found."
        );
    }

    if (!transaction.date) {
        throw new Error(
            "Transaction date is missing."
        );
    }

    ensurePeriodOpen(
        transaction.date
    );

    return true;
}


/**
 * Ensure an existing transaction
 * can be deleted.
 */
export function ensureTransactionDeletable(
    transaction
) {

    ensureTransactionEditable(
        transaction
    );

    if (
        transaction.type ===
        "year_end_closing"
    ) {

        throw new Error(
            "Year-end closing transactions cannot be deleted."
        );
    }

    return true;
}


/**
 * Ensure a transaction can be reversed.
 */
export function ensureTransactionReversible(
    transaction
) {

    ensureTransactionEditable(
        transaction
    );

    if (
        transaction.type ===
        "year_end_closing"
    ) {

        throw new Error(
            "Year-end closing transactions cannot be reversed."
        );
    }

    if (
        transaction.type ===
        "reversal"
    ) {

        throw new Error(
            "A reversal transaction cannot be reversed."
        );
    }

    if (
        transaction.voided
    ) {

        throw new Error(
            "This transaction has already been voided."
        );
    }

    return true;
}


/**
 * Check whether a date is inside
 * a closed accounting period.
 */
export function getPeriodLockStatus(
    date
) {

    if (!date) {

        return {
            locked: false,
            period: null
        };
    }

    const locked =
        isPeriodClosed(date);

    return {

        locked,

        period:
            date.slice(0, 7)

    };
}