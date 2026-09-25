// js/dashboard.js

import {
    getTransactions
} from "./storage.js";

import {
    getBalanceSheet,
    calculateTotalAssets,
    calculateTotalLiabilities,
    calculateTotalEquity
} from "./balanceSheet.js";

import {
    getIncomeStatement
} from "./incomeStatement.js";

import {
    getCashBalance
} from "./cashFlowStatement.js";

import {
    reconcileReceivables,
    reconcilePayables
} from "./arApReconciliation.js";


// ============================================
// CURRENCY
// ============================================

export function formatDashboardCurrency(
    amount
) {

    return Number(amount || 0)
        .toLocaleString(
            "en-NG",
            {
                style: "currency",
                currency: "NGN"
            }
        );

}


// ============================================
// DASHBOARD DATA
// ============================================

export function getDashboardData({
    startDate = "",
    endDate = ""
} = {}) {

    if (!endDate) {

        endDate =
            new Date()
                .toISOString()
                .slice(0, 10);

    }


    if (!startDate) {

        startDate =
            `${endDate.slice(0, 4)}-01-01`;

    }


    // ========================================
    // INCOME STATEMENT
    // ========================================

    const income =
        getIncomeStatement({

            startDate,

            endDate

        });


    // ========================================
    // BALANCE SHEET
    // ========================================

    const balance =
        getBalanceSheet({

            startDate,

            endDate

        });


    const totalAssets =
        calculateTotalAssets(
            balance
        );


    const totalLiabilities =
        calculateTotalLiabilities(
            balance
        );


    const totalEquity =
        calculateTotalEquity(
            balance
        );


    // ========================================
    // CASH
    // ========================================

    const cash =
        getCashBalance(
            endDate
        );


    // ========================================
    // A/R
    // ========================================

    const receivables =
        reconcileReceivables(
            endDate
        );


    // ========================================
    // A/P
    // ========================================

    const payables =
        reconcilePayables(
            endDate
        );


    // ========================================
    // PROFIT MARGIN
    // ========================================

    const profitMargin =
        income.totalRevenue !== 0

            ? (
                income.netProfit /
                income.totalRevenue
            ) * 100

            : 0;


    // ========================================
    // DASHBOARD OBJECT
    // ========================================

    return {

        period: {

            startDate,

            endDate

        },


        performance: {

            revenue:
                income.totalRevenue,

            expenses:
                income.totalExpenses,

            profit:
                income.netProfit,

            profitMargin

        },


        financialPosition: {

            cash:
                cash.cash,

            bank:
                cash.bank,

            totalCash:
                cash.total,

            totalAssets,

            totalLiabilities,

            totalEquity

        },


        workingCapital: {

            receivables:
                receivables.expected,

            payables:
                payables.expected,

            customerCredits:
                receivables.unallocatedCredits,

            supplierPrepayments:
                payables.supplierPrepayments

        },


        controls: {

            receivablesDifference:
                receivables.difference,

            payablesDifference:
                payables.difference,

            balanceSheetDifference:
                totalAssets -
                (
                    totalLiabilities +
                    totalEquity
                )

        }

    };

}