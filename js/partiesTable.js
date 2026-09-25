import {
    createCustomer,
    createSupplier,
    getCustomers,
    getSuppliers
} from "./parties.js";


// ------------------------------------
// ELEMENTS
// ------------------------------------

const partyType =
    document.getElementById(
        "partyType"
    );

const partyName =
    document.getElementById(
        "partyName"
    );

const partyPhone =
    document.getElementById(
        "partyPhone"
    );

const partyEmail =
    document.getElementById(
        "partyEmail"
    );

const partyAddress =
    document.getElementById(
        "partyAddress"
    );

const savePartyButton =
    document.getElementById(
        "saveParty"
    );

const customersBody =
    document.getElementById(
        "customersBody"
    );

const suppliersBody =
    document.getElementById(
        "suppliersBody"
    );


// ------------------------------------
// RENDER CUSTOMERS
// ------------------------------------

function renderCustomers() {

    const customers =
        getCustomers();


    customersBody.innerHTML =
        "";


    customers.forEach(
        customer => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${customer.id}
                </td>

                <td>
                    ${customer.name}
                </td>

                <td>
                    ${customer.phone}
                </td>

                <td>
                    ${customer.email}
                </td>

            `;


            customersBody.appendChild(
                row
            );

        }
    );

}


// ------------------------------------
// RENDER SUPPLIERS
// ------------------------------------

function renderSuppliers() {

    const suppliers =
        getSuppliers();


    suppliersBody.innerHTML =
        "";


    suppliers.forEach(
        supplier => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${supplier.id}
                </td>

                <td>
                    ${supplier.name}
                </td>

                <td>
                    ${supplier.phone}
                </td>

                <td>
                    ${supplier.email}
                </td>

            `;


            suppliersBody.appendChild(
                row
            );

        }
    );

}


// ------------------------------------
// SAVE PARTY
// ------------------------------------

savePartyButton.addEventListener(
    "click",
    function () {

        try {

            const type =
                partyType.value;

            const name =
                partyName.value.trim();


            if (!type) {

                throw new Error(
                    "Select Customer or Supplier."
                );

            }


            if (!name) {

                throw new Error(
                    "Enter the party name."
                );

            }


            const data = {

                name,

                phone:
                    partyPhone.value.trim(),

                email:
                    partyEmail.value.trim(),

                address:
                    partyAddress.value.trim()

            };


            if (type === "customer") {

                createCustomer(data);

            }

            else {

                createSupplier(data);

            }


            alert(
                `${type} saved successfully.`
            );


            partyType.value = "";

            partyName.value = "";

            partyPhone.value = "";

            partyEmail.value = "";

            partyAddress.value = "";


            renderCustomers();

            renderSuppliers();

        }

        catch (error) {

            alert(
                error.message
            );

        }

    }
);


// ------------------------------------
// INITIAL LOAD
// ------------------------------------

renderCustomers();

renderSuppliers();