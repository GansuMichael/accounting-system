// js/unallocatedBalances.js

import {
    getTransactions
} from "./storage.js";


// ------------------------------------
// CUSTOMER UNALLOCATED RECEIPTS
// ------------------------------------

export function getCustomerUnallocatedReceipts(
    customerId,
    endDate = ""
) {

    const transactions =
        getTransactions();


    return transactions.filter(
        transaction => {

            if (
                transaction.type !==
                "customer_payment"
            ) {
                return false;
            }


            if (
                transaction.customerId !==
                customerId
            ) {
                return false;
            }


            if (
                endDate &&
                transaction.date >
                endDate
            ) {
                return false;
            }


            return Number(
                transaction.unallocatedAmount || 0
            ) > 0;

        }
    ).map(
        transaction => ({

            id:
                transaction.id,

            date:
                transaction.date,

            reference:
                transaction.reference,

            description:
                transaction.description,

            amount:
                Number(
                    transaction.unallocatedAmount
                )

        })
    );

}


// ------------------------------------
// TOTAL CUSTOMER CREDIT
// ------------------------------------

export function getCustomerUnallocatedBalance(
    customerId,
    endDate = ""
) {

    return getCustomerUnallocatedReceipts(
        customerId,
        endDate
    ).reduce(
        (
            total,
            receipt
        ) =>
            total +
            receipt.amount,
        0
    );

}


// ------------------------------------
// SUPPLIER PREPAYMENTS
// ------------------------------------

export function getSupplierPrepayments(
    supplierId,
    endDate = ""
) {

    const transactions =
        getTransactions();


    return transactions.filter(
        transaction => {

            if (
                transaction.type !==
                "supplier_payment"
            ) {
                return false;
            }


            if (
                transaction.supplierId !==
                supplierId
            ) {
                return false;
            }


            if (
                endDate &&
                transaction.date >
                endDate
            ) {
                return false;
            }


            return Number(
                transaction.unallocatedAmount || 0
            ) > 0;

        }
    ).map(
        transaction => ({

            id:
                transaction.id,

            date:
                transaction.date,

            reference:
                transaction.reference,

            description:
                transaction.description,

            amount:
                Number(
                    transaction.unallocatedAmount
                )

        })
    );

}


// ------------------------------------
// TOTAL SUPPLIER PREPAYMENTS
// ------------------------------------

export function getSupplierPrepaymentBalance(
    supplierId,
    endDate = ""
) {

    return getSupplierPrepayments(
        supplierId,
        endDate
    ).reduce(
        (
            total,
            payment
        ) =>
            total +
            payment.amount,
        0
    );

}