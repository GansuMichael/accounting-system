// js/receivablesPayablesTable.js

import {
    getAccountsReceivable,
    getAccountsPayable,
    getReceivableMovements,
    getPayableMovements
} from "./receivablesPayables.js";


// ------------------------------------
// ELEMENTS
// ------------------------------------

const fromDate =
    document.getElementById(
        "arApFromDate"
    );

const toDate =
    document.getElementById(
        "arApToDate"
    );

const filterButton =
    document.getElementById(
        "filterArAp"
    );

const resetButton =
    document.getElementById(
        "resetArAp"
    );

const printButton =
    document.getElementById(
        "printArAp"
    );


const receivableTotal =
    document.getElementById(
        "totalAccountsReceivable"
    );

const payableTotal =
    document.getElementById(
        "totalAccountsPayable"
    );


const receivableBody =
    document.getElementById(
        "receivableBody"
    );

const payableBody =
    document.getElementById(
        "payableBody"
    );


// ------------------------------------
// CURRENCY
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
// DISPLAY REPORT
// ------------------------------------

export function displayReceivablesPayables() {

    const options = {

        startDate:
            fromDate.value,

        endDate:
            toDate.value

    };


    const receivable =
        getAccountsReceivable(
            options
        );


    const payable =
        getAccountsPayable(
            options
        );


    receivableTotal.textContent =
        formatCurrency(
            receivable.balance
        );


    payableTotal.textContent =
        formatCurrency(
            payable.balance
        );


    displayReceivableMovements(
        options
    );


    displayPayableMovements(
        options
    );

}


// ------------------------------------
// RECEIVABLE MOVEMENTS
// ------------------------------------

function displayReceivableMovements(
    options
) {

    const movements =
        getReceivableMovements(
            options
        );


    receivableBody.innerHTML =
        "";


    if (
        movements.length === 0
    ) {

        receivableBody.innerHTML = `

            <tr>

                <td colspan="6">
                    No receivable transactions found.
                </td>

            </tr>

        `;

        return;

    }


    movements.forEach(
        movement => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${movement.date}
                </td>

                <td>
                    ${movement.reference}
                </td>

                <td>
                    ${movement.description}
                </td>

                <td>
                    ${formatCurrency(
                        movement.debit
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        movement.credit
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        movement.balanceChange
                    )}
                </td>

            `;


            receivableBody.appendChild(
                row
            );

        }
    );

}


// ------------------------------------
// PAYABLE MOVEMENTS
// ------------------------------------

function displayPayableMovements(
    options
) {

    const movements =
        getPayableMovements(
            options
        );


    payableBody.innerHTML =
        "";


    if (
        movements.length === 0
    ) {

        payableBody.innerHTML = `

            <tr>

                <td colspan="6">
                    No payable transactions found.
                </td>

            </tr>

        `;

        return;

    }


    movements.forEach(
        movement => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${movement.date}
                </td>

                <td>
                    ${movement.reference}
                </td>

                <td>
                    ${movement.description}
                </td>

                <td>
                    ${formatCurrency(
                        movement.debit
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        movement.credit
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        movement.balanceChange
                    )}
                </td>

            `;


            payableBody.appendChild(
                row
            );

        }
    );

}


// ------------------------------------
// FILTER
// ------------------------------------

filterButton.addEventListener(
    "click",
    displayReceivablesPayables
);


// ------------------------------------
// RESET
// ------------------------------------

resetButton.addEventListener(
    "click",
    function () {

        fromDate.value =
            "";

        toDate.value =
            "";

        displayReceivablesPayables();

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
// INITIALIZE
// ------------------------------------

displayReceivablesPayables();