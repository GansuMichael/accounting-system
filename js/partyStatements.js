// js/partyStatements.js

import { getTransactions } from "./storage.js";
import {
    getCustomerById,
    getSupplierById
} from "./parties.js";


// ------------------------------------
// CUSTOMER STATEMENT
// ------------------------------------

export function getCustomerStatement(
    customerId,
    endDate = ""
) {

    const customer =
        getCustomerById(
            customerId
        );


    if (!customer) {

        throw new Error(
            "Customer not found."
        );

    }


    const transactions =
        getTransactions();


    const entries = [];


    transactions.forEach(
        transaction => {

            if (
                endDate &&
                transaction.date >
                endDate
            ) {

                return;

            }


            // ----------------------------
            // CREDIT SALE
            // ----------------------------

            if (
                transaction.type ===
                "revenue"
                &&
                transaction.customerId ===
                customerId
            ) {

                entries.push({

                    date:
                        transaction.date,

                    reference:
                        transaction.reference,

                    description:
                        transaction.description,

                    debit:
                        Number(
                            transaction.amount
                        ),

                    credit:
                        0

                });

            }


            // ----------------------------
            // CUSTOMER PAYMENT
            // ----------------------------

            if (
                transaction.type ===
                "customer_payment"
                &&
                transaction.customerId ===
                customerId
            ) {

                entries.push({

                    date:
                        transaction.date,

                    reference:
                        transaction.reference,

                    description:
                        transaction.description,

                    debit:
                        0,

                    credit:
                        Number(
                            transaction.amount
                        )

                });

            }

        }
    );


    // --------------------------------
    // SORT BY DATE
    // --------------------------------

    entries.sort(
        (a, b) =>
            a.date.localeCompare(
                b.date
            )
    );


    // --------------------------------
    // RUNNING BALANCE
    // --------------------------------

    let balance = 0;


    entries.forEach(
        entry => {

            balance +=
                entry.debit -
                entry.credit;


            entry.balance =
                balance;

        }
    );


    return {

        partyType:
            "customer",

        partyId:
            customer.id,

        partyName:
            customer.name,

        entries,

        balance

    };

}


// ------------------------------------
// SUPPLIER STATEMENT
// ------------------------------------

export function getSupplierStatement(
    supplierId,
    endDate = ""
) {

    const supplier =
        getSupplierById(
            supplierId
        );


    if (!supplier) {

        throw new Error(
            "Supplier not found."
        );

    }


    const transactions =
        getTransactions();


    const entries = [];


    transactions.forEach(
        transaction => {

            if (
                endDate &&
                transaction.date >
                endDate
            ) {

                return;

            }


            // ----------------------------
            // CREDIT PURCHASE
            // ----------------------------

            if (
                transaction.type ===
                "expense"
                &&
                transaction.supplierId ===
                supplierId
            ) {

                entries.push({

                    date:
                        transaction.date,

                    reference:
                        transaction.reference,

                    description:
                        transaction.description,

                    debit:
                        0,

                    credit:
                        Number(
                            transaction.amount
                        )

                });

            }


            // ----------------------------
            // SUPPLIER PAYMENT
            // ----------------------------

            if (
                transaction.type ===
                "supplier_payment"
                &&
                transaction.supplierId ===
                supplierId
            ) {

                entries.push({

                    date:
                        transaction.date,

                    reference:
                        transaction.reference,

                    description:
                        transaction.description,

                    debit:
                        Number(
                            transaction.amount
                        ),

                    credit:
                        0

                });

            }

        }
    );


    // --------------------------------
    // SORT
    // --------------------------------

    entries.sort(
        (a, b) =>
            a.date.localeCompare(
                b.date
            )
    );


    // --------------------------------
    // RUNNING BALANCE
    // --------------------------------

    let balance = 0;


    entries.forEach(
        entry => {

            balance +=
                entry.credit -
                entry.debit;


            entry.balance =
                balance;

        }
    );


    return {

        partyType:
            "supplier",

        partyId:
            supplier.id,

        partyName:
            supplier.name,

        entries,

        balance

    };

}