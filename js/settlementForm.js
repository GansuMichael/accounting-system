// js/settlementForm.js

import {
    createCustomerPayment,
    createSupplierPayment
} from "./settlementEngine.js";

import {
    getCustomers,
    getSuppliers
} from "./parties.js";

import {
    getOpenCustomerInvoices,
    getOpenSupplierBills,
    validateCustomerAllocation,
    validateSupplierAllocation
} from "./invoiceBalances.js";


// ------------------------------------
// ELEMENTS
// ------------------------------------

const settlementType =
    document.getElementById(
        "settlementType"
    );

const settlementDate =
    document.getElementById(
        "settlementDate"
    );

const settlementDescription =
    document.getElementById(
        "settlementDescription"
    );

const settlementAmount =
    document.getElementById(
        "settlementAmount"
    );

const settlementAccount =
    document.getElementById(
        "settlementAccount"
    );

const settlementParty =
    document.getElementById(
        "settlementParty"
    );

const settlementDocument =
    document.getElementById(
        "settlementDocument"
    );

const settlementAllocation =
    document.getElementById(
        "settlementAllocation"
    );

const saveSettlement =
    document.getElementById(
        "saveSettlement"
    );


// ------------------------------------
// LOAD PARTIES
// ------------------------------------

function loadParties() {

    settlementParty.innerHTML = `

        <option value="">
            Select Party
        </option>

    `;


    if (
        settlementType.value ===
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

                settlementParty.appendChild(
                    option
                );

            }
        );

    }


    if (
        settlementType.value ===
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

                settlementParty.appendChild(
                    option
                );

            }
        );

    }

}


// ------------------------------------
// LOAD OPEN DOCUMENTS
// ------------------------------------

function loadOpenDocuments() {

    settlementDocument.innerHTML = `

        <option value="">
            Select Invoice / Bill
        </option>

    `;


    const partyId =
        settlementParty.value;


    if (!partyId) {

        return;

    }


    if (
        settlementType.value ===
        "customer"
    ) {

        const invoices =
            getOpenCustomerInvoices(
                partyId,
                settlementDate.value
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


                option.dataset.outstanding =
                    invoice.outstanding;


                settlementDocument
                    .appendChild(
                        option
                    );

            }
        );

    }


    if (
        settlementType.value ===
        "supplier"
    ) {

        const bills =
            getOpenSupplierBills(
                partyId,
                settlementDate.value
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


                option.dataset.outstanding =
                    bill.outstanding;


                settlementDocument
                    .appendChild(
                        option
                    );

            }
        );

    }

}


// ------------------------------------
// CURRENCY
// ------------------------------------

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


// ------------------------------------
// TYPE CHANGE
// ------------------------------------

settlementType.addEventListener(
    "change",
    function () {

        loadParties();

        settlementDocument.innerHTML = `

            <option value="">
                Select Invoice / Bill
            </option>

        `;

        settlementAllocation.value =
            "";

    }
);


// ------------------------------------
// PARTY CHANGE
// ------------------------------------

settlementParty.addEventListener(
    "change",
    function () {

        loadOpenDocuments();

    }
);


// ------------------------------------
// DATE CHANGE
// ------------------------------------

settlementDate.addEventListener(
    "change",
    function () {

        if (
            settlementParty.value
        ) {

            loadOpenDocuments();

        }

    }
);


// ------------------------------------
// DOCUMENT CHANGE
// ------------------------------------

settlementDocument.addEventListener(
    "change",
    function () {

        const option =
            settlementDocument
                .selectedOptions[0];


        if (
            option &&
            option.dataset.outstanding
        ) {

            settlementAllocation.value =
                option.dataset.outstanding;

        }

    }
);


// ------------------------------------
// SAVE SETTLEMENT
// ------------------------------------

saveSettlement.addEventListener(
    "click",
    function () {

        try {

            const type =
                settlementType.value;

            const date =
                settlementDate.value;

            const description =
                settlementDescription
                    .value
                    .trim();

            const amount =
                Number(
                    settlementAmount.value
                );

            const account =
                settlementAccount.value;

            const partyId =
                settlementParty.value;

            const documentId =
                settlementDocument.value;

            const allocation =
                Number(
                    settlementAllocation.value
                );


            if (!type) {

                throw new Error(
                    "Select settlement type."
                );

            }


            if (!date) {

                throw new Error(
                    "Payment date is required."
                );

            }


            if (!amount || amount <= 0) {

                throw new Error(
                    "Payment amount must be greater than zero."
                );

            }


            if (!account) {

                throw new Error(
                    "Select payment account."
                );

            }


            if (!partyId) {

                throw new Error(
                    "Select customer or supplier."
                );

            }


            if (!documentId) {

                throw new Error(
                    "Select an invoice or bill."
                );

            }


            if (!allocation || allocation <= 0) {

                throw new Error(
                    "Enter allocation amount."
                );

            }


            if (
                allocation >
                amount
            ) {

                throw new Error(
                    "Allocation cannot exceed payment amount."
                );

            }


            const selectedOption =
                settlementDocument
                    .selectedOptions[0];


            const outstanding =
                Number(
                    selectedOption
                        .dataset
                        .outstanding
                );


            if (
                allocation >
                outstanding
            ) {

                throw new Error(
                    "Allocation cannot exceed document outstanding balance."
                );

            }


            // --------------------------------
            // CUSTOMER PAYMENT
            // --------------------------------

            if (
                type === "customer"
            ) {

                const invoices =
                    getOpenCustomerInvoices(
                        partyId,
                        date
                    );


                const invoice =
                    invoices.find(
                        item =>
                            item.id ===
                            documentId
                    );


                validateCustomerAllocation(
                    invoice,
                    allocation
                );


                createCustomerPayment({

                    date,

                    description,

                    amount,

                    receivedInto:
                        account,

                    customerId:
                        partyId,

                    invoiceId:
                        documentId,

                    allocatedAmount:
                        allocation

                });

            }


            // --------------------------------
            // SUPPLIER PAYMENT
            // --------------------------------

            if (
                type === "supplier"
            ) {

                const bills =
                    getOpenSupplierBills(
                        partyId,
                        date
                    );


                const bill =
                    bills.find(
                        item =>
                            item.id ===
                            documentId
                    );


                validateSupplierAllocation(
                    bill,
                    allocation
                );


                createSupplierPayment({

                    date,

                    description,

                    amount,

                    paidFrom:
                        account,

                    supplierId:
                        partyId,

                    billId:
                        documentId,

                    allocatedAmount:
                        allocation

                });

            }


            alert(
                "Settlement recorded successfully."
            );


            resetForm();


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
// RESET
// ------------------------------------

function resetForm() {

    settlementType.value =
        "";

    settlementDate.value =
        "";

    settlementDescription.value =
        "";

    settlementAmount.value =
        "";

    settlementAccount.value =
        "";

    settlementParty.innerHTML = `

        <option value="">
            Select Party
        </option>

    `;

    settlementDocument.innerHTML = `

        <option value="">
            Select Invoice / Bill
        </option>

    `;

    settlementAllocation.value =
        "";

}


// ------------------------------------
// INITIALIZE
// ------------------------------------

resetForm();