// js/incomeStatementTable.js

import {
    getIncomeStatement
} from "./incomeStatement.js";

import {
    getAccountByCode
} from "./accounts.js";


// ------------------------------------
// ELEMENTS
// ------------------------------------

const fromDate =
    document.getElementById(
        "incomeFromDate"
    );

const toDate =
    document.getElementById(
        "incomeToDate"
    );

const filterButton =
    document.getElementById(
        "filterIncomeStatement"
    );

const resetButton =
    document.getElementById(
        "resetIncomeStatement"
    );

const printButton =
    document.getElementById(
        "printIncomeStatement"
    );

const revenueBody =
    document.getElementById(
        "incomeRevenueBody"
    );

const expenseBody =
    document.getElementById(
        "incomeExpenseBody"
    );

const totalRevenueElement =
    document.getElementById(
        "incomeTotalRevenue"
    );

const totalExpensesElement =
    document.getElementById(
        "incomeTotalExpenses"
    );

const netProfitElement =
    document.getElementById(
        "incomeNetProfit"
    );


// ------------------------------------
// FORMAT MONEY
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
// DISPLAY INCOME STATEMENT
// ------------------------------------

export function displayIncomeStatement() {

    const statement =
        getIncomeStatement({

            startDate:
                fromDate.value,

            endDate:
                toDate.value

        });


    // --------------------------------
    // REVENUE
    // --------------------------------

    revenueBody.innerHTML = "";


    const revenueEntries =
        Object.entries(
            statement.revenue || {}
        );


    if (
        revenueEntries.length === 0
    ) {

        revenueBody.innerHTML = `
            <tr>
                <td colspan="3">
                    No revenue recorded.
                </td>
            </tr>
        `;

    } else {

        revenueEntries.forEach(
            ([accountCode, amount]) => {

                const account =
                    getAccountByCode(
                        accountCode
                    );


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${accountCode}
                    </td>

                    <td>
                        ${
                            account
                                ? account.name
                                : "Unknown Account"
                        }
                    </td>

                    <td>
                        ${formatCurrency(amount)}
                    </td>

                `;


                revenueBody.appendChild(row);

            }
        );

    }


    // --------------------------------
    // EXPENSES
    // --------------------------------

    expenseBody.innerHTML = "";


    const expenseEntries =
        Object.entries(
            statement.expenses || {}
        );


    if (
        expenseEntries.length === 0
    ) {

        expenseBody.innerHTML = `
            <tr>
                <td colspan="3">
                    No expenses recorded.
                </td>
            </tr>
        `;

    } else {

        expenseEntries.forEach(
            ([accountCode, amount]) => {

                const account =
                    getAccountByCode(
                        accountCode
                    );


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${accountCode}
                    </td>

                    <td>
                        ${
                            account
                                ? account.name
                                : "Unknown Account"
                        }
                    </td>

                    <td>
                        ${formatCurrency(amount)}
                    </td>

                `;


                expenseBody.appendChild(row);

            }
        );

    }


    // --------------------------------
    // TOTALS
    // --------------------------------

    totalRevenueElement.textContent =
        formatCurrency(
            statement.totalRevenue
        );


    totalExpensesElement.textContent =
        formatCurrency(
            statement.totalExpenses
        );


    netProfitElement.textContent =
        formatCurrency(
            statement.netProfit
        );

}


// ------------------------------------
// FILTER
// ------------------------------------

filterButton.addEventListener(
    "click",
    displayIncomeStatement
);


// ------------------------------------
// RESET
// ------------------------------------

resetButton.addEventListener(
    "click",
    function () {

        fromDate.value = "";

        toDate.value = "";

        displayIncomeStatement();

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

displayIncomeStatement();