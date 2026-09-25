// js/transactionForm.js
import {
    getTransactionRule
} from "./transactionRules.js";

import {
    getAccountByCode
} from "./accounts.js";

import {
    createJournalTransaction
} from "./transactionEngine.js";

import {
    saveTransaction,
    updateTransaction
} from "./storage.js";

import {
    getCustomers,
    getSuppliers
} from "./parties.js";

import {
    ensureTransactionEditable,
    ensureTransactionDeletable
} from "./periodControl.js";


// ------------------------------------
// FORM ELEMENTS
// ------------------------------------

const form =
    document.getElementById(
        "transactionForm"
    );

const transactionType =
    document.getElementById(
        "transactionType"
    );

const transactionDate =
    document.getElementById(
        "transactionDate"
    );

const description =
    document.getElementById(
        "description"
    );

const amount =
    document.getElementById(
        "amount"
    );

// ------------------------------------
// ACCOUNT ELEMENTS
// ------------------------------------

// ------------------------------------
// ACCOUNT ELEMENTS
// ------------------------------------

const debitAccount =
    document.getElementById(
        "debitAccount"
    );

const creditAccount =
    document.getElementById(
        "creditAccount"
    );

// ------------------------------------
// PARTY ELEMENTS
// ------------------------------------

const customer =
    document.getElementById(
        "customer"
    );

const supplier =
    document.getElementById(
        "supplier"
    );

const dueDate =
    document.getElementById(
        "dueDate"
    );


// ------------------------------------
// GROUPS
// ------------------------------------

const normalAccountGroup =
    document.getElementById(
        "normalAccountGroup"
    );

const receivingAccountGroup =
    document.getElementById(
        "receivingAccountGroup"
    );

const paymentAccountGroup =
    document.getElementById(
        "paymentAccountGroup"
    );

const assetAccountGroup =
    document.getElementById(
        "assetAccountGroup"
    );

const customerGroup =
    document.getElementById(
        "customerGroup"
    );

const supplierGroup =
    document.getElementById(
        "supplierGroup"
    );

const dueDateGroup =
    document.getElementById(
        "dueDateGroup"
    );

const drawingPaymentAccountGroup =
    document.getElementById(
        "drawingPaymentAccountGroup"
    );

// ------------------------------------
// EDITING
// ------------------------------------

let editingTransactionId = null;

// ------------------------------------
// LOAD CUSTOMERS
// ------------------------------------

function loadCustomers() {

    const customers =
        getCustomers();


    customer.innerHTML = `
        <option value="">
            Select Customer
        </option>
    `;


    customers.forEach(
        item => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.id;

            option.textContent =
                item.name;


            customer.appendChild(
                option
            );

        }
    );

}


// ------------------------------------
// LOAD SUPPLIERS
// ------------------------------------

function loadSuppliers() {

    const suppliers =
        getSuppliers();


    supplier.innerHTML = `
        <option value="">
            Select Supplier
        </option>
    `;


    suppliers.forEach(
        item => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.id;

            option.textContent =
                item.name;


            supplier.appendChild(
                option
            );

        }
    );

}


// ------------------------------------
// SHOW / HIDE FIELDS
// ------------------------------------

function populateAccountSelect(selectElement, accountCodes) {

    if (!selectElement) return;

    selectElement.innerHTML = "";

    const placeholder =
        document.createElement("option");

    placeholder.value = "";

    placeholder.textContent =
        "Select account";

    selectElement.appendChild(
        placeholder
    );

    accountCodes.forEach(accountCode => {

        const account =
            getAccountByCode(accountCode);

        if (!account) return;

        const option =
            document.createElement("option");

        option.value = account.code;

        option.textContent =
            `${account.code} - ${account.name}`;

        selectElement.appendChild(
            option
        );
    });
}


function updateAccountOptions() {

    const type =
        transactionType.value;

    const rule =
        getTransactionRule(type);


    if (!rule) {

        populateAccountSelect(
            debitAccount,
            []
        );

        populateAccountSelect(
            creditAccount,
            []
        );

        return;
    }


    populateAccountSelect(
        debitAccount,
        rule.debitAccounts
    );

    populateAccountSelect(
        creditAccount,
        rule.creditAccounts
    );
}


