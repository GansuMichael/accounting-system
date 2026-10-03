
/**
 * GANSU Accounting System
 * Dashboard Card Styling Engine
 *
 * Responsibilities:
 * 1. Assign colors to dashboard cards.
 * 2. Identify cards by financial category.
 * 3. Preserve existing HTML IDs and values.
 * 4. Apply consistent styling across dashboard sections.
 */

const DashboardCards = (() => {

    const categoryColors = {
        asset: "#2e7d32",
        liability: "#c62828",
        equity: "#6a1b9a",
        cash: "#00897b",
        bank: "#1565c0",
        receivable: "#0288d1",
        inventory: "#ef6c00",
        payable: "#d84315",
        loan: "#ad1457",
        revenue: "#388e3c",
        expense: "#e53935",
        profit: "#7b1fa2",
        workingCapital: "#00838f",
        ratio: "#455a64",
        aging: "#f9a825",
        status: "#546e7a",
        neutral: "#607d8b"
    };

    // Map existing dashboard IDs to their categories.
    const cardCategories = {

        // Financial position
        cardTotalAssets: "asset",
        cardTotalLiabilities: "liability",
        cardTotalEquity: "equity",
        cardCashBank: "cash",
        cardCash: "cash",
        cardBank: "bank",
        cardReceivables: "receivable",
        cardInventory: "inventory",
        cardPayables: "payable",
        cardLoans: "loan",
        cardBalanceSheetStatus: "status",
        cardBalanceSheetDifference: "status",

        // Working capital
        cardCurrentAssets: "asset",
        cardCurrentLiabilities: "liability",
        cardWorkingCapital: "workingCapital",
        cardCurrentRatio: "ratio",
        cardWorkingCash: "cash",
        cardWorkingReceivables: "receivable",
        cardWorkingInventory: "inventory",

        // Receivables and payables
        cardTotalReceivables: "receivable",
        cardOverdueReceivables: "aging",
        cardTotalPayables: "payable",
        cardOverduePayables: "aging",
        cardNetReceivablePosition: "workingCapital",

        // Receivables aging
        cardReceivableCurrent: "receivable",
        cardReceivable1to30: "aging",
        cardReceivable31to60: "aging",
        cardReceivable61to90: "aging",
        cardReceivable91to120: "aging",
        cardReceivable120Plus: "aging",

        // Payables aging
        cardPayableCurrent: "payable",
        cardPayable1to30: "aging",
        cardPayable31to60: "aging",
        cardPayable61to90: "aging",
        cardPayable91to120: "aging",
        cardPayable120Plus: "aging",

        // Performance
        cardRevenue: "revenue",
        cardExpenses: "expense",
        cardNetProfit: "profit",
        cardProfitMargin: "profit",

        // Cash flow
        cardOpeningCash: "cash",
        cardNetCashFlow: "workingCapital",
        cardClosingCash: "bank"
    };

    function applyColors() {

        Object.entries(cardCategories).forEach(
            ([elementId, category]) => {

                const valueElement =
                    document.getElementById(elementId);

                if (!valueElement) {
                    return;
                }

                const card = valueElement.closest(
                    ".dashboard-card"
                );

                if (!card) {
                    return;
                }

                const color =
                    categoryColors[category] ||
                    categoryColors.neutral;

                card.style.setProperty(
                    "--dashboard-card-color",
                    color
                );

                card.dataset.cardCategory = category;

                card.classList.add("dashboard-card-colored");
            }
        );
    }

    function refresh() {
        applyColors();
    }

    return {
        applyColors,
        refresh
    };

})();

// Make the module available to other dashboard scripts.
window.DashboardCards = DashboardCards;

// Apply colors after the HTML document is ready.
if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        DashboardCards.applyColors
    );

} else {

    DashboardCards.applyColors();

}