// js/statementOfEquity.js

import { getTransactions } from "./storage.js";
import { getAccountByCode } from "./accounts.js";
import { getBalanceSheet, calculateTotalEquity } from "./balanceSheet.js";


/**
 * Get the equity balance from all transactions
 * up to a particular date.
 */
function getEquityBalances(endDate) {

    const transactions = getTransactions().filter(
        transaction => transaction.date <= endDate
    );

    const balances = {};

    transactions.forEach(transaction => {

        transaction.lines.forEach(line => {

            const account =
                getAccountByCode(line.accountCode);

            if (!account) {
                return;
            }

            if (account.type !== "equity") {
                return;
            }

            if (!balances[line.accountCode]) {

                balances[line.accountCode] = {
                    code: line.accountCode,
                    name: account.name,
                    balance: 0
                };
            }

            balances[line.accountCode].balance +=
                Number(line.debit || 0) -
                Number(line.credit || 0);
        });
    });

    return balances;
}


/**
 * Get opening equity before the reporting period.
 */
function getOpeningEquity(startDate) {

    const previousDate = new Date(
        `${startDate}T00:00:00`
    );

    previousDate.setDate(
        previousDate.getDate() - 1
    );

    const previousDateString =
        previousDate.toISOString().slice(0, 10);

    const balances =
        getEquityBalances(previousDateString);

    let total = 0;

    Object.values(balances).forEach(account => {

        /*
         * Owner's Drawings is a contra-equity
         * account, therefore its debit balance
         * reduces equity.
         */
        if (account.code === "3030") {

            total -= Math.abs(
                account.balance
            );

        } else {

            total += account.balance;
        }
    });

    return total;
}


/**
 * Get capital contributions during the period.
 */
function getCapitalContributions(
    startDate,
    endDate
) {

    const transactions =
        getTransactions().filter(transaction => {

            return (
                transaction.date >= startDate &&
                transaction.date <= endDate
            );
        });

    let total = 0;

    transactions.forEach(transaction => {

        /*
         * Closing entries don't represent
         * new owner capital.
         */
        if (
            transaction.type ===
            "year_end_closing"
        ) {
            return;
        }

        transaction.lines.forEach(line => {

            if (line.accountCode !== "3010") {
                return;
            }

            total +=
                Number(line.credit || 0) -
                Number(line.debit || 0);
        });
    });

    return total;
}


/**
 * Get Owner's Drawings during the period.
 */
function getOwnerDrawings(
    startDate,
    endDate
) {

    const transactions =
        getTransactions().filter(transaction => {

            return (
                transaction.date >= startDate &&
                transaction.date <= endDate
            );
        });

    let total = 0;

    transactions.forEach(transaction => {

        if (
            transaction.type ===
            "year_end_closing"
        ) {
            return;
        }

        transaction.lines.forEach(line => {

            if (line.accountCode !== "3030") {
                return;
            }

            total +=
                Number(line.debit || 0) -
                Number(line.credit || 0);
        });
    });

    return total;
}


/**
 * Calculate net profit for the period.
 */
function getNetProfit(
    startDate,
    endDate
) {

    const transactions =
        getTransactions().filter(transaction => {

            return (
                transaction.date >= startDate &&
                transaction.date <= endDate
            );
        });

    let revenue = 0;
    let expenses = 0;

    transactions.forEach(transaction => {

        /*
         * Closing entries transfer profit
         * to Retained Earnings and must not
         * be counted as new revenue or expense.
         */
        if (
            transaction.type ===
            "year_end_closing"
        ) {
            return;
        }

        transaction.lines.forEach(line => {

            const account =
                getAccountByCode(
                    line.accountCode
                );

            if (!account) {
                return;
            }

            if (account.type === "revenue") {

                revenue +=
                    Number(line.credit || 0) -
                    Number(line.debit || 0);
            }

            if (account.type === "expense") {

                expenses +=
                    Number(line.debit || 0) -
                    Number(line.credit || 0);
            }
        });
    });

    return revenue - expenses;
}


/**
 * Get Retained Earnings movement during
 * the reporting period.
 *
 * A year-end closing entry transfers profit
 * or loss into Retained Earnings.
 */
function getRetainedEarningsMovement(
    startDate,
    endDate
) {

    const transactions =
        getTransactions().filter(transaction => {

            return (
                transaction.date >= startDate &&
                transaction.date <= endDate
            );
        });

    let movement = 0;

    transactions.forEach(transaction => {

        transaction.lines.forEach(line => {

            if (line.accountCode !== "3020") {
                return;
            }

            movement +=
                Number(line.credit || 0) -
                Number(line.debit || 0);
        });
    });

    return movement;
}


/**
 * Generate Statement of Equity.
 */
export function getStatementOfEquity({
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


    const openingEquity =
        getOpeningEquity(startDate);


    const capitalContributions =
        getCapitalContributions(
            startDate,
            endDate
        );


    const netProfit =
        getNetProfit(
            startDate,
            endDate
        );


    const drawings =
        getOwnerDrawings(
            startDate,
            endDate
        );


    const retainedEarningsMovement =
        getRetainedEarningsMovement(
            startDate,
            endDate
        );


    /*
     * When a year-end closing exists,
     * the profit has already been transferred
     * into Retained Earnings.
     *
     * Therefore we must not add both:
     *
     * Net Profit
     *
     * AND
     *
     * Retained Earnings closing movement
     *
     * to closing equity.
     */
    const yearEndClosed =
        getTransactions().some(transaction => {

            return (
                transaction.type ===
                "year_end_closing" &&

                transaction.endDate &&
                transaction.endDate >= startDate &&
                transaction.endDate <= endDate
            );
        });


    let profitIncluded = netProfit;
    let retainedEarningsIncluded =
        retainedEarningsMovement;


    if (yearEndClosed) {

        /*
         * Profit is already inside Retained Earnings.
         */
        profitIncluded = 0;
    }


    /*
     * Closing equity calculated from
     * Statement of Equity.
     */
    const calculatedClosingEquity =
        openingEquity +
        capitalContributions +
        profitIncluded +
        retainedEarningsIncluded -
        drawings;


    /*
     * Get actual closing equity from
     * Balance Sheet.
     */
    const balanceSheet =
        getBalanceSheet({
            startDate,
            endDate
        });


    const balanceSheetClosingEquity =
        calculateTotalEquity(
            balanceSheet
        );


    const difference =
        calculatedClosingEquity -
        balanceSheetClosingEquity;


    return {

        startDate,

        endDate,

        openingEquity,

        capitalContributions,

        netProfit,

        profitIncluded,

        retainedEarningsMovement,

        retainedEarningsIncluded,

        drawings,

        calculatedClosingEquity,

        balanceSheetClosingEquity,

        difference,

        reconciled:
            Math.abs(difference) < 0.01
    };
}