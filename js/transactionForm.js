// js/transactionForm.js

import {
    createRevenueTransaction,
    createExpenseTransaction,
    createAssetTransaction,
    createOwnerDrawingTransaction
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

const account =
    document.getElementById(
        "account"
    );

const receivingAccount =
    document.getElementById(
        "receivingAccount"
    );

const paymentAccount =
    document.getElementById(
        "paymentAccount"
    );

const assetAccount =
    document.getElementById(
        "assetAccount"
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

function updateFormFields() {

    const type =
        transactionType.value;


    // Hide everything first

    normalAccountGroup.style.display =
        "none";

    receivingAccountGroup.style.display =
        "none";

    paymentAccountGroup.style.display =
        "none";

    drawingPaymentAccountGroup.style.display =
        "none";

    assetAccountGroup.style.display =
        "none";

    customerGroup.style.display =
        "none";

    supplierGroup.style.display =
        "none";

    dueDateGroup.style.display =
        "none";


    // --------------------------------
    // REVENUE
    // --------------------------------

    if (type === "revenue") {

        normalAccountGroup.style.display =
            "block";

        receivingAccountGroup.style.display =
            "block";


        // Customer is only needed
        // for credit sales

        if (
            receivingAccount.value ===
            "1030"
        ) {

            customerGroup.style.display =
                "block";

            dueDateGroup.style.display =
                "block";

        }

    }


    // --------------------------------
    // EXPENSE
    // --------------------------------

    if (type === "expense") {

        normalAccountGroup.style.display =
            "block";

        paymentAccountGroup.style.display =
            "block";


        // Supplier is only needed
        // for credit purchases

        if (
            paymentAccount.value ===
            "2010"
        ) {

            supplierGroup.style.display =
                "block";

            dueDateGroup.style.display =
                "block";

        }

    }


    // --------------------------------
    // ASSET
    // --------------------------------

    if (type === "asset") {

        assetAccountGroup.style.display =
            "block";

        paymentAccountGroup.style.display =
            "block";

    }

    // --------------------------------
    // OWNER DRAWING
    // --------------------------------

    if (type === "owner_drawing") {
        drawingPaymentAccountGroup.style.display =
            "block";
    }

}


// ------------------------------------
// TRANSACTION TYPE CHANGE
// ------------------------------------

transactionType.addEventListener(
    "change",
    updateFormFields
);


// ------------------------------------
// RECEIVING ACCOUNT CHANGE
// ------------------------------------

receivingAccount.addEventListener(
    "change",
    updateFormFields
);


// ------------------------------------
// PAYMENT ACCOUNT CHANGE
// ------------------------------------

paymentAccount.addEventListener(
    "change",
    updateFormFields
);


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


            if (!date) {

                throw new Error(
                    "Transaction date is required."
                );

            }


            if (
                !transactionDescription
            ) {

                throw new Error(
                    "Description is required."
                );

            }


            if (
                !transactionAmount ||
                transactionAmount <= 0
            ) {
            
                throw new Error(
                    "Amount must be greater than zero."
                );
            
            }
            
            
            // --------------------------------
            // OWNER DRAWING
            // --------------------------------
            
            if (type === "owner_drawing") {
                const drawingPaymentAccount =
                    document.getElementById(
                        "drawingPaymentAccount"
                    ).value;
            
                if (!drawingPaymentAccount) {
                    throw new Error(
                        "Select the payment account."
                    );
                }
            
                const drawingTransaction =
                    createOwnerDrawingTransaction({
                        date,
                        description: transactionDescription,
                        amount: transactionAmount,
                        paidFrom: drawingPaymentAccount
                    });
            
                if (editingTransactionId) {
                    drawingTransaction.id =
                        editingTransactionId;
            
                    updateTransaction(
                        editingTransactionId,
                        drawingTransaction
                    );
            
                    alert(
                        "Owner drawing updated successfully."
                    );
                } else {
                    saveTransaction(
                        drawingTransaction
                    );
            
                    alert(
                        "Owner drawing saved successfully."
                    );
                }
            
                resetForm();
            
                document.dispatchEvent(
                    new CustomEvent(
                        "transactionsUpdated"
                    )
                );
            
                return;
            }
            
            
            let transaction;


            // --------------------------------
            // REVENUE
            // --------------------------------

            if (type === "revenue") {

                if (!account.value) {

                    throw new Error(
                        "Select the revenue account."
                    );

                }


                if (
                    !receivingAccount.value
                ) {

                    throw new Error(
                        "Select the receiving account."
                    );

                }


                // Credit sale

                if (
                    receivingAccount.value ===
                    "1030"
                ) {

                    if (!customer.value) {

                        throw new Error(
                            "Select the customer."
                        );

                    }


                    if (!dueDate.value) {

                        throw new Error(
                            "Due date is required for credit sales."
                        );

                    }

                }


                transaction =
                    createRevenueTransaction({

                        date,

                        description:
                            transactionDescription,

                        amount:
                            transactionAmount,

                        receivedAccount:
                            receivingAccount.value,

                        revenueAccount:
                            account.value

                    });


                if (
                    receivingAccount.value ===
                    "1030"
                ) {

                    transaction.customerId =
                        customer.value;

                    transaction.dueDate =
                        dueDate.value;

                }

            }


            // --------------------------------
            // EXPENSE
            // --------------------------------

            else if (
                type === "expense"
            ) {

                if (!account.value) {

                    throw new Error(
                        "Select the expense account."
                    );

                }


                if (
                    !paymentAccount.value
                ) {

                    throw new Error(
                        "Select the payment account."
                    );

                }


                // Credit purchase

                if (
                    paymentAccount.value ===
                    "2010"
                ) {

                    if (!supplier.value) {

                        throw new Error(
                            "Select the supplier."
                        );

                    }


                    if (!dueDate.value) {

                        throw new Error(
                            "Due date is required for credit purchases."
                        );

                    }

                }


                transaction =
                    createExpenseTransaction({

                        date,

                        description:
                            transactionDescription,

                        amount:
                            transactionAmount,

                        expenseAccount:
                            account.value,

                        paidFrom:
                            paymentAccount.value

                    });


                if (
                    paymentAccount.value ===
                    "2010"
                ) {

                    transaction.supplierId =
                        supplier.value;

                    transaction.dueDate =
                        dueDate.value;

                }

            }


            // --------------------------------
            // ASSET
            // --------------------------------

            else if (
                type === "asset"
            ) {

                if (!assetAccount.value) {

                    throw new Error(
                        "Select the asset account."
                    );

                }


                if (
                    !paymentAccount.value
                ) {

                    throw new Error(
                        "Select the payment account."
                    );

                }


                transaction =
                    createAssetTransaction({

                        date,

                        description:
                            transactionDescription,

                        amount:
                            transactionAmount,

                        assetAccount:
                            assetAccount.value,

                        paidFrom:
                            paymentAccount.value

                    });

            }


            else {

                throw new Error(
                    "Select a transaction type."
                );

            }


            // --------------------------------
            // SAVE
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


            // Tell journal table
            // to refresh

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

document.addEventListener(
    "editTransaction",
    function (event) {

        const transaction =
            event.detail;


        editingTransactionId =
            transaction.id;


        transactionType.value =
            transaction.type ===
            "customer_payment"
                ? "revenue"
                : transaction.type;


        transactionDate.value =
            transaction.date;


        description.value =
            transaction.description;


        amount.value =
            transaction.amount;


        if (
            transaction.type ===
            "revenue"
        ) {

            account.value =
                transaction.revenueAccount;

            receivingAccount.value =
                transaction.account;


            if (
                transaction.customerId
            ) {

                customer.value =
                    transaction.customerId;

            }


            if (
                transaction.dueDate
            ) {

                dueDate.value =
                    transaction.dueDate;

            }

        }


        if (
            transaction.type ===
            "expense"
        ) {

            account.value =
                transaction.expenseAccount;

            paymentAccount.value =
                transaction.account;


            if (
                transaction.supplierId
            ) {

                supplier.value =
                    transaction.supplierId;

            }


            if (
                transaction.dueDate
            ) {

                dueDate.value =
                    transaction.dueDate;

            }

        }


        if (
            transaction.type ===
            "asset"
        ) {

            assetAccount.value =
                transaction.assetAccount;

            paymentAccount.value =
                transaction.account;

        }


        updateFormFields();

    }
);


// ------------------------------------
// INITIALIZE
// ------------------------------------

loadCustomers();

loadSuppliers();

updateFormFields();