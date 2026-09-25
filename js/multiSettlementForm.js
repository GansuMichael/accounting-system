// js/multiSettlementForm.js

import {
    getCustomers,
    getSuppliers
} from "./parties.js";

import {
    getOpenCustomerInvoices,
    getOpenSupplierBills
} from "./invoiceBalances.js";

import {
    createCustomerPayment,
    createSupplierPayment
} from "./settlementEngine.js";


const typeSelect =
    document.getElementById(
        "multiSettlementType"
    );

const dateInput =
    document.getElementById(
        "multiSettlementDate"
    );

const amountInput =
    document.getElementById(
        "multiSettlementAmount"
    );

const accountSelect =
    document.getElementById(
        "multiSettlementAccount"
    );

const partySelect =
    document.getElementById(
        "multiSettlementParty"
    );

const documentsBody =
    document.getElementById(
        "multiSettlementDocuments"
    );

const totalAllocatedDisplay =
    document.getElementById(
        "multiSettlementAllocated"
    );

const unallocatedDisplay =
    document.getElementById(
        "multiSettlementUnallocated"
    );

const saveButton =
    document.getElementById(
        "saveMultiSettlement"
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
// LOAD PARTIES
// ============================================

function loadParties() {

    partySelect.innerHTML =
        `<option value="">
            Select Party
        </option>`;


    const parties =
        typeSelect.value ===
        "customer"

            ? getCustomers()

            : getSuppliers();


    parties.forEach(
        party => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                party.id;

            option.textContent =
                party.name;

            partySelect.appendChild(
                option
            );

        }
    );


    documentsBody.innerHTML =
        "";

    updateTotals();

}


// ============================================
// LOAD DOCUMENTS
// ============================================

function loadDocuments() {

    documentsBody.innerHTML =
        "";


    if (
        !partySelect.value
    ) {

        updateTotals();

        return;

    }


    const documents =
        typeSelect.value ===
        "customer"

            ? getOpenCustomerInvoices(
                partySelect.value
            )

            : getOpenSupplierBills(
                partySelect.value
            );


    documents.forEach(
        document => {

            const row =
                document.createElement(
                    "tr"
                );


            const id =
                document.id;


            const number =
                document.invoiceNumber ||
                document.billNumber;


            row.innerHTML = `

                <td>

                    <input
                        type="checkbox"
                        class="settlementDocumentCheck"
                        data-id="${id}"
                    >

                </td>

                <td>
                    ${number}
                </td>

                <td>
                    ${document.date}
                </td>

                <td>
                    ${document.dueDate || "-"}
                </td>

                <td>
                    ${formatCurrency(
                        document.amount
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        document.paid
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        document.outstanding
                    )}
                </td>

                <td>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        class="settlementAllocationInput"
                        data-id="${id}"
                        value="0"
                    >

                </td>

            `;


            documentsBody.appendChild(
                row
            );

        }
    );


    document
        .querySelectorAll(
            ".settlementAllocationInput"
        )
        .forEach(
            input => {

                input.addEventListener(
                    "input",
                    updateTotals
                );

            }
        );


    updateTotals();

}


// ============================================
// CALCULATE TOTALS
// ============================================

function getAllocations() {

    return [
        ...
        document.querySelectorAll(
            ".settlementAllocationInput"
        )
    ]

    .map(
        input => {

            return {

                id:
                    input.dataset.id,

                amount:
                    Number(
                        input.value || 0
                    )

            };

        }
    )

    .filter(
        item =>
            item.amount > 0
    );

}


function updateTotals() {

    const amount =
        Number(
            amountInput.value || 0
        );


    const allocations =
        getAllocations();


    const allocated =
        allocations.reduce(
            (
                total,
                item
            ) =>
                total +
                item.amount,
            0
        );


    const unallocated =
        amount -
        allocated;


    totalAllocatedDisplay.textContent =
        formatCurrency(
            allocated
        );


    unallocatedDisplay.textContent =
        formatCurrency(
            Math.max(
                0,
                unallocated
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

            const amount =
                Number(
                    amountInput.value
                );


            if (
                !amount ||
                amount <= 0
            ) {

                throw new Error(
                    "Enter a valid payment amount."
                );

            }


            const allocations =
                getAllocations();


            const totalAllocated =
                allocations.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        item.amount,
                    0
                );


            if (
                totalAllocated >
                amount
            ) {

                throw new Error(
                    "Allocated amount cannot exceed payment amount."
                );

            }


            const engineAllocations =
                allocations.map(
                    item => {

                        if (
                            typeSelect.value ===
                            "customer"
                        ) {

                            return {

                                invoiceId:
                                    item.id,

                                amount:
                                    item.amount

                            };

                        }


                        return {

                            billId:
                                item.id,

                            amount:
                                item.amount

                        };

                    }
                );


            if (
                typeSelect.value ===
                "customer"
            ) {

                createCustomerPayment({

                    date:
                        dateInput.value,

                    amount,

                    receivedInto:
                        accountSelect.value,

                    customerId:
                        partySelect.value,

                    allocations:
                        engineAllocations

                });

            }
            else {

                createSupplierPayment({

                    date:
                        dateInput.value,

                    amount,

                    paidFrom:
                        accountSelect.value,

                    supplierId:
                        partySelect.value,

                    allocations:
                        engineAllocations

                });

            }


            alert(
                "Payment saved successfully."
            );


            amountInput.value =
                "";

            loadDocuments();

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
    loadParties
);


partySelect.addEventListener(
    "change",
    loadDocuments
);


amountInput.addEventListener(
    "input",
    updateTotals
);


loadParties();