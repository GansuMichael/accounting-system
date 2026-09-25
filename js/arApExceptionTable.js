// js/arApExceptionTable.js

import {
    getReceivableExceptions,
    getPayableExceptions
} from "./arApReconciliation.js";


// ============================================
// ELEMENTS
// ============================================

const typeSelect =
    document.getElementById(
        "exceptionType"
    );

const dateInput =
    document.getElementById(
        "exceptionDate"
    );

const calculateButton =
    document.getElementById(
        "calculateExceptions"
    );

const resetButton =
    document.getElementById(
        "resetExceptions"
    );

const printButton =
    document.getElementById(
        "printExceptions"
    );

const body =
    document.getElementById(
        "exceptionBody"
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
// DESCRIPTION
// ============================================

function getTypeLabel(
    type
) {

    if (
        type ===
        "outstanding_invoice"
    ) {

        return "Outstanding Invoice";

    }


    if (
        type ===
        "unallocated_customer_credit"
    ) {

        return "Unallocated Customer Credit";

    }


    if (
        type ===
        "outstanding_bill"
    ) {

        return "Outstanding Supplier Bill";

    }


    if (
        type ===
        "supplier_prepayment"
    ) {

        return "Supplier Prepayment";

    }


    return type;

}


// ============================================
// RENDER
// ============================================

function render(
    exceptions
) {

    body.innerHTML = "";


    if (
        exceptions.length === 0
    ) {

        body.innerHTML = `

            <tr>

                <td colspan="8">
                    No outstanding items
                    or unallocated balances
                    found.
                </td>

            </tr>

        `;

        return;

    }


    exceptions.forEach(
        item => {

            const row =
                document.createElement(
                    "tr"
                );


            const party =
                item.customerName ||
                item.supplierName;


            row.innerHTML = `

                <td>
                    ${getTypeLabel(
                        item.type
                    )}
                </td>

                <td>
                    ${party || ""}
                </td>

                <td>
                    ${item.documentNumber || ""}
                </td>

                <td>
                    ${item.date || ""}
                </td>

                <td>
                    ${item.dueDate || "-"}
                </td>

                <td>
                    ${formatCurrency(
                        item.amount
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        item.paid
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        item.outstanding
                    )}
                </td>

            `;


            body.appendChild(
                row
            );

        }
    );

}


// ============================================
// CALCULATE
// ============================================

calculateButton.addEventListener(
    "click",
    function () {

        try {

            let exceptions;


            if (
                typeSelect.value ===
                "receivable"
            ) {

                exceptions =
                    getReceivableExceptions(
                        dateInput.value
                    );

            }
            else {

                exceptions =
                    getPayableExceptions(
                        dateInput.value
                    );

            }


            render(
                exceptions
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

        typeSelect.value =
            "receivable";

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