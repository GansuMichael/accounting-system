import {
    getCompanyReceivablesAging,
    getCompanyPayablesAging
} from "./arApAging.js";

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
    getCashFlowStatement,
    getOpeningCashBalance,
    getCashBalance
} from "./cashFlowStatement.js";

import {
    getTransactions
} from "./storage.js";


/*
==================================================
HELPERS
==================================================
*/

function getAccountBalance(balanceSheet, accountCode) {
    const account =
        balanceSheet.assets?.[accountCode] ||
        balanceSheet.liabilities?.[accountCode] ||
        balanceSheet.equity?.[accountCode];

    if (!account) {
        return 0;
    }

    return Number(account.balance || 0);
}


function getCurrentAssetAccounts(balanceSheet) {
    const currentAssetCodes = [
        "1010", // Cash
        "1020", // Bank
        "1030", // Accounts Receivable
        "1040"  // Inventory
    ];

    return currentAssetCodes.reduce(
        (total, code) =>
            total + getAccountBalance(balanceSheet, code),
        0
    );
}


function getCurrentLiabilityAccounts(balanceSheet) {
    const currentLiabilityCodes = [
        "2010", // Accounts Payable
        "2030"  // Deferred Revenue
    ];

    return currentLiabilityCodes.reduce(
        (total, code) =>
            total + getAccountBalance(balanceSheet, code),
        0
    );
}


function getCashAndBank(balanceSheet) {

    const cash =
        getAccountBalance(
            balanceSheet,
            "1010"
        );

    const bank =
        getAccountBalance(
            balanceSheet,
            "1020"
        );

    return {
        cash,
        bank,
        total: cash + bank
    };
}


/*
==================================================
DASHBOARD
==================================================
*/
function sumAgingBuckets(rows) {
    return rows.reduce(
        (totals, row) => ({
            current:
                totals.current +
                Number(row.current || 0),

            days1to30:
                totals.days1to30 +
                Number(row.days1to30 || 0),

            days31to60:
                totals.days31to60 +
                Number(row.days31to60 || 0),

            days61to90:
                totals.days61to90 +
                Number(row.days61to90 || 0),

            days91to120:
                totals.days91to120 +
                Number(row.days91to120 || 0),

            days120Plus:
                totals.days120Plus +
                Number(row.days120Plus || 0),

            total:
                totals.total +
                Number(row.total || 0)
        }),
        {
            current: 0,
            days1to30: 0,
            days31to60: 0,
            days61to90: 0,
            days91to120: 0,
            days120Plus: 0,
            total: 0
        }
    );
}

