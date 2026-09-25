// js/unallocatedTable.js

import {
    getCustomers,
    getSuppliers
} from "./parties.js";

import {
    getCustomerUnallocatedReceipts,
    getSupplierPrepayments
} from "./unallocatedBalances.js";


// ------------------------------------
// ELEMENTS
// ------------------------------------

const typeSelect =
    document.getElementById(
        "unallocatedType"
    );

const partySelect =
    document.getElementById(
        "unallocatedParty"
    );

const loadButton =
    document.getElementById(
        "loadUnallocated"
    );

const result =
    document.getElementById(
        "unallocatedResult"
    );


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
// RENDER CUSTOMER CREDITS
// ------------------------------------

function renderCustomerCredits(
    receipts
) {

    if (
        receipts.length === 0
    ) {

        result.innerHTML = `

            <p>
                No unallocated customer
                receipts.
            </p>

        `;

        return;

    }


    const total =
        receipts.reduce(
            (
                sum,
                receipt
            ) =>
                sum +
                receipt.amount,
            0
        );


    result.innerHTML = `

        <table>

            <thead>

                <tr>

                    <th>Date</th>

                    <th>Reference</th>

                    <th>Description</th>

                    <th>Amount</th>

                </tr>

            </thead>


            <tbody>

                ${receipts.map(
                    receipt => `

                    <tr>

                        <td>
                            ${receipt.date}
                        </td>

                        <td>
                            ${receipt.reference}
                        </td>

                        <td>
                            ${receipt.description}
                        </td>

                        <td>
                            ${formatCurrency(
                                receipt.amount
                            )}
                        </td>

                    </tr>

                `
                ).join("")}

            </tbody>


            <tfoot>

                <tr>

                    <th colspan="3">
                        Total Customer Credit
                    </th>

                    <th>
                        ${formatCurrency(
                            total
                        )}
                    </th>

                </tr>

            </tfoot>

        </table>

    `;

}


// ------------------------------------
// RENDER SUPPLIER PREPAYMENTS
// ------------------------------------

function renderSupplierPrepayments(
    payments
) {

    if (
        payments.length === 0
    ) {

        result.innerHTML = `

            <p>
                No supplier prepayments.
            </p>

        `;

        return;

    }


    const total =
        payments.reduce(
            (
                sum,
                payment
            ) =>
                sum +
                payment.amount,
            0
        );


    result.innerHTML = `

        <table>

            <thead>

                <tr>

                    <th>Date</th>

                    <th>Reference</th>

                    <th>Description</th>

                    <th>Amount</th>

                </tr>

            </thead>


            <tbody>

                ${payments.map(
                    payment => `

                    <tr>

                        <td>
                            ${payment.date}
                        </td>

                        <td>
                            ${payment.reference}
                        </td>

                        <td>
                            ${payment.description}
                        </td>

                        <td>
                            ${formatCurrency(
                                payment.amount
                            )}
                        </td>

                    </tr>

                `
                ).join("")}

            </tbody>


            <tfoot>

                <tr>

                    <th colspan="3">
                        Total Supplier Prepayment
                    </th>

                    <th>
                        ${formatCurrency(
                            total
                        )}
                    </th>

                </tr>

            </tfoot>

        </table>

    `;

}


// ------------------------------------
// TYPE CHANGE
// ------------------------------------

typeSelect.addEventListener(
    "change",
    loadParties
);


// ------------------------------------
// LOAD
// ------------------------------------

loadButton.addEventListener(
    "click",
    function () {

        const partyId =
            partySelect.value;


        if (!partyId) {

            alert(
                "Select a customer or supplier."
            );

            return;

        }


        if (
            typeSelect.value ===
            "customer"
        ) {

            const receipts =
                getCustomerUnallocatedReceipts(
                    partyId
                );


            renderCustomerCredits(
                receipts
            );

        }


        if (
            typeSelect.value ===
            "supplier"
        ) {

            const payments =
                getSupplierPrepayments(
                    partyId
                );


            renderSupplierPrepayments(
                payments
            );

        }

    }
);


// ------------------------------------
// INITIALIZE
// ------------------------------------

loadParties();