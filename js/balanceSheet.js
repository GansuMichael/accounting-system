// js/balanceSheet.js

import { getTransactions } from "./storage.js";
import { getAccountByCode } from "./accounts.js";
import { isFinancialYearClosed } from "./financialYear.js";


/**
 * Get cumulative balance of balance-sheet accounts
 * up to the reporting date.
 */
function getAccountBalances(endDate) {

    const transactions = getTransactions().filter(
        transaction => transaction.date <= endDate
    );

    const balances = {};

    transactions.forEach(transaction => {

        transaction.lines.forEach(line => {

            const account = getAccountByCode(line.accountCode);

            if (!account) {
                return;
            }

            // Revenue and expense accounts belong to the
            // Income Statement, not the Balance Sheet.
            if (
                account.type === "revenue" ||
                account.type === "expense"
            ) {
                return;
            }

            if (!balances[line.accountCode]) {

                balances[line.accountCode] = {
                    code: line.accountCode,
                    name: account.name,
                    type: account.type,
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
 * Calculate profit for the current financial year.
 *
 * Year-end closing transactions are ignored because
 * they transfer the result into Retained Earnings.
 */
function getCurrentYearProfit(startDate, endDate) {

    const transactions = getTransactions().filter(
        transaction =>
            transaction.date >= startDate &&
            transaction.date <= endDate
    );

    let revenue = 0;
    let expenses = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "year_end_closing") {
            return;
        }

        transaction.lines.forEach(line => {

            const account = getAccountByCode(line.accountCode);

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
 * Generate Balance Sheet.
 */
export function getBalanceSheet({
    startDate = "",
    endDate = ""
} = {}) {

    if (!endDate) {
        throw new Error(
            "Balance Sheet end date is required."
        );
    }

    if (!startDate) {
        startDate = `${endDate.slice(0, 4)}-01-01`;
    }

    const balances = getAccountBalances(endDate);

    const assets = {};
    const liabilities = {};
    const equity = {};

    Object.values(balances).forEach(account => {

        if (
            account.type === "asset" ||
            account.type === "contra_asset"
        ) {
            assets[account.code] = account;
        }

        if (account.type === "liability") {
            liabilities[account.code] = account;
        }

        if (account.type === "equity") {
            equity[account.code] = account;
        }
    });


    const currentYearProfit =
        getCurrentYearProfit(startDate, endDate);


    /*
     * IMPORTANT:
     *
     * Before year-end closing:
     *
     * Equity =
     * Retained Earnings
     * + Current Year Profit
     *
     *
     * After year-end closing:
     *
     * Retained Earnings already contains the profit.
     *
     * Therefore we must NOT add Current Year Profit again.
     */
    const financialYearClosed =
        isFinancialYearClosed(endDate);

    const currentYearProfitIncluded =
        financialYearClosed
            ? 0
            : currentYearProfit;


    return {

        startDate,

        endDate,

        assets,

        liabilities,

        equity,

        currentYearProfit,

        currentYearProfitIncluded,

        financialYearClosed
    };
}


/**
 * Calculate total assets.
 */
export function calculateTotalAssets(balanceSheet) {

    return Object.values(balanceSheet.assets)
        .reduce((total, account) => {

            // Accumulated depreciation reduces assets.
            if (account.type === "contra_asset") {

                return total - Math.abs(
                    account.balance
                );
            }

            return total + account.balance;

        }, 0);
}


/**
 * Calculate total liabilities.
 */
/**
 * Calculate total liabilities.
 *
 * Internal account balances use:
 * debit - credit
 *
 * Liabilities normally have credit balances,
 * so they are reversed for Balance Sheet presentation.
 */
export function calculateTotalLiabilities(balanceSheet) {

    return Object.values(balanceSheet.liabilities)
        .reduce(
            (total, account) =>
                total - account.balance,
            0
        );
}

/**
 * Calculate total equity.
 *
 * Internal account balances use:
 * debit - credit
 *
 * Equity normally has credit balances,
 * so they are reversed for Balance Sheet presentation.
 *
 * Owner's Drawings (3030) is a debit-balance
 * contra-equity account, so it reduces equity.
 */
/**
 * Calculate total equity.
 *
 * Internal account balances use:
 * debit - credit
 *
 * Equity normally has credit balances,
 * so the balance is reversed for Balance Sheet presentation.
 *
 * Owner's Drawings (3030) is a debit-balance
 * contra-equity account, so reversing its balance
 * automatically makes it reduce equity.
 */
export function calculateTotalEquity(balanceSheet) {

    const equityTotal =
        Object.values(balanceSheet.equity)
            .reduce(
                (total, account) =>
                    total - account.balance,
                0
            );

    return (
        equityTotal +
        balanceSheet.currentYearProfitIncluded
    );
}