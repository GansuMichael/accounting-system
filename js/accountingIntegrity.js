// js/accountingIntegrity.js

import {
    getBalanceSheet,
    calculateTotalAssets,
    calculateTotalLiabilities,
    calculateTotalEquity
} from "./balanceSheet.js";

import {
    reconcileCashFlow
} from "./cashFlowStatement.js";

import {
    getTrialBalanceTotals
} from "./trialBalance.js";

import {
    reconcileReceivables,
    reconcilePayables
} from "./arApReconciliation.js";


// ============================================
// BALANCE SHEET CHECK
// ============================================

export function checkBalanceSheet(
    endDate
) {

    const balanceSheet =
        getBalanceSheet({

            endDate

        });


    const assets =
        calculateTotalAssets(
            balanceSheet
        );


    const liabilities =
        calculateTotalLiabilities(
            balanceSheet
        );


    const equity =
        calculateTotalEquity(
            balanceSheet
        );


    const difference =
        assets -
        (
            liabilities +
            equity
        );


    return {

        assets,

        liabilities,

        equity,

        difference,

        balanced:
            Math.abs(difference) < 0.01

    };

}


// ============================================
// TRIAL BALANCE CHECK
// ============================================

export function checkTrialBalance(
    endDate
) {

    const result =
        getTrialBalanceTotals({

            endDate

        });


    return {

        totalDebit:
            result.totalDebit,

        totalCredit:
            result.totalCredit,

        difference:
            result.totalDebit -
            result.totalCredit,

        balanced:
            result.balanced

    };

}


// ============================================
// A/R CHECK
// ============================================

export function checkReceivables(
    endDate
) {

    const result =
        reconcileReceivables(
            endDate
        );


    return {

        generalLedger:
            result.generalLedger,

        invoices:
            result.invoices,

        unallocatedCredits:
            result.unallocatedCredits,

        expected:
            result.expected,

        difference:
            result.difference,

        reconciled:
            result.reconciled

    };

}


// ============================================
// A/P CHECK
// ============================================

export function checkPayables(
    endDate
) {

    const result =
        reconcilePayables(
            endDate
        );


    return {

        generalLedger:
            result.generalLedger,

        bills:
            result.bills,

        prepayments:
            result.supplierPrepayments,

        expected:
            result.expected,

        difference:
            result.difference,

        reconciled:
            result.reconciled

    };

}


// ============================================
// COMPLETE ACCOUNTING CHECK
// ============================================

export function runAccountingIntegrityCheck({

    startDate,

    endDate

}) {

    const cashFlow =
        reconcileCashFlow({

            startDate,

            endDate

        });


    const balanceSheet =
        checkBalanceSheet(
            endDate
        );


    const trialBalance =
        checkTrialBalance(
            endDate
        );


    const receivables =
        checkReceivables(
            endDate
        );


    const payables =
        checkPayables(
            endDate
        );


    const checks = [

        {

            name:
                "Cash Flow",

            passed:
                cashFlow.reconciled,

            difference:
                cashFlow.difference

        },

        {

            name:
                "Balance Sheet",

            passed:
                balanceSheet.balanced,

            difference:
                balanceSheet.difference

        },

        {

            name:
                "Trial Balance",

            passed:
                trialBalance.balanced,

            difference:
                trialBalance.difference

        },

        {

            name:
                "Accounts Receivable",

            passed:
                receivables.reconciled,

            difference:
                receivables.difference

        },

        {

            name:
                "Accounts Payable",

            passed:
                payables.reconciled,

            difference:
                payables.difference

        }

    ];


    const passed =
        checks.every(
            check =>
                check.passed
        );


    return {

        passed,

        checks,

        cashFlow,

        balanceSheet,

        trialBalance,

        receivables,

        payables

    };

}