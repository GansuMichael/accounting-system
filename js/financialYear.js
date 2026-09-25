// js/financialYear.js

import { getTransactions } from "./storage.js";

/**
 * Get the financial year from a date.
 * Example: 2026-09-26 → "2026"
 */
export function getFinancialYearKey(date) {
    if (!date) {
        throw new Error("Date is required.");
    }

    return date.slice(0, 4);
}

/**
 * Get the beginning of the financial year.
 */
export function getFinancialYearStart(date) {
    const year = getFinancialYearKey(date);
    return `${year}-01-01`;
}

/**
 * Get the end of the financial year.
 */
export function getFinancialYearEnd(date) {
    const year = getFinancialYearKey(date);
    return `${year}-12-31`;
}

/**
 * Find the year-end closing transaction for a financial year.
 */
export function getYearEndClosingForYear(date, reportEndDate = "") {
    const year = getFinancialYearKey(date);
    const transactions = getTransactions();

    return transactions.find(transaction => {
        if (transaction.type !== "year_end_closing") {
            return false;
        }

        if (!transaction.endDate) {
            return false;
        }

        if (transaction.endDate.slice(0, 4) !== year) {
            return false;
        }

        if (reportEndDate && transaction.endDate > reportEndDate) {
            return false;
        }

        return true;
    }) || null;
}

/**
 * Determine whether the financial year containing endDate
 * has already been closed.
 */
export function isFinancialYearClosed(endDate) {
    if (!endDate) {
        throw new Error("End date is required.");
    }

    return Boolean(
        getYearEndClosingForYear(endDate, endDate)
    );
}