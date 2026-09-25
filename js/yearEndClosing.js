// js/yearEndClosing.js

import {
    getTransactions,
    saveTransaction
} from "./storage.js";

import {
    getLedgerEntries
} from "./ledger.js";

import {
    createJournalEntry
} from "./journal.js";

import {
    getAccountByCode
} from "./accounts.js";

import {
    createAuditLog
} from "./auditLog.js";

import {
    ensurePeriodOpen
} from "./accountingPeriods.js";

import {
    getFinancialYearStart,
    getYearEndClosingForYear
} from "./financialYear.js";


const BALANCE_SHEET_TYPES = [
    "asset",
    "contra_asset",
    "liability",
    "equity"
];


/**
 * Get cumulative balance of one account
 * up to a particular date.
 */
function getAccountBalance(accountCode, endDate) {

    const ledger = getLedgerEntries({
        endDate
    });

    const account = ledger[accountCode];

    if (!account) {
        return 0;
    }

    return account.entries.reduce(
        (balance, entry) => {

            return (
                balance +
                Number(entry.debit || 0) -
                Number(entry.credit || 0)
            );

        },
        0
    );
}


/**
 * Get all balance-sheet account balances
 * as of the year-end date.
 */
export function getYearEndBalances(endDate) {

    const ledger = getLedgerEntries({
        endDate
    });

    return Object.keys(ledger)
        .map(accountCode => {

            const account =
                getAccountByCode(accountCode);

            if (!account) {
                return null;
            }

            const balance =
                getAccountBalance(
                    accountCode,
                    endDate
                );

            return {
                accountCode,
                accountName: account.name,
                type: account.type,
                balance
            };
        })
        .filter(Boolean);
}


/**
 * Get revenue and expense balances
 * ONLY for the current financial year.
 */
export function getFinancialYearTemporaryBalances(
    startDate,
    endDate
) {

    const transactions =
        getTransactions().filter(transaction => {

            if (transaction.date < startDate) {
                return false;
            }

            if (transaction.date > endDate) {
                return false;
            }

            return true;
        });

    const balances = {};


    transactions.forEach(transaction => {

        /*
         * A previous closing entry must never
         * become part of the next closing calculation.
         */
        if (transaction.type === "year_end_closing") {
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


            if (
                account.type !== "revenue" &&
                account.type !== "expense"
            ) {
                return;
            }


            if (!balances[line.accountCode]) {

                balances[line.accountCode] = {

                    accountCode:
                        line.accountCode,

                    accountName:
                        account.name,

                    type:
                        account.type,

                    balance: 0
                };
            }


            if (account.type === "revenue") {

                balances[line.accountCode].balance +=
                    Number(line.credit || 0) -
                    Number(line.debit || 0);
            }


            if (account.type === "expense") {

                balances[line.accountCode].balance +=
                    Number(line.debit || 0) -
                    Number(line.credit || 0);
            }

        });
    });


    return Object.values(balances);
}


/**
 * Calculate financial-year profit.
 */
export function calculateYearProfit(
    startDate,
    endDate
) {

    const balances =
        getFinancialYearTemporaryBalances(
            startDate,
            endDate
        );


    let revenue = 0;
    let expenses = 0;


    balances.forEach(account => {

        if (account.type === "revenue") {
            revenue += account.balance;
        }

        if (account.type === "expense") {
            expenses += account.balance;
        }

    });


    return {

        revenue,

        expenses,

        profit:
            revenue - expenses
    };
}


/**
 * Create the year-end closing journal entry.
 */
export function createYearEndClosing({

    startDate,

    endDate,

    retainedEarningsAccount = "3020",

    reference = ""

}) {

    if (!startDate) {
        startDate =
            getFinancialYearStart(endDate);
    }


    if (!endDate) {
        throw new Error(
            "Year-end date is required."
        );
    }


    if (startDate > endDate) {
        throw new Error(
            "Financial year start cannot be after year-end."
        );
    }


    /*
     * The year-end transaction itself must
     * belong to an open accounting period.
     */
    ensurePeriodOpen(endDate);


    /*
     * Prevent duplicate closing of the
     * same financial year.
     */
    const existingClosing =
        getYearEndClosingForYear(
            endDate,
            endDate
        );

    if (existingClosing) {

        throw new Error(
            `Financial year ${endDate.slice(0, 4)} is already closed.`
        );
    }


    const temporaryBalances =
        getFinancialYearTemporaryBalances(
            startDate,
            endDate
        );


    const profit =
        calculateYearProfit(
            startDate,
            endDate
        );


    const lines = [];


    /*
     * Close revenue accounts.
     *
     * Revenue normally has a credit balance.
     * We debit revenue to bring it to zero.
     */
    temporaryBalances
        .filter(account =>
            account.type === "revenue"
        )
        .forEach(account => {

            if (account.balance === 0) {
                return;
            }

            lines.push({

                accountCode:
                    account.accountCode,

                accountName:
                    account.accountName,

                debit:
                    account.balance > 0
                        ? account.balance
                        : 0,

                credit:
                    account.balance < 0
                        ? Math.abs(account.balance)
                        : 0
            });
        });


    /*
     * Close expense accounts.
     *
     * Expenses normally have a debit balance.
     * We credit expenses to bring them to zero.
     */
    temporaryBalances
        .filter(account =>
            account.type === "expense"
        )
        .forEach(account => {

            if (account.balance === 0) {
                return;
            }

            lines.push({

                accountCode:
                    account.accountCode,

                accountName:
                    account.accountName,

                debit:
                    account.balance < 0
                        ? Math.abs(account.balance)
                        : 0,

                credit:
                    account.balance > 0
                        ? account.balance
                        : 0
            });
        });


    /*
     * Transfer the year's profit/loss
     * into Retained Earnings.
     */
    if (profit.profit !== 0) {

        const retainedEarnings =
            getAccountByCode(
                retainedEarningsAccount
            );


        if (!retainedEarnings) {

            throw new Error(
                `Retained earnings account ${retainedEarningsAccount} not found.`
            );
        }


        lines.push({

            accountCode:
                retainedEarningsAccount,

            accountName:
                retainedEarnings.name,

            debit:
                profit.profit < 0
                    ? Math.abs(profit.profit)
                    : 0,

            credit:
                profit.profit > 0
                    ? profit.profit
                    : 0
        });
    }


    if (lines.length === 0) {

        throw new Error(
            "There are no temporary account balances to close."
        );
    }


    const journalEntry =
        createJournalEntry({

            date: endDate,

            description:
                `Year-end closing ${endDate.slice(0, 4)}`,

            reference:
                reference ||
                `CLOSE-${endDate.slice(0, 4)}`,

            lines
        });


    const transaction = {

        ...journalEntry,

        type: "year_end_closing",

        startDate,

        endDate,

        profit: profit.profit
    };


    saveTransaction(transaction);


    createAuditLog({

        action:
            "YEAR_END_CLOSING",

        entityType:
            "YEAR_END",

        entityId:
            transaction.id,

        description:
            `Year-end closing for ${endDate.slice(0, 4)}`,

        oldValue:
            null,

        newValue: {

            revenue:
                profit.revenue,

            expenses:
                profit.expenses,

            profit:
                profit.profit
        },

        reason:
            "Year-end closing entry",

        user:
            "System"
    });


    return transaction;
}


/**
 * Get balance-sheet opening balances
 * for the next financial year.
 */
export function getOpeningBalances(endDate) {

    return getYearEndBalances(endDate)
        .filter(account =>
            BALANCE_SHEET_TYPES.includes(
                account.type
            )
        );
}