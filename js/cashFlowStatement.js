// js/cashFlowStatement.js

import { getTransactions } from "./storage.js";
import { getAccountByCode } from "./accounts.js";


// Cash and bank accounts
const CASH_ACCOUNTS = [
    "1010", // Cash
    "1020"  // Bank
];


// Accounts normally classified as investing
const INVESTING_ACCOUNTS = [
    "1500", // Machinery
    "1510", // Vehicles
    "1520"  // Buildings
];


// Accounts normally classified as financing
const FINANCING_ACCOUNTS = [
    "2020", // Loans Payable
    "3010", // Owner's Capital
    "3030"  // Owner's Drawings
];


/**
 * Determine whether an account is Cash or Bank.
 */
function isCashAccount(accountCode) {

    return CASH_ACCOUNTS.includes(
        accountCode
    );
}


/**
 * Determine whether an account is
 * an investing account.
 */
function isInvestingAccount(accountCode) {

    return INVESTING_ACCOUNTS.includes(
        accountCode
    );
}


/**
 * Determine whether an account is
 * a financing account.
 */
function isFinancingAccount(accountCode) {

    return FINANCING_ACCOUNTS.includes(
        accountCode
    );
}


/**
 * Get the non-cash accounts involved
 * in a transaction.
 */
function getNonCashLines(transaction) {

    return transaction.lines.filter(
        line => !isCashAccount(
            line.accountCode
        )
    );
}


/**
 * Classify a cash movement.
 *
 * The entire journal entry is inspected,
 * rather than simply taking the first
 * non-cash account.
 */
function classifyCashMovement(transaction) {

    const nonCashLines =
        getNonCashLines(transaction);


    /*
     * If any asset purchase account is involved,
     * classify as investing.
     */
    if (
        nonCashLines.some(line =>
            isInvestingAccount(
                line.accountCode
            )
        )
    ) {
        return "investing";
    }


    /*
     * If financing accounts are involved,
     * classify as financing.
     */
    if (
        nonCashLines.some(line =>
            isFinancingAccount(
                line.accountCode
            )
        )
    ) {
        return "financing";
    }


    /*
     * Everything else is treated as operating
     * for this direct-method cash-flow model.
     */
    return "operating";
}


/**
 * Get all cash movements within a period.
 */
function getCashMovements({
    startDate,
    endDate
}) {

    const transactions =
        getTransactions().filter(
            transaction => {

                if (
                    transaction.date <
                    startDate
                ) {
                    return false;
                }

                if (
                    transaction.date >
                    endDate
                ) {
                    return false;
                }

                return true;
            }
        );


    const movements = [];


    transactions.forEach(transaction => {

        /*
         * Year-end closing has no cash movement.
         */
        if (
            transaction.type ===
            "year_end_closing"
        ) {
            return;
        }


        const cashLines =
            transaction.lines.filter(
                line =>
                    isCashAccount(
                        line.accountCode
                    )
            );


        if (cashLines.length === 0) {
            return;
        }


        const category =
            classifyCashMovement(
                transaction
            );


        cashLines.forEach(line => {

            const amount =
                Number(line.debit || 0) -
                Number(line.credit || 0);


            if (amount === 0) {
                return;
            }


            const account =
                getAccountByCode(
                    line.accountCode
                );


            movements.push({

                transactionId:
                    transaction.id,

                date:
                    transaction.date,

                reference:
                    transaction.reference,

                description:
                    transaction.description,

                accountCode:
                    line.accountCode,

                accountName:
                    account
                        ? account.name
                        : "",

                amount,

                category
            });
        });
    });


    return movements;
}


/**
 * Generate the Cash Flow Statement.
 */
export function getCashFlowStatement({
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


    const movements =
        getCashMovements({
            startDate,
            endDate
        });


    let operating = 0;
    let investing = 0;
    let financing = 0;


    const operatingDetails = [];
    const investingDetails = [];
    const financingDetails = [];


    movements.forEach(movement => {

        if (
            movement.category ===
            "operating"
        ) {

            operating +=
                movement.amount;

            operatingDetails.push(
                movement
            );

            return;
        }


        if (
            movement.category ===
            "investing"
        ) {

            investing +=
                movement.amount;

            investingDetails.push(
                movement
            );

            return;
        }


        if (
            movement.category ===
            "financing"
        ) {

            financing +=
                movement.amount;

            financingDetails.push(
                movement
            );
        }
    });


    const netCashFlow =
        operating +
        investing +
        financing;


    return {

        startDate,

        endDate,

        operating,

        investing,

        financing,

        netCashFlow,

        operatingDetails,

        investingDetails,

        financingDetails,

        movements
    };
}


/**
 * Calculate Cash and Bank balances
 * as of a particular date.
 */
export function getCashBalance(endDate) {

    if (!endDate) {
        throw new Error(
            "End date is required."
        );
    }


    const transactions =
        getTransactions().filter(
            transaction =>
                transaction.date <= endDate
        );


    let cash = 0;
    let bank = 0;


    transactions.forEach(transaction => {

        transaction.lines.forEach(line => {

            const movement =
                Number(line.debit || 0) -
                Number(line.credit || 0);


            if (line.accountCode === "1010") {
                cash += movement;
            }


            if (line.accountCode === "1020") {
                bank += movement;
            }
        });
    });


    return {

        cash,

        bank,

        total:
            cash + bank
    };
}


/**
 * Calculate opening cash/bank balance
 * for the reporting period.
 */
export function getOpeningCashBalance(
    startDate
) {

    if (!startDate) {
        throw new Error(
            "Start date is required."
        );
    }


    const previousDate =
        new Date(
            `${startDate}T00:00:00`
        );


    previousDate.setDate(
        previousDate.getDate() - 1
    );


    const previousDateString =
        previousDate
            .toISOString()
            .slice(0, 10);


    return getCashBalance(
        previousDateString
    );
}


/**
 * Reconcile the Cash Flow Statement
 * with the actual Balance Sheet cash.
 */
export function reconcileCashFlow({
    startDate,
    endDate
}) {

    const cashFlow =
        getCashFlowStatement({
            startDate,
            endDate
        });


    const opening =
        getOpeningCashBalance(
            startDate
        );


    const closing =
        getCashBalance(
            endDate
        );


    const calculatedClosing =
        opening.total +
        cashFlow.netCashFlow;


    const difference =
        calculatedClosing -
        closing.total;


    return {

        openingCash:
            opening.total,

        operatingCashFlow:
            cashFlow.operating,

        investingCashFlow:
            cashFlow.investing,

        financingCashFlow:
            cashFlow.financing,

        netCashFlow:
            cashFlow.netCashFlow,

        calculatedClosingCash:
            calculatedClosing,

        actualClosingCash:
            closing.total,

        difference,

        reconciled:
            Math.abs(difference) < 0.01
    };
}