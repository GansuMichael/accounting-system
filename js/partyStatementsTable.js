// js/partyStatementsTable.js

import {
    getCustomerStatement,
    getSupplierStatement
} from "./partyStatements.js";

import {
    getCustomers,
    getSuppliers
} from "./parties.js";


// ------------------------------------
// ELEMENTS
// ------------------------------------

const statementType =
    document.getElementById(
        "statementType"
    );

const statementParty =
    document.getElementById(
        "statementParty"
    );

const statementDate =
    document.getElementById(
        "statementDate"
    );

const generateButton =
    document.getElementById(
        "generateStatement"
    );

const resetButton =
    document.getElementById(
        "resetStatement"
    );

const printButton =
    document.getElementById(
        "printStatement"
    );

const statementPartyName =
    document.getElementById(
        "statementPartyName"
    );

const statementBalance =
    document.getElementById(
        "statementBalance"
    );

const statementBody =
    document.getElementById(
        "statementBody"
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

    statementParty.innerHTML = `

        <option value="">
            Select Party
        </option>

    `;


    if (
        statementType.value ===
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


                statementParty.appendChild(
                    option
                );

            }
        );

    }


    if (
        statementType.value ===
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


                statementParty.appendChild(
                    option
                );

            }
        );

    }

}


// ------------------------------------
// TYPE CHANGE
// ------------------------------------

statementType.addEventListener(
    "change",
    loadParties
);


// ------------------------------------
// GENERATE STATEMENT
// ------------------------------------

generateButton.addEventListener(
    "click",
    function () {

        try {

            const type =
                statementType.value;

            const partyId =
                statementParty.value;

            const endDate =
                statementDate.value;


            if (!type) {

                throw new Error(
                    "Select statement type."
                );

            }


            if (!partyId) {

                throw new Error(
                    "Select a party."
                );

            }


            let statement;


            if (
                type === "customer"
            ) {

                statement =
                    getCustomerStatement(
                        partyId,
                        endDate
                    );

            }

            else {

                statement =
                    getSupplierStatement(
                        partyId,
                        endDate
                    );

            }


            renderStatement(
                statement
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

function renderStatement(
    statement
) {

    statementPartyName.textContent =
        statement.partyName;


    statementBalance.textContent =
        formatCurrency(
            statement.balance
        );


    statementBody.innerHTML =
        "";


    statement.entries.forEach(
        entry => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${entry.date}
                </td>

                <td>
                    ${entry.reference}
                </td>

                <td>
                    ${entry.description}
                </td>

                <td>
                    ${formatCurrency(
                        entry.debit
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        entry.credit
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        entry.balance
                    )}
                </td>

            `;


            statementBody.appendChild(
                row
            );

        }
    );

}


// ------------------------------------
// RESET
// ------------------------------------

resetButton.addEventListener(
    "click",
    function () {

        statementType.value =
            "";

        statementParty.innerHTML = `

            <option value="">
                Select Party
            </option>

        `;

        statementDate.value =
            "";

        statementPartyName.textContent =
            "";

        statementBalance.textContent =
            "₦0.00";

        statementBody.innerHTML =
            "";

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