function updateFormFields() {

    const type =
        transactionType.value;

    // --------------------------------
    // HIDE OPTIONAL PARTY FIELDS
    // --------------------------------

    if (customerGroup) {
        customerGroup.style.display = "none";
    }

    if (supplierGroup) {
        supplierGroup.style.display = "none";
    }

    if (dueDateGroup) {
        dueDateGroup.style.display = "none";
    }


    // --------------------------------
    // REVENUE / CREDIT SALE
    // --------------------------------

    if (
        type === "revenue" &&
        debitAccount.value === "1030"
    ) {

        if (customerGroup) {
            customerGroup.style.display = "";
        }

        if (dueDateGroup) {
            dueDateGroup.style.display = "";
        }
    }


    // --------------------------------
    // CUSTOMER PAYMENT
    // --------------------------------

    if (
        type === "customer_payment"
    ) {

        if (customerGroup) {
            customerGroup.style.display = "";
        }
    }


    // --------------------------------
    // INVENTORY PURCHASE ON CREDIT
    // --------------------------------

    if (
        type === "inventory_purchase" &&
        creditAccount.value === "2010"
    ) {

        if (supplierGroup) {
            supplierGroup.style.display = "";
        }

        if (dueDateGroup) {
            dueDateGroup.style.display = "";
        }
    }


    // --------------------------------
    // EXPENSE ON CREDIT
    // --------------------------------

    if (
        type === "expense" &&
        creditAccount.value === "2010"
    ) {

        if (supplierGroup) {
            supplierGroup.style.display = "";
        }

        if (dueDateGroup) {
            dueDateGroup.style.display = "";
        }
    }


    // --------------------------------
    // SUPPLIER PAYMENT
    // --------------------------------

    if (
        type === "supplier_payment"
    ) {

        if (supplierGroup) {
            supplierGroup.style.display = "";
        }
    }
}



// ------------------------------------
// TRANSACTION TYPE CHANGE
// ------------------------------------


// ------------------------------------
// TRANSACTION TYPE CHANGE
// ------------------------------------

transactionType.addEventListener(
    "change",
    function () {

        // Transaction type determines
        // which accounts are available.
        updateAccountOptions();

        // Then update conditional fields.
        updateFormFields();
    }
);


// ------------------------------------
// DEBIT ACCOUNT CHANGE
// ------------------------------------

debitAccount.addEventListener(
    "change",
    function () {

        // Do NOT rebuild the account options.
        // Just update conditional fields.
        updateFormFields();
    }
);


// ------------------------------------
// CREDIT ACCOUNT CHANGE
// ------------------------------------

creditAccount.addEventListener(
    "change",
    function () {

        // Do NOT rebuild the account options.
        // Just update conditional fields.
        updateFormFields();
    }
);




// ------------------------------------
// FORM SUBMIT
// ------------------------------------

