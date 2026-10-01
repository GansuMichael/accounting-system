import { getDashboard } from "./dashboard.js";


/*
==================================================
ELEMENTS
==================================================
*/

const fromDate =
    document.getElementById("dashboardFromDate");

const toDate =
    document.getElementById("dashboardToDate");

const refreshButton =
    document.getElementById("refreshDashboard");


/*
==================================================
FORMAT NUMBER
==================================================
*/

function formatAmount(value) {

    return Number(value || 0).toLocaleString(
        undefined,
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}


function formatPercentage(value) {

    return `${Number(value || 0).toFixed(2)}%`;
}


function formatRatio(value) {

    return Number(value || 0).toFixed(2);
}


/*
==================================================
SET DEFAULT DATES
==================================================
*/

function setDefaultDates() {

    const today =
        new Date().toISOString().split("T")[0];

    const year =
        today.slice(0, 4);

    if (!fromDate.value) {
        fromDate.value =
            `${year}-01-01`;
    }

    if (!toDate.value) {
        toDate.value = today;
    }
}


/*
==================================================
UPDATE FINANCIAL POSITION
==================================================
*/

function updateFinancialPosition(
    financialPosition
) {

    const totalAssets =
        document.getElementById(
            "cardTotalAssets"
        );

    const totalLiabilities =
        document.getElementById(
            "cardTotalLiabilities"
        );

    const totalEquity =
        document.getElementById(
            "cardTotalEquity"
        );

    const cashBank =
        document.getElementById(
            "cardCashBank"
        );

    const cash =
        document.getElementById(
            "cardCash"
        );

    const bank =
        document.getElementById(
            "cardBank"
        );

    const receivables =
        document.getElementById(
            "cardReceivables"
        );

    const payables =
        document.getElementById(
            "cardPayables"
        );

    const loans =
        document.getElementById(
            "cardLoans"
        );

    const balanceSheetStatus =
        document.getElementById(
            "cardBalanceSheetStatus"
        );

    const balanceSheetDifference =
        document.getElementById(
            "cardBalanceSheetDifference"
        );


    if (totalAssets) {
        totalAssets.textContent =
            formatAmount(
                financialPosition.totalAssets
            );
    }

    if (totalLiabilities) {
        totalLiabilities.textContent =
            formatAmount(
                financialPosition.totalLiabilities
            );
    }

    if (totalEquity) {
        totalEquity.textContent =
            formatAmount(
                financialPosition.totalEquity
            );
    }

    if (cashBank) {
        cashBank.textContent =
            formatAmount(
                financialPosition.cashAndBank
            );
    }

    if (cash) {
        cash.textContent =
            formatAmount(
                financialPosition.cash
            );
    }
    
    if (bank) {
        bank.textContent =
            formatAmount(
                financialPosition.bank
            );
    }

    if (receivables) {
        receivables.textContent =
            formatAmount(
                financialPosition.receivables
            );
    }

    if (payables) {
        payables.textContent =
            formatAmount(
                financialPosition.payables
            );
    }

    if (loans) {
        loans.textContent =
            formatAmount(
                financialPosition.loans
            );
    }

    if (balanceSheetStatus) {

        balanceSheetStatus.textContent =
            financialPosition.balanceSheetBalanced
                ? "BALANCED"
                : "NOT BALANCED";
    }
    
    
    if (balanceSheetDifference) {
    
        balanceSheetDifference.textContent =
            formatAmount(
                financialPosition.balanceSheetDifference
            );
    }
}


/*
==================================================
UPDATE WORKING CAPITAL
==================================================
*/

function updateWorkingCapital(
    workingCapital,
    financialPosition
) {

    const currentAssets =
        document.getElementById(
            "cardCurrentAssets"
        );

    const currentLiabilities =
        document.getElementById(
            "cardCurrentLiabilities"
        );

    const workingCapitalCard =
        document.getElementById(
            "cardWorkingCapital"
        );

    const currentRatio =
        document.getElementById(
            "cardCurrentRatio"
        );

    const workingCash =
        document.getElementById(
            "cardWorkingCash"
        );

    const workingReceivables =
        document.getElementById(
            "cardWorkingReceivables"
        );

    const workingInventory =
        document.getElementById(
            "cardWorkingInventory"
        );


    if (currentAssets) {
        currentAssets.textContent =
            formatAmount(
                workingCapital.currentAssets
            );
    }

    if (currentLiabilities) {
        currentLiabilities.textContent =
            formatAmount(
                workingCapital.currentLiabilities
            );
    }

    if (workingCapitalCard) {
        workingCapitalCard.textContent =
            formatAmount(
                workingCapital.workingCapital
            );
    }

    if (currentRatio) {
        currentRatio.textContent =
            formatRatio(
                workingCapital.currentRatio
            );
    }

    if (workingCash) {
        workingCash.textContent =
            formatAmount(
                financialPosition.cashAndBank
            );
    }
    
    if (workingReceivables) {
        workingReceivables.textContent =
            formatAmount(
                financialPosition.receivables
            );
    }
    
    if (workingInventory) {
        workingInventory.textContent =
            formatAmount(
                financialPosition.inventory
            );
    }
}


/*
==================================================
UPDATE PERFORMANCE
==================================================
*/

function updatePerformance(
    performance
) {

    const revenue =
        document.getElementById(
            "cardRevenue"
        );

    const expenses =
        document.getElementById(
            "cardExpenses"
        );

    const netProfit =
        document.getElementById(
            "cardNetProfit"
        );

    const profitMargin =
        document.getElementById(
            "cardProfitMargin"
        );


    if (revenue) {
        revenue.textContent =
            formatAmount(
                performance.revenue
            );
    }

    if (expenses) {
        expenses.textContent =
            formatAmount(
                performance.expenses
            );
    }

    if (netProfit) {
        netProfit.textContent =
            formatAmount(
                performance.netProfit
            );
    }

    if (profitMargin) {
        profitMargin.textContent =
            formatPercentage(
                performance.profitMargin
            );
    }
}


/*
==================================================
REFRESH DASHBOARD
==================================================
*/



function updateAgingBreakdown(receivablesPayables) {
    const receivableAging =
        receivablesPayables.receivableAging || {};

    const payableAging =
        receivablesPayables.payableAging || {};

    const receivableCurrent =
        document.getElementById("cardReceivableCurrent");

    const receivable1to30 =
        document.getElementById("cardReceivable1to30");

    const receivable31to60 =
        document.getElementById("cardReceivable31to60");

    const receivable61to90 =
        document.getElementById("cardReceivable61to90");

    const receivable91to120 =
        document.getElementById("cardReceivable91to120");

    const receivable120Plus =
        document.getElementById("cardReceivable120Plus");

    const payableCurrent =
        document.getElementById("cardPayableCurrent");

    const payable1to30 =
        document.getElementById("cardPayable1to30");

    const payable31to60 =
        document.getElementById("cardPayable31to60");

    const payable61to90 =
        document.getElementById("cardPayable61to90");

    const payable91to120 =
        document.getElementById("cardPayable91to120");

    const payable120Plus =
        document.getElementById("cardPayable120Plus");

    if (receivableCurrent)
        receivableCurrent.textContent =
            formatAmount(receivableAging.current);

    if (receivable1to30)
        receivable1to30.textContent =
            formatAmount(receivableAging.days1to30);

    if (receivable31to60)
        receivable31to60.textContent =
            formatAmount(receivableAging.days31to60);

    if (receivable61to90)
        receivable61to90.textContent =
            formatAmount(receivableAging.days61to90);

    if (receivable91to120)
        receivable91to120.textContent =
            formatAmount(receivableAging.days91to120);

    if (receivable120Plus)
        receivable120Plus.textContent =
            formatAmount(receivableAging.days120Plus);

    if (payableCurrent)
        payableCurrent.textContent =
            formatAmount(payableAging.current);

    if (payable1to30)
        payable1to30.textContent =
            formatAmount(payableAging.days1to30);

    if (payable31to60)
        payable31to60.textContent =
            formatAmount(payableAging.days31to60);

    if (payable61to90)
        payable61to90.textContent =
            formatAmount(payableAging.days61to90);

    if (payable91to120)
        payable91to120.textContent =
            formatAmount(payableAging.days91to120);

    if (payable120Plus)
        payable120Plus.textContent =
            formatAmount(payableAging.days120Plus);
}

function updateCashFlow(cashFlow) {

    const openingCash =
        document.getElementById(
            "cardOpeningCash"
        );

    const netCashFlow =
        document.getElementById(
            "cardNetCashFlow"
        );

    const closingCash =
        document.getElementById(
            "cardClosingCash"
        );


    if (openingCash) {
        openingCash.textContent =
            formatAmount(
                cashFlow.openingCash
            );
    }


    if (netCashFlow) {
        netCashFlow.textContent =
            formatAmount(
                cashFlow.netCashFlow
            );
    }


    if (closingCash) {
        closingCash.textContent =
            formatAmount(
                cashFlow.closingCash
            );
    }

}

function updateReceivablesPayables(
    receivablesPayables
) {

    const totalReceivables =
        document.getElementById(
            "cardTotalReceivables"
        );

    const overdueReceivables =
        document.getElementById(
            "cardOverdueReceivables"
        );

    const totalPayables =
        document.getElementById(
            "cardTotalPayables"
        );

    const overduePayables =
        document.getElementById(
            "cardOverduePayables"
        );

    const netReceivablePosition =
        document.getElementById(
            "cardNetReceivablePosition"
        );


    if (totalReceivables) {

        totalReceivables.textContent =
            formatAmount(
                receivablesPayables.totalReceivables
            );

    }


    if (overdueReceivables) {

        overdueReceivables.textContent =
            formatAmount(
                receivablesPayables.overdueReceivables
            );

    }


    if (totalPayables) {

        totalPayables.textContent =
            formatAmount(
                receivablesPayables.totalPayables
            );

    }


    if (overduePayables) {

        overduePayables.textContent =
            formatAmount(
                receivablesPayables.overduePayables
            );

    }


    if (netReceivablePosition) {

        netReceivablePosition.textContent =
            formatAmount(
                receivablesPayables.netReceivablePosition
            );

    }

}


export function refreshDashboard() {

    try {

        const startDate =
            fromDate.value;

        const endDate =
            toDate.value;


        if (!startDate) {
            throw new Error(
                "Dashboard start date is required."
            );
        }

        if (!endDate) {
            throw new Error(
                "Dashboard end date is required."
            );
        }

        if (startDate > endDate) {
            throw new Error(
                "Dashboard start date cannot be after end date."
            );
        }


        const dashboard =
            getDashboard({
                startDate,
                endDate
            });

            

        updateFinancialPosition(
            dashboard.financialPosition
        );

        updateWorkingCapital(
            dashboard.workingCapital,
            dashboard.financialPosition
        );

        updatePerformance(
            dashboard.performance
        );

        updateCashFlow(
            dashboard.cashFlow
        );

        updateReceivablesPayables(
            dashboard.receivablesPayables
        );

        updateAgingBreakdown(
            dashboard.receivablesPayables
        );


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

        alert(error.message);
    }
}


/*
==================================================
EVENTS
==================================================
*/

if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        refreshDashboard
    );

}


/*
==================================================
TRANSACTION UPDATE
==================================================
*/

document.addEventListener(
    "transactionsUpdated",
    refreshDashboard
);


/*
==================================================
INITIALIZE
==================================================
*/

setDefaultDates();

refreshDashboard();