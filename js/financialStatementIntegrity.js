// js/financialStatementIntegrity.js

import {
    generateFinancialStatements
} from "./financialStatements.js";

import {
    reconcileCashFlow
} from "./cashFlowStatement.js";

import {
    getTrialBalanceTotals
} from "./trialBalance.js";


/**
 * Check Balance Sheet equation.
 *
 * Assets = Liabilities + Equity
 */
function checkBalanceSheet(
    statements
) {

    const assets =
        statements.totals.totalAssets;

    const liabilities =
        statements.totals.totalLiabilities;

    const equity =
        statements.totals.totalEquity;

    const difference =
        assets -
        (liabilities + equity);


    return {

        name:
            "Balance Sheet",

        assets,

        liabilities,

        equity,

        difference,

        passed:
            Math.abs(difference) < 0.01
    };
}


/**
 * Check Trial Balance.
 *
 * Total Debits = Total Credits
 */
function checkTrialBalance(
    statements
) {

    const totalDebit =
        statements
            .trialBalanceTotals
            .totalDebit;

    const totalCredit =
        statements
            .trialBalanceTotals
            .totalCredit;


    const difference =
        totalDebit -
        totalCredit;


    return {

        name:
            "Trial Balance",

        totalDebit,

        totalCredit,

        difference,

        passed:
            Math.abs(difference) < 0.01
    };
}


/**
 * Check Cash Flow Statement.
 */
function checkCashFlow({
    startDate,
    endDate
}) {

    const result =
        reconcileCashFlow({
            startDate,
            endDate
        });


    return {

        name:
            "Cash Flow",

        openingCash:
            result.openingCash,

        netCashFlow:
            result.netCashFlow,

        calculatedClosingCash:
            result.calculatedClosingCash,

        actualClosingCash:
            result.actualClosingCash,

        difference:
            result.difference,

        passed:
            result.reconciled
    };
}


/**
 * Check Statement of Equity.
 */
function checkStatementOfEquity(
    statements
) {

    const statement =
        statements.statementOfEquity;


    return {

        name:
            "Statement of Equity",

        calculatedClosingEquity:
            statement.calculatedClosingEquity,

        balanceSheetClosingEquity:
            statement.balanceSheetClosingEquity,

        difference:
            statement.difference,

        passed:
            statement.reconciled
    };
}


/**
 * Check all financial statements.
 */
export function runFinancialStatementIntegrityCheck({
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


    const statements =
        generateFinancialStatements({
            startDate,
            endDate
        });


    const balanceSheet =
        checkBalanceSheet(
            statements
        );


    const trialBalance =
        checkTrialBalance(
            statements
        );


    const cashFlow =
        checkCashFlow({
            startDate,
            endDate
        });


    const statementOfEquity =
        checkStatementOfEquity(
            statements
        );


    const checks = [

        balanceSheet,

        trialBalance,

        cashFlow,

        statementOfEquity

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

        statements
    };
}