// js/journalTable.js

import {
    getTransactions,
    deleteTransaction
} from "./storage.js";

const journalBody = document.getElementById("journalBody");

const fromDate = document.getElementById("journalFromDate");
const toDate = document.getElementById("journalToDate");

const filterButton = document.getElementById("filterJournal");
const resetFilterButton = document.getElementById("resetJournalFilter");
const printButton = document.getElementById("printJournal");


// ------------------------------------
// FORMAT CURRENCY
// ------------------------------------

function formatCurrency(amount) {

    return Number(amount).toLocaleString("en-NG", {
        style: "currency",
        currency: "NGN"
    });

}


// ------------------------------------
// DISPLAY JOURNAL
// ------------------------------------

export function displayJournal(
    transactions = getTransactions()
) {

    journalBody.innerHTML = "";

    let totalDebit = 0;
    let totalCredit = 0;


    if (transactions.length === 0) {

        journalBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No transactions found.
                </td>
            </tr>
        `;

        document.getElementById(
            "journalTotalDebit"
        ).textContent = formatCurrency(0);

        document.getElementById(
            "journalTotalCredit"
        ).textContent = formatCurrency(0);

        return;
    }


    transactions.forEach(transaction => {

        transaction.lines.forEach(line => {

            totalDebit += Number(line.debit || 0);

            totalCredit += Number(line.credit || 0);


            const row = document.createElement("tr");

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
                    ${line.accountName}
                </td>

                <td>
                    ${
                        line.debit
                            ? formatCurrency(line.debit)
                            : ""
                    }
                </td>

                <td>
                    ${
                        line.credit
                            ? formatCurrency(line.credit)
                            : ""
                    }
                </td>

            `;

            journalBody.appendChild(row);

        });

    });


    document.getElementById(
        "journalTotalDebit"
    ).textContent = formatCurrency(totalDebit);


    document.getElementById(
        "journalTotalCredit"
    ).textContent = formatCurrency(totalCredit);

}

// ------------------------------------
// UPDATE TOTALS
// ------------------------------------

function updateTotals(totalDebit, totalCredit) {

    document.getElementById(
        "journalTotalDebit"
    ).textContent = formatCurrency(totalDebit);


    document.getElementById(
        "journalTotalCredit"
    ).textContent = formatCurrency(totalCredit);

}


// ------------------------------------
// EDIT / DELETE BUTTONS
// ------------------------------------

function attachTransactionButtons() {

    const editButtons =
        document.querySelectorAll(
            ".edit-transaction"
        );


    const deleteButtons =
        document.querySelectorAll(
            ".delete-transaction"
        );


    editButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                editTransaction(
                    button.dataset.id
                );

            }
        );

    });


    deleteButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                deleteTransactionEntry(
                    button.dataset.id
                );

            }
        );

    });

}


// ------------------------------------
// EDIT TRANSACTION
// ------------------------------------

function editTransaction(id) {

    const transactions = getTransactions();

    const transaction =
        transactions.find(
            item => item.id === id
        );


    if (!transaction) {

        alert("Transaction not found.");

        return;
    }


    // Store the transaction being edited
    localStorage.setItem(
        "editingTransaction",
        JSON.stringify(transaction)
    );


    // Scroll to transaction form
    const form =
        document.getElementById(
            "transactionForm"
        );


    if (form) {

        form.scrollIntoView({
            behavior: "smooth"
        });

    }


    // Tell form that we are editing
    window.dispatchEvent(
        new CustomEvent(
            "editTransaction",
            {
                detail: transaction
            }
        )
    );

}


// ------------------------------------
// DELETE TRANSACTION
// ------------------------------------

function deleteTransactionEntry(id) {

    const transactions = getTransactions();

    const transaction =
        transactions.find(
            item => item.id === id
        );


    if (!transaction) {

        alert("Transaction not found.");

        return;
    }


    const confirmed = confirm(
        `Delete transaction "${transaction.description}"?`
    );


    if (!confirmed) {
        return;
    }


    deleteTransaction(id);

    displayJournal();

}


// ------------------------------------
// DATE FILTER
// ------------------------------------

function filterJournal() {

    const transactions =
        getTransactions();


    const start =
        fromDate.value;


    const end =
        toDate.value;


    const filtered =
        transactions.filter(
            transaction => {

                if (
                    start &&
                    transaction.date < start
                ) {
                    return false;
                }


                if (
                    end &&
                    transaction.date > end
                ) {
                    return false;
                }


                return true;

            }
        );


    displayJournal(filtered);

}


// ------------------------------------
// RESET FILTER
// ------------------------------------

function resetJournalFilter() {

    fromDate.value = "";

    toDate.value = "";

    displayJournal();

}


// ------------------------------------
// PRINT
// ------------------------------------

function printJournal() {

    window.print();

}


// ------------------------------------
// EVENTS
// ------------------------------------

filterButton.addEventListener(
    "click",
    filterJournal
);


resetFilterButton.addEventListener(
    "click",
    resetJournalFilter
);


printButton.addEventListener(
    "click",
    printJournal
);


// ------------------------------------
// INITIAL LOAD
// ------------------------------------

displayJournal();