// ------------------------------------
// FORM SUBMIT
// ------------------------------------

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        try {

            const type =
                transactionType.value;

            const date =
                transactionDate.value;

            const transactionDescription =
                description.value.trim();

            const transactionAmount =
                Number(amount.value);

            const debitCode =
                debitAccount.value;

            const creditCode =
                creditAccount.value;


            // --------------------------------
            // BASIC VALIDATION
            // --------------------------------

            if (!type) {
                throw new Error(
                    "Select a transaction type."
                );
            }

            if (!date) {
                throw new Error(
                    "Transaction date is required."
                );
            }

            if (!transactionDescription) {
                throw new Error(
                    "Description is required."
                );
            }

            if (
                !Number.isFinite(transactionAmount) ||
                transactionAmount <= 0
            ) {
                throw new Error(
                    "Amount must be greater than zero."
                );
            }


            // --------------------------------
            // ACCOUNT VALIDATION
            // --------------------------------

            if (!debitCode) {
                throw new Error(
                    "Select the debit account."
                );
            }

            if (!creditCode) {
                throw new Error(
                    "Select the credit account."
                );
            }

            if (debitCode === creditCode) {
                throw new Error(
                    "Debit and credit accounts cannot be the same."
                );
            }


            // --------------------------------
            // TRANSACTION RULE
            // --------------------------------

            const rule =
                getTransactionRule(type);

            if (!rule) {
                throw new Error(
                    "Invalid transaction type."
                );
            }


            // --------------------------------
            // VERIFY ACCOUNT IS ALLOWED
            // --------------------------------

            if (
                !rule.debitAccounts.includes(
                    debitCode
                )
            ) {
                throw new Error(
                    "The selected debit account is not allowed for this transaction type."
                );
            }

            if (
                !rule.creditAccounts.includes(
                    creditCode
                )
            ) {
                throw new Error(
                    "The selected credit account is not allowed for this transaction type."
                );
            }


            // --------------------------------
            // METADATA
            // --------------------------------

            const metadata = {};


            // --------------------------------
            // CUSTOMER TRANSACTIONS
            // --------------------------------

            if (
                type === "revenue" &&
                debitCode === "1030"
            ) {

                if (!customer.value) {
                    throw new Error(
                        "Select the customer for a credit sale."
                    );
                }

                if (!dueDate.value) {
                    throw new Error(
                        "Due date is required for a credit sale."
                    );
                }

                metadata.customerId =
                    customer.value;

                metadata.dueDate =
                    dueDate.value;
            }


            if (
                type === "customer_payment"
            ) {

                if (!customer.value) {
                    throw new Error(
                        "Select the customer."
                    );
                }

                metadata.customerId =
                    customer.value;
            }


            // --------------------------------
            // SUPPLIER TRANSACTIONS
            // --------------------------------

            if (
                type === "inventory_purchase" &&
                creditCode === "2010"
            ) {

                if (!supplier.value) {
                    throw new Error(
                        "Select the supplier for this credit purchase."
                    );
                }

                if (!dueDate.value) {
                    throw new Error(
                        "Due date is required for a credit purchase."
                    );
                }

                metadata.supplierId =
                    supplier.value;

                metadata.dueDate =
                    dueDate.value;
            }


            if (
                type === "expense" &&
                creditCode === "2010"
            ) {

                if (!supplier.value) {
                    throw new Error(
                        "Select the supplier for this credit purchase."
                    );
                }

                if (!dueDate.value) {
                    throw new Error(
                        "Due date is required for a credit purchase."
                    );
                }

                metadata.supplierId =
                    supplier.value;

                metadata.dueDate =
                    dueDate.value;
            }


            if (
                type === "supplier_payment"
            ) {

                if (!supplier.value) {
                    throw new Error(
                        "Select the supplier."
                    );
                }

                metadata.supplierId =
                    supplier.value;
            }


            // --------------------------------
            // CREATE JOURNAL TRANSACTION
            // --------------------------------

            const transaction =
                createJournalTransaction({

                    date,

                    description:
                        transactionDescription,

                    amount:
                        transactionAmount,

                    debitAccount:
                        debitCode,

                    creditAccount:
                        creditCode,

                    reference:
                        `${type.toUpperCase()}-${Date.now()}`,

                    metadata,

                    type

                });


            // --------------------------------
            // EDIT / UPDATE
            // --------------------------------

            if (editingTransactionId) {

                transaction.id =
                    editingTransactionId;

                updateTransaction(
                    editingTransactionId,
                    transaction
                );

                alert(
                    "Transaction updated successfully."
                );

            }

            // --------------------------------
            // NEW TRANSACTION
            // --------------------------------

            else {

                saveTransaction(
                    transaction
                );

                alert(
                    "Transaction saved successfully."
                );

            }


            // --------------------------------
            // RESET
            // --------------------------------

            resetForm();


            // --------------------------------
            // REFRESH TABLES
            // --------------------------------

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
// RESET FORM
// ------------------------------------

function resetForm() {

    form.reset();

    editingTransactionId = null;

    updateFormFields();

}


// ------------------------------------
// EDIT TRANSACTION
// ------------------------------------

/// ------------------------------------
// EDIT TRANSACTION
// ------------------------------------

document.addEventListener(
    "editTransaction",
    function (event) {

        const transaction =
            event.detail;

        if (!transaction) {
            return;
        }

        editingTransactionId =
            transaction.id;


        // --------------------------------
        // TRANSACTION TYPE
        // --------------------------------

        transactionType.value =
            transaction.type || "journal";


        // --------------------------------
        // BASIC FIELDS
        // --------------------------------

        transactionDate.value =
            transaction.date || "";

        description.value =
            transaction.description || "";

        amount.value =
            transaction.amount || "";


        // --------------------------------
        // LOAD ACCOUNT OPTIONS
        // --------------------------------

        updateAccountOptions();


        // --------------------------------
        // DEBIT ACCOUNT
        // --------------------------------

        if (
            debitAccount &&
            transaction.debitAccount
        ) {

            debitAccount.value =
                transaction.debitAccount;
        }


        // --------------------------------
        // CREDIT ACCOUNT
        // --------------------------------

        if (
            creditAccount &&
            transaction.creditAccount
        ) {

            creditAccount.value =
                transaction.creditAccount;
        }


        // --------------------------------
        // UPDATE CONDITIONAL FIELDS
        // --------------------------------

        updateFormFields();


        // --------------------------------
        // PARTY METADATA
        // --------------------------------

        const metadata =
            transaction.metadata || {};


        // --------------------------------
        // CUSTOMER
        // --------------------------------

        if (
            metadata.customerId &&
            customer
        ) {

            customer.value =
                metadata.customerId;
        }


        // --------------------------------
        // SUPPLIER
        // --------------------------------

        if (
            metadata.supplierId &&
            supplier
        ) {

            supplier.value =
                metadata.supplierId;
        }


        // --------------------------------
        // DUE DATE
        // --------------------------------

        if (
            metadata.dueDate &&
            dueDate
        ) {

            dueDate.value =
                metadata.dueDate;
        }

    }
);

// ------------------------------------
// INITIALIZE
// ------------------------------------

loadCustomers();

loadSuppliers();

updateFormFields();