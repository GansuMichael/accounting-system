// js/arApAgingTable.js

import {
    getCustomers,
    getSuppliers
} from "./parties.js";

import {
    getReceivableAging,
    getPayableAging
} from "./arApAging.js";


// ============================================
// ELEMENTS
// ============================================

const typeSelect =
    document.getElementById(
        "arApAgingType"
    );

const partySelect =
    document.getElementById(
        "arApAgingParty"
    );

const dateInput =
    document.getElementById(
        "arApAgingDate"
    );

const calculateButton =
    document.getElementById(
        "calculateArApAging"
    );

const resetButton =
    document.getElementById(
        "resetArApAging"
    );

const printButton =
    document.getElementById(
        "printArApAging"
    );

const body =
    document.getElementById(
        "arApAgingBody"
    );

const totalDisplay =
    document.getElementById(
        "arApAgingTotal"
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


// ============================================
// RENDER
// ============================================

function renderAging(
    aging
) {

    body.innerHTML = "";


    aging.details.forEach(
        item => {

            const row =
                document.createElement(
                    "tr"
                );


            const documentNumber =
                item.invoiceNumber ||
                item.billNumber;


            const documentDate =
                item.invoiceDate ||
                item.billDate;


            row.innerHTML = `

                <td>
                    ${documentNumber}
                </td>

                <td>
                    ${documentDate}
                </td>

                <td>
                    ${item.dueDate}
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

                <td>
                    ${item.daysOutstanding}
                </td>

            `;


            body.appendChild(
                row
            );

        }
    );


    totalDisplay.textContent =
        formatCurrency(
            aging.total
        );

}


// ============================================
// CALCULATE
// ============================================

calculateButton.addEventListener(
    "click",
    function () {

        try {

            const partyId =
                partySelect.value;


            if (!partyId) {

                throw new Error(
                    "Select a customer or supplier."
                );

            }


            let aging;


            if (
                typeSelect.value ===
                "customer"
            ) {

                aging =
                    getReceivableAging(
                        partyId,
                        dateInput.value
                    );

            }
            else {

                aging =
                    getPayableAging(
                        partyId,
                        dateInput.value
                    );

            }


            renderAging(
                aging
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
// TYPE CHANGE
// ============================================

typeSelect.addEventListener(
    "change",
    function () {

        loadParties();

        body.innerHTML =
            "";

        totalDisplay.textContent =
            formatCurrency(0);

    }
);


// ============================================
// RESET
// ============================================

resetButton.addEventListener(
    "click",
    function () {

        typeSelect.value =
            "customer";

        dateInput.value =
            "";

        loadParties();

        body.innerHTML =
            "";

        totalDisplay.textContent =
            formatCurrency(0);

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


// ============================================
// INITIALIZE
// ============================================

loadParties();