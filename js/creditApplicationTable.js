import {
    getCustomers,
    getSuppliers
} from "./parties.js";

import {
    getOpenCustomerInvoices,
    getOpenSupplierBills
} from "./invoiceBalances.js";

import {
    getTransactions
} from "./storage.js";

import {
    applyCustomerCredit,
    applySupplierPrepayment
} from "./creditApplicationEngine.js";


// ------------------------------------
// ELEMENTS
// ------------------------------------

const typeSelect =
    document.getElementById(
        "creditApplicationType"
    );

const partySelect =
    document.getElementById(
        "creditApplicationParty"
    );

const paymentSelect =
    document.getElementById(
        "creditApplicationPayment"
    );

const documentSelect =
    document.getElementById(
        "creditApplicationDocument"
    );

const amountInput =
    document.getElementById(
        "creditApplicationAmount"
    );

const applyButton =
    document.getElementById(
        "applyCreditButton"
    );

const balanceDisplay =
    document.getElementById(
        "creditApplicationBalance"
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
// LOAD PARTIES
// ------------------------------------

function loadParties() {

    partySelect.innerHTML = `

        <option value="">
            Select Party
        </option>

    `;


    if (
        typeSelect.value ===
        "customer"
    ) {

        getCustomers().forEach(
            customer => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    customer.id;

                option.textContent =
                    customer.name;

                partySelect.appendChild(
                    option
                );

            }
        );

    }


    if (
        typeSelect.value ===
        "supplier"
    ) {

        getSuppliers().forEach(
            supplier => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    supplier.id;

                option.textContent =
                    supplier.name;

                partySelect.appendChild(
                    option
                );

            }
        );

    }

}


// ------------------------------------
// LOAD AVAILABLE CREDITS
// ------------------------------------

function loadPayments() {

    paymentSelect.innerHTML = `

        <option value="">
            Select Credit / Prepayment
        </option>

    `;


    const transactions =
        getTransactions();


    transactions
        .filter(
            transaction => {

                if (
                    typeSelect.value ===
                    "customer"
                ) {

                    return (
                        transaction.type ===
                            "customer_payment" &&
                        transaction.customerId ===
                            partySelect.value &&
                        Number(
                            transaction.unallocatedAmount || 0
                        ) > 0
                    );

                }


                return (
                    transaction.type ===
                        "supplier_payment" &&
                    transaction.supplierId ===
                        partySelect.value &&
                    Number(
                        transaction.unallocatedAmount || 0
                    ) > 0
                );

            }
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
                    `${transaction.reference} — ${formatCurrency(
                        transaction.unallocatedAmount
                    )}`;

                paymentSelect.appendChild(
                    option
                );

            }
        );


    loadBalance();

}


// ------------------------------------
// LOAD DOCUMENTS
// ------------------------------------

function loadDocuments() {

    documentSelect.innerHTML = `

        <option value="">
            Select Invoice / Bill
        </option>

    `;


    const partyId =
        partySelect.value;


    if (!partyId) {

        return;

    }


    if (
        typeSelect.value ===
        "customer"
    ) {

        const invoices =
            getOpenCustomerInvoices(
                partyId
            );


        invoices.forEach(
            invoice => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    invoice.id;

                option.textContent =
                    `${invoice.invoiceNumber} — Outstanding ${formatCurrency(
                        invoice.outstanding
                    )}`;

                documentSelect.appendChild(
                    option
                );

            }
        );

    }


    if (
        typeSelect.value ===
        "supplier"
    ) {

        const bills =
            getOpenSupplierBills(
                partyId
            );


        bills.forEach(
            bill => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    bill.id;

                option.textContent =
                    `${bill.billNumber} — Outstanding ${formatCurrency(
                        bill.outstanding
                    )}`;

                documentSelect.appendChild(
                    option
                );

            }
        );

    }

}


// ------------------------------------
// BALANCE
// ------------------------------------

function loadBalance() {

    const paymentId =
        paymentSelect.value;


    if (!paymentId) {

        balanceDisplay.textContent =
            "";

        return;

    }


    const payment =
        getTransactions().find(
            transaction =>
                transaction.id ===
                paymentId
        );


    if (!payment) return;


    balanceDisplay.textContent =
        `Available: ${formatCurrency(
            payment.unallocatedAmount
        )}`;

}


// ------------------------------------
// PARTY CHANGE
// ------------------------------------

partySelect.addEventListener(
    "change",
    function () {

        loadPayments();

        loadDocuments();

    }
);


// ------------------------------------
// PAYMENT CHANGE
// ------------------------------------

paymentSelect.addEventListener(
    "change",
    loadBalance
);


// ------------------------------------
// APPLY
// ------------------------------------

applyButton.addEventListener(
    "click",
    function () {

        try {

            const paymentId =
                paymentSelect.value;

            const documentId =
                documentSelect.value;

            const amount =
                Number(
                    amountInput.value
                );


            if (!paymentId) {

                throw new Error(
                    "Select a credit or prepayment."
                );

            }


            if (!documentId) {

                throw new Error(
                    "Select an invoice or bill."
                );

            }


            if (
                !amount ||
                amount <= 0
            ) {

                throw new Error(
                    "Enter an application amount."
                );

            }


            if (
                typeSelect.value ===
                "customer"
            ) {

                applyCustomerCredit({

                    paymentId,

                    invoiceId:
                        documentId,

                    amount

                });

            }
            else {

                applySupplierPrepayment({

                    paymentId,

                    billId:
                        documentId,

                    amount

                });

            }


            alert(
                "Credit applied successfully."
            );


            amountInput.value =
                "";

            loadPayments();

            loadDocuments();

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


// ------------------------------------
// TYPE CHANGE
// ------------------------------------

typeSelect.addEventListener(
    "change",
    function () {

        loadParties();

        paymentSelect.innerHTML = `

            <option value="">
                Select Credit / Prepayment
            </option>

        `;

        documentSelect.innerHTML = `

            <option value="">
                Select Invoice / Bill
            </option>

        `;

        balanceDisplay.textContent =
            "";

    }
);


// ------------------------------------
// INITIALIZE
// ------------------------------------

loadParties();