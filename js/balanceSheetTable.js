// js/balanceSheetTable.js

import {
    getBalanceSheet,
    calculateTotalAssets,
    calculateTotalLiabilities,
    calculateTotalEquity
} from "./balanceSheet.js";


// ------------------------------------
// ELEMENTS
// ------------------------------------

const endDate =
    document.getElementById(
        "balanceSheetDate"
    );

const filterButton =
    document.getElementById(
        "filterBalanceSheet"
    );

const resetButton =
    document.getElementById(
        "resetBalanceSheet"
    );

const printButton =
    document.getElementById(
        "printBalanceSheet"
    );

const assetsBody =
    document.getElementById(
        "balanceSheetAssetsBody"
    );

const liabilitiesBody =
    document.getElementById(
        "balanceSheetLiabilitiesBody"
    );

const totalAssetsElement =
    document.getElementById(
        "balanceSheetTotalAssets"
    );

const accumulatedDepreciationElement =
    document.getElementById(
        "balanceSheetAccumulatedDepreciation"
    );

const totalLiabilitiesElement =
    document.getElementById(
        "balanceSheetTotalLiabilities"
    );

const capitalElement =
    document.getElementById(
        "balanceSheetCapital"
    );

const retainedEarningsElement =
    document.getElementById(
        "balanceSheetRetainedEarnings"
    );

const currentProfitElement =
    document.getElementById(
        "balanceSheetCurrentProfit"
    );

const totalEquityElement =
    document.getElementById(
        "balanceSheetTotalEquity"
    );

const liabilitiesEquityElement =
    document.getElementById(
        "balanceSheetLiabilitiesEquity"
    );

const differenceElement =
    document.getElementById(
        "balanceSheetDifference"
    );

const statusElement =
    document.getElementById(
        "balanceSheetStatus"
    );


// ------------------------------------
// FORMAT CURRENCY
// ------------------------------------

function formatCurrency(amount) {

    return Number(amount || 0)
        .toLocaleString(
            "en-NG",
            {
                style: "currency",
                currency: "NGN"
            }
        );

}


// ------------------------------------
// DISPLAY BALANCE SHEET
// ------------------------------------

export function displayBalanceSheet() {

    const reportingDate =
        endDate.value;


    // --------------------------------
    // VALIDATE DATE
    // --------------------------------

    if (!reportingDate) {

        statusElement.textContent =
            "Please select a balance sheet date.";

        return;

    }


    // --------------------------------
    // GET BALANCE SHEET
    // --------------------------------

    const statement =
        getBalanceSheet({

            endDate:
                reportingDate

        });


    // --------------------------------
    // ASSETS
    // --------------------------------

    assetsBody.innerHTML = "";


    const assetEntries =
        Object.values(
            statement.assets || {}
        );


    if (
        assetEntries.length === 0
    ) {

        assetsBody.innerHTML = `
            <tr>
                <td colspan="3">
                    No assets recorded.
                </td>
            </tr>
        `;

    } else {

        assetEntries.forEach(
            asset => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${asset.code}
                    </td>

                    <td>
                        ${asset.name}
                    </td>

                    <td>
                        ${formatCurrency(
                            asset.balance
                        )}
                    </td>

                `;


                assetsBody.appendChild(row);

            }
        );

    }


    // --------------------------------
    // TOTAL ASSETS
    // --------------------------------

    const totalAssets =
        calculateTotalAssets(
            statement
        );


    totalAssetsElement.textContent =
        formatCurrency(
            totalAssets
        );


    // --------------------------------
    // LIABILITIES
    // --------------------------------

    liabilitiesBody.innerHTML = "";


    const liabilityEntries =
        Object.values(
            statement.liabilities || {}
        );


    if (
        liabilityEntries.length === 0
    ) {

        liabilitiesBody.innerHTML = `
            <tr>
                <td colspan="3">
                    No liabilities recorded.
                </td>
            </tr>
        `;

    } else {

        liabilityEntries.forEach(
            liability => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${liability.code}
                    </td>

                    <td>
                        ${liability.name}
                    </td>

                    <td>
                        ${formatCurrency(
                            liability.balance
                        )}
                    </td>

                `;


                liabilitiesBody.appendChild(row);

            }
        );

    }


    // --------------------------------
    // TOTAL LIABILITIES
    // --------------------------------

    const totalLiabilities =
        calculateTotalLiabilities(
            statement
        );


    totalLiabilitiesElement.textContent =
        formatCurrency(
            totalLiabilities
        );


    // --------------------------------
    // EQUITY
    // --------------------------------

    const equityEntries =
        Object.values(
            statement.equity || {}
        );


    /*
     * Separate the equity accounts for
     * presentation.
     *
     * 3030 = Owner's Drawings
     */

    let capital = 0;
    let retainedEarnings = 0;
    let drawings = 0;


    equityEntries.forEach(
        account => {

            if (
                account.code === "3030"
            ) {

                drawings +=
                    Math.abs(
                        account.balance
                    );

                return;

            }


            /*
             * Account 3000 is treated as
             * Owner's Capital.
             *
             * Other equity accounts are
             * displayed as retained/equity.
             */

            if (
                account.code === "3000"
            ) {

                capital +=
                    account.balance;

            } else {

                retainedEarnings +=
                    account.balance;

            }

        }
    );


    capitalElement.textContent =
        formatCurrency(
            capital
        );


    retainedEarningsElement.textContent =
        formatCurrency(
            retainedEarnings
        );


    currentProfitElement.textContent =
        formatCurrency(
            statement.currentYearProfitIncluded
        );


    const totalEquity =
        calculateTotalEquity(
            statement
        );


    totalEquityElement.textContent =
        formatCurrency(
            totalEquity
        );


    // --------------------------------
    // LIABILITIES + EQUITY
    // --------------------------------

    const liabilitiesAndEquity =
        totalLiabilities +
        totalEquity;


    liabilitiesEquityElement.textContent =
        formatCurrency(
            liabilitiesAndEquity
        );


    // --------------------------------
    // ACCUMULATED DEPRECIATION
    // --------------------------------

    const accumulatedDepreciation =
        Object.values(
            statement.assets || {}
        )
        .filter(
            account =>
                account.type === "contra_asset"
        )
        .reduce(
            (
                total,
                account
            ) =>
                total +
                Math.abs(
                    account.balance
                ),
            0
        );


    accumulatedDepreciationElement
        .textContent =
        formatCurrency(
            accumulatedDepreciation
        );


    // --------------------------------
    // BALANCE CHECK
    // --------------------------------

    const difference =
        totalAssets -
        liabilitiesAndEquity;


    differenceElement.textContent =
        formatCurrency(
            difference
        );


    if (
        Math.abs(difference) < 0.01
    ) {

        statusElement.textContent =
            "✓ BALANCE SHEET BALANCED";

    } else {

        statusElement.textContent =
            "⚠ BALANCE SHEET DOES NOT BALANCE";

    }

}

// ------------------------------------
// FILTER
// ------------------------------------

filterButton.addEventListener(
    "click",
    displayBalanceSheet
);


// ------------------------------------
// RESET
// ------------------------------------

resetButton.addEventListener(
    "click",
    function () {

        endDate.value =
            new Date()
                .toISOString()
                .split("T")[0];

        displayBalanceSheet();

    }
);


// ------------------------------------
// PRINT
// ------------------------------------

printButton.addEventListener(
    "click",
    function () {

        window.print();

    }
);


// ------------------------------------
// INITIAL DISPLAY
// ------------------------------------

if (!endDate.value) {

    endDate.value =
        new Date()
            .toISOString()
            .split("T")[0];

}

displayBalanceSheet();