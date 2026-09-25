// js/financialStatements.js

import {
    getIncomeStatement
} from "./incomeStatement.js";

import {
    getBalanceSheet,
    calculateTotalAssets,
    calculateTotalLiabilities,
    calculateTotalEquity
} from "./balanceSheet.js";

import {
    generateTrialBalance,
    getTrialBalanceTotals
} from "./trialBalance.js";

import {
    getStatementOfEquity
} from "./statementOfEquity.js";

import {
    getCashFlowStatement,
    getOpeningCashBalance,
    getCashBalance
} from "./cashFlowStatement.js";


// ============================================
// FINANCIAL STATEMENTS REPORT
// ============================================

export function generateFinancialStatements({

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


    if (
        startDate >
        endDate
    ) {

        throw new Error(
            "Start date cannot be after end date."
        );

    }


    // ========================================
    // INCOME STATEMENT
    // ========================================

    const incomeStatement =
        getIncomeStatement({

            startDate,

            endDate

        });


    // ========================================
    // BALANCE SHEET
    // ========================================

    const balanceSheet =
        getBalanceSheet({

            startDate,

            endDate

        });


    // ========================================
    // TRIAL BALANCE
    // ========================================

    const trialBalance =
        generateTrialBalance({

            endDate

        });


    const trialBalanceTotals =
        getTrialBalanceTotals({

            endDate

        });

    const cashFlowStatement =
        getCashFlowStatement({
    
            startDate,
    
            endDate
    
        });
    
    
    const openingCash =
        getOpeningCashBalance(
            startDate
        );
    
    
    const closingCash =
        getCashBalance(
            endDate
        );


    // ========================================
    // BALANCE SHEET TOTALS
    // ========================================

    const totalAssets =
        calculateTotalAssets(
            balanceSheet
        );


    const totalLiabilities =
        calculateTotalLiabilities(
            balanceSheet
        );


    const totalEquity =
        calculateTotalEquity(
            balanceSheet
        );

    const statementOfEquity =
        getStatementOfEquity({
            startDate,
            endDate
        });


    return {

        period: {

            startDate,

            endDate

        },

        incomeStatement,

        balanceSheet,

        trialBalance,

        trialBalanceTotals,

        statementOfEquity,

        cashFlowStatement,

        cashBalances: {

        opening:
            openingCash,

        closing:
            closingCash

        },

        totals: {

            totalAssets,

            totalLiabilities,

            totalEquity,

            liabilitiesAndEquity:
                totalLiabilities +
                totalEquity,

            balanceSheetDifference:
                totalAssets -
                (
                    totalLiabilities +
                    totalEquity
                )

        }

    };

}