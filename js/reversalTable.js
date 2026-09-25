// js/reversalTable.js

import {
    getTransactions
} from "./storage.js";

import {
    reverseTransaction
} from "./reversalEngine.js";


// ============================================
// ELEMENTS
// ============================================

const body =
    document.getElementById(
        "reversalBody"
    );

const refreshButton =
    document.getElementById(
        "refreshReversalTransactions"
    );

const transactionSelect =
    document.getElementById(
        "reversalTransaction"
    );

const reasonInput =
    document.getElementById(
        "reversalReason"
    );

const reverseButton =
    document.getElementById(
        "reverseTransaction"
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
// LOAD TRANSACTIONS
// ============================================

function loadTransactions() {

    const transactions =
        getTransactions();


    transactionSelect.innerHTML = `

        <option value="">
            Select Transaction
        </option>

    `;


    body.innerHTML =
        "";


    transactions
        .filter(
            transaction =>
                transaction.type !==
                    "reversal" &&

                transaction.status !==
                    "voided"
        )
        .forEach(
            transaction => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    transaction.id;


                option.textContent =
                    `${
                        transaction.date
                    } | ${
                        transaction.reference
                    } | ${
                        transaction.description
                    } | ${
                        formatCurrency(
                            transaction.amount
                        )
                    }`;


                transactionSelect
                    .appendChild(
                        option
                    );

            }
        );


    renderTransactions(
        transactions
    );

}


// ============================================
// RENDER
// ============================================

function renderTransactions(
    transactions
) {

    const rows =
        transactions.filter(
            transaction =>
                transaction.type !==
                    "reversal"
        );


    if (
        rows.length === 0
    ) {

        body.innerHTML = `

            <tr>

                <td colspan="7">
                    No transactions found.
                </td>

            </tr>

        `;

        return;

    }


    rows.forEach(
        transaction => {

            const row =
                document.createElement(
                    "tr"
                );


            const status =
                transaction.status ||
                "posted";


            row.innerHTML = `

                <td>
                    ${transaction.date}
                </td>

                <td>
                    ${transaction.reference}
                </td>

                <td>
                    ${transaction.description}
                </td>

                <td>
                    ${transaction.type}
                </td>

                <td>
                    ${formatCurrency(
                        transaction.amount
                    )}
                </td>

                <td>
                    ${status}
                </td>

                <td>

                    ${
                        status ===
                        "voided"

                            ? "Voided"

                            : "Posted"

                    }

                </td>

            `;


            body.appendChild(
                row
            );

        }
    );

}


// ============================================
// REVERSE
// ============================================

reverseButton.addEventListener(
    "click",
    function () {

        try {

            const transactionId =
                transactionSelect.value;


            if (!transactionId) {

                throw new Error(
                    "Select a transaction."
                );

            }


            const reason =
                reasonInput.value.trim();


            if (!reason) {

                throw new Error(
                    "Enter a reason for the reversal."
                );

            }


            const confirmed =
                confirm(
                    "Are you sure you want to reverse this transaction?"
                );


            if (!confirmed) {

                return;

            }


            reverseTransaction({

                transactionId,

                reason,

                reversedBy:
                    "System"

            });


            alert(
                "Transaction reversed successfully."
            );


            transactionSelect.value =
                "";

            reasonInput.value =
                "";


            loadTransactions();


            document.dispatchEvent(
                new CustomEvent(
                    "transactionsUpdated"
                )
            );

        }

        catch (error) {

            alert(
                error.message
            );

        }

    }
);


// ============================================
// REFRESH
// ============================================

refreshButton.addEventListener(
    "click",
    loadTransactions
);


loadTransactions();