// js/incomeStatementTable.js

import {
    getIncomeStatement
} from "./incomeStatement.js";


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


    if (
        statement.revenue.length === 0
    ) {

        revenueBody.innerHTML = `
            <tr>
                <td colspan="3">
                    No revenue recorded.
                </td>
            </tr>
        `;

    }


    statement.revenue.forEach(
        item => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${item.code}
                </td>

                <td>
                    ${item.name}
                </td>

                <td>
                    ${formatCurrency(
                        item.amount
                    )}
                </td>

            `;


            revenueBody.appendChild(row);

        }
    );


    // --------------------------------
    // EXPENSES
    // --------------------------------

    expenseBody.innerHTML = "";


    if (
        statement.expenses.length === 0
    ) {

        expenseBody.innerHTML = `
            <tr>
                <td colspan="3">
                    No expenses recorded.
                </td>
            </tr>
        `;

    }


    statement.expenses.forEach(
        item => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${item.code}
                </td>

                <td>
                    ${item.name}
                </td>

                <td>
                    ${formatCurrency(
                        item.amount
                    )}
                </td>

            `;


            expenseBody.appendChild(row);

        }
    );


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