// js/invoiceBalanceTable.js

import {
    getCustomerInvoiceBalances,
    getSupplierBillBalances
} from "./invoiceBalances.js";

import {
    getCustomers,
    getSuppliers
} from "./parties.js";


// ------------------------------------
// ELEMENTS
// ------------------------------------

const typeSelect =
    document.getElementById(
        "invoiceBalanceType"
    );

const partySelect =
    document.getElementById(
        "invoiceBalanceParty"
    );

const dateInput =
    document.getElementById(
        "invoiceBalanceDate"
    );

const calculateButton =
    document.getElementById(
        "calculateInvoiceBalances"
    );

const resetButton =
    document.getElementById(
        "resetInvoiceBalances"
    );

const printButton =
    document.getElementById(
        "printInvoiceBalances"
    );

const body =
    document.getElementById(
        "invoiceBalanceBody"
    );

const total =
    document.getElementById(
        "invoiceBalanceTotal"
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


typeSelect.addEventListener(
    "change",
    loadParties
);


// ------------------------------------
// CALCULATE
// ------------------------------------

calculateButton.addEventListener(
    "click",
    function () {

        try {

            const type =
                typeSelect.value;

            const partyId =
                partySelect.value;

            const endDate =
                dateInput.value;


            if (!type) {

                throw new Error(
                    "Select Customer or Supplier."
                );

            }


            if (!partyId) {

                throw new Error(
                    "Select a party."
                );

            }


            let records;


            if (
                type === "customer"
            ) {

                records =
                    getCustomerInvoiceBalances(
                        partyId,
                        endDate
                    );

            }

            else {

                records =
                    getSupplierBillBalances(
                        partyId,
                        endDate
                    );

            }


            renderRecords(
                records
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
// RENDER
// ------------------------------------

function renderRecords(
    records
) {

    body.innerHTML =
        "";


    let outstandingTotal =
        0;


    records.forEach(
        record => {

            const row =
                document.createElement(
                    "tr"
                );


            const number =
                record.invoiceNumber ||
                record.billNumber;


            const party =
                record.customerName ||
                record.supplierName;


            row.innerHTML = `

                <td>
                    ${number}
                </td>

                <td>
                    ${party}
                </td>

                <td>
                    ${record.date}
                </td>

                <td>
                    ${record.dueDate}
                </td>

                <td>
                    ${record.description}
                </td>

                <td>
                    ${formatCurrency(
                        record.amount
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        record.paid
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        record.outstanding
                    )}
                </td>

            `;


            body.appendChild(
                row
            );


            outstandingTotal +=
                record.outstanding;

        }
    );


    total.textContent =
        formatCurrency(
            outstandingTotal
        );

}


// ------------------------------------
// RESET
// ------------------------------------

resetButton.addEventListener(
    "click",
    function () {

        typeSelect.value =
            "";

        partySelect.innerHTML = `

            <option value="">
                Select Party
            </option>

        `;

        dateInput.value =
            "";

        body.innerHTML =
            "";

        total.textContent =
            "₦0.00";

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