export function getDashboard({
    startDate = "",
    endDate = ""
} = {}) {

    if (!endDate) {
        throw new Error(
            "Dashboard end date is required."
        );
    }

    if (!startDate) {
        startDate =
            `${endDate.slice(0, 4)}-01-01`;
    }

    if (startDate > endDate) {
        throw new Error(
            "Dashboard start date cannot be after end date."
        );
    }


    /*
    ==============================================
    INCOME STATEMENT
    ==============================================
    */

    const incomeStatement =
        getIncomeStatement({
            startDate,
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

    const netCashFlow =
        closingCash - openingCash;

    const revenue =
        Number(
            incomeStatement.totalRevenue || 0
        );

    const expenses =
        Number(
            incomeStatement.totalExpenses || 0
        );

    const netProfit =
        Number(
            incomeStatement.netProfit || 0
        );


    const receivableAging =
        getCompanyReceivablesAging(
            endDate
        );
    
    const payableAging =
        getCompanyPayablesAging(
            endDate
        );

    const receivableAgingTotals =
        sumAgingBuckets(receivableAging);

    const payableAgingTotals =
        sumAgingBuckets(payableAging);


const totalReceivables =
    receivableAgingTotals.total;

const overdueReceivables =
    receivableAgingTotals.days1to30 +
    receivableAgingTotals.days31to60 +
    receivableAgingTotals.days61to90 +
    receivableAgingTotals.days91to120 +
    receivableAgingTotals.days120Plus;

const totalPayables =
    payableAgingTotals.total;

const overduePayables =
    payableAgingTotals.days1to30 +
    payableAgingTotals.days31to60 +
    payableAgingTotals.days61to90 +
    payableAgingTotals.days91to120 +
    payableAgingTotals.days120Plus;

const netReceivablePosition =
    totalReceivables - totalPayables;
    /*
    ==============================================
    BALANCE SHEET
    ==============================================
    */

    const balanceSheet =
        getBalanceSheet({
            startDate,
            endDate
        });


    const totalAssets =
        calculateTotalAssets(balanceSheet);

    const totalLiabilities =
        calculateTotalLiabilities(balanceSheet);

    const totalEquity =
        calculateTotalEquity(balanceSheet);

    const balanceSheetDifference =
        totalAssets - (totalLiabilities + totalEquity);

    const balanceSheetBalanced =
        Math.abs(balanceSheetDifference) < 0.01;


    /*
    ==============================================
    FINANCIAL POSITION
    ==============================================
    */

    const cashAndBank =
        getCashAndBank(balanceSheet);

    const receivables =
        getAccountBalance(
            balanceSheet,
            "1030"
        );

    const inventory =
        getAccountBalance(
        balanceSheet,
        "1040"
    );

    const payables =
        getAccountBalance(
            balanceSheet,
            "2010"
        );

    const loans =
        getAccountBalance(
            balanceSheet,
            "2020"
        );


    /*
    ==============================================
    WORKING CAPITAL
    ==============================================
    */

    const currentAssets =
        getCurrentAssetAccounts(
            balanceSheet
        );

    const currentLiabilities =
        getCurrentLiabilityAccounts(
            balanceSheet
        );

    const workingCapital =
        currentAssets -
        currentLiabilities;

    const currentRatio =
        currentLiabilities !== 0
            ? currentAssets /
              currentLiabilities
            : 0;


    /*
    ==============================================
    PROFIT MARGIN
    ==============================================
    */

    const profitMargin =
        revenue !== 0
            ? (netProfit / revenue) * 100
            : 0;


    /*
    ==============================================
    RETURN DASHBOARD
    ==============================================
    */

    return {
        period: {
            startDate,
            endDate
        },

        financialPosition: {
            totalAssets,
            totalLiabilities,
            totalEquity,
            cashAndBank: cashAndBank.total,
            cash: cashAndBank.cash,
            bank: cashAndBank.bank,
            receivables,
            inventory,
            payables,
            loans,
            balanceSheetDifference,
            balanceSheetBalanced
        },

        workingCapital: {
            currentAssets,
            currentLiabilities,
            workingCapital,
            currentRatio
        },

        performance: {
            revenue,
            expenses,
            netProfit,
            profitMargin
        },

        cashFlowStatement,

        cashFlow: {
            openingCash,
            closingCash,
            netCashFlow
        },

        receivablesPayables: {
            totalReceivables,
            overdueReceivables,

            receivableAging: {
                current: receivableAgingTotals.current,
                days1to30: receivableAgingTotals.days1to30,
                days31to60: receivableAgingTotals.days31to60,
                days61to90: receivableAgingTotals.days61to90,
                days91to120: receivableAgingTotals.days91to120,
                days120Plus: receivableAgingTotals.days120Plus
            },

            totalPayables,
            overduePayables,

            payableAging: {
                current: payableAgingTotals.current,
                days1to30: payableAgingTotals.days1to30,
                days31to60: payableAgingTotals.days31to60,
                days61to90: payableAgingTotals.days61to90,
                days91to120: payableAgingTotals.days91to120,
                days120Plus: payableAgingTotals.days120Plus
            },

            netReceivablePosition
        }
    };
}