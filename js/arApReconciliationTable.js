// js/arApReconciliationTable.js

import {
    getArApReconciliation
} from "./arApReconciliation.js";


// ============================================
// ELEMENTS
// ============================================

const dateInput =
    document.getElementById(
        "reconciliationDate"
    );

const calculateButton =
    document.getElementById(
        "calculateReconciliation"
    );

const resetButton =
    document.getElementById(
        "resetReconciliation"
    );

const printButton =
    document.getElementById(
        "printReconciliation"
    );

const body =
    document.getElementById(
        "reconciliationBody"
    );


// ============================================
// CURRENCY
// ============================================

function formatCurrency(
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
// RENDER
// ============================================

function render(
    result
) {

    const receivables =
        result.receivables;

    const payables =
        result.payables;


    body.innerHTML = `

        <tr>

            <td>
                1030
            </td>

            <td>
                Accounts Receivable
            </td>

            <td>
                ${formatCurrency(
                    receivables.generalLedger
                )}
            </td>

            <td>
                ${formatCurrency(
                    receivables.expected
                )}
            </td>

            <td>
                ${formatCurrency(
                    receivables.difference
                )}
            </td>

            <td>
                ${
                    receivables.reconciled
                        ? "RECONCILED"
                        : "DIFFERENCE"
                }
            </td>

        </tr>


        <tr>

            <td>
                2010
            </td>

            <td>
                Accounts Payable
            </td>

            <td>
                ${formatCurrency(
                    payables.generalLedger
                )}
            </td>

            <td>
                ${formatCurrency(
                    payables.expected
                )}
            </td>

            <td>
                ${formatCurrency(
                    payables.difference
                )}
            </td>

            <td>
                ${
                    payables.reconciled
                        ? "RECONCILED"
                        : "DIFFERENCE"
                }
            </td>

        </tr>

    `;

}


// ============================================
// CALCULATE
// ============================================

calculateButton.addEventListener(
    "click",
    function () {

        try {

            const result =
                getArApReconciliation(
                    dateInput.value
                );


            render(
                result
            );

        }

        catch (error) {

            console.error(
                error
            );

            alert(
                error.message
            );

        }

    }
);


// ============================================
// RESET
// ============================================

resetButton.addEventListener(
    "click",
    function () {

        dateInput.value =
            "";

        body.innerHTML =
            "";

    }
);


// ============================================
// PRINT
// ============================================

printButton.addEventListener(
    "click",
    function () {

        window.print();

    }
);