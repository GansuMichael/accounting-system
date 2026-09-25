// js/paymentAllocationTable.js

import {
    getTransactions
} from "./storage.js";

import {
    getPaymentAllocations,
    updatePaymentAllocations
} from "./allocationAdjustment.js";


// ============================================
// ELEMENTS
// ============================================

const typeSelect =
    document.getElementById(
        "allocationEditType"
    );

const paymentSelect =
    document.getElementById(
        "allocationEditPayment"
    );

const loadButton =
    document.getElementById(
        "loadPaymentAllocation"
    );

const saveButton =
    document.getElementById(
        "savePaymentAllocation"
    );

const body =
    document.getElementById(
        "paymentAllocationBody"
    );

const amountDisplay =
    document.getElementById(
        "allocationPaymentAmount"
    );

const totalDisplay =
    document.getElementById(
        "allocationEditTotal"
    );

const unallocatedDisplay =
    document.getElementById(
        "allocationEditUnallocated"
    );

const reasonInput =
    document.getElementById(
        "allocationEditReason"
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
// LOAD PAYMENTS
// ============================================

function loadPayments() {

    paymentSelect.innerHTML = `

        <option value="">
            Select Payment
        </option>

    `;


    const type =
        typeSelect.value ===
        "customer"

            ? "customer_payment"

            : "supplier_payment";


    const payments =
        getTransactions().filter(
            transaction =>
                transaction.type ===
                type
        );


    payments.forEach(
        payment => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                payment.id;


            option.textContent =
                `${payment.date} - ${
                    payment.reference
                } - ${
                    payment.customerName ||
                    payment.supplierName ||
                    ""
                } - ${
                    formatCurrency(
                        payment.amount
                    )
                }`;


            paymentSelect.appendChild(
                option
            );

        }
    );


    body.innerHTML =
        "";

}


// ============================================
// LOAD ALLOCATION
// ============================================

function loadAllocation() {

    if (
        !paymentSelect.value
    ) {

        return;

    }


    const payment =
        getPaymentAllocations(
            paymentSelect.value
        );


    amountDisplay.textContent =
        formatCurrency(
            payment.amount
        );

    amountDisplay.dataset.amount =
    payment.amount;


    body.innerHTML =
        "";


    payment.allocations.forEach(
        allocation => {

            const row =
                document.createElement(
                    "tr"
                );


            const documentId =
                allocation.invoiceId ||
                allocation.billId;


            row.innerHTML = `

                <td>
                    ${documentId}
                </td>

                <td>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        class="allocationEditAmount"
                        data-document-id="${documentId}"
                        value="${allocation.amount}"
                    >

                </td>

            `;


            body.appendChild(
                row
            );

        }
    );


    updateTotals();

}


// ============================================
// GET EDITED ALLOCATIONS
// ============================================

function getEditedAllocations() {

    return [
        ...
        document.querySelectorAll(
            ".allocationEditAmount"
        )
    ]

    .map(
        input => {

            const allocation = {

                amount:
                    Number(
                        input.value || 0
                    )

            };


            if (
                typeSelect.value ===
                "customer"
            ) {

                allocation.invoiceId =
                    input.dataset.documentId;

            }
            else {

                allocation.billId =
                    input.dataset.documentId;

            }


            return allocation;

        }
    )

    .filter(
        allocation =>
            allocation.amount > 0
    );

}


// ============================================
// TOTALS
// ============================================

function updateTotals() {

    const paymentAmount =
        Number(
            amountDisplay
                .dataset
                .amount || 0
        );


    const inputs =
        document.querySelectorAll(
            ".allocationEditAmount"
        );


    let total = 0;


    inputs.forEach(
        input => {

            total +=
                Number(
                    input.value || 0
                );

        }
    );


    totalDisplay.textContent =
        formatCurrency(
            total
        );


    unallocatedDisplay.textContent =
        formatCurrency(
            Math.max(
                0,
                paymentAmount -
                total
            )
        );

}


// ============================================
// SAVE
// ============================================

saveButton.addEventListener(
    "click",
    function () {

        try {

            if (
                !paymentSelect.value
            ) {

                throw new Error(
                    "Select a payment."
                );

            }


            const payment =
                getPaymentAllocations(
                    paymentSelect.value
                );


            amountDisplay.dataset.amount =
                payment.amount;


            const allocations =
                getEditedAllocations();


                updatePaymentAllocations({

                    paymentId:
                        paymentSelect.value,
                
                    allocations,
                
                    reason:
                        reasonInput.value.trim() ||
                        "Allocation corrected"
                
                });


            alert(
                "Payment allocations updated."
            );


            loadAllocation();

        }

        catch (error) {

            alert(
                error.message
            );

        }

    }
);


// ============================================
// EVENTS
// ============================================

typeSelect.addEventListener(
    "change",
    loadPayments
);


loadButton.addEventListener(
    "click",
    loadAllocation
);


document.addEventListener(
    "input",
    function (event) {

        if (
            event.target.classList.contains(
                "allocationEditAmount"
            )
        ) {

            updateTotals();

        }

    }
);


loadPayments();