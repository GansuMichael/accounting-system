// js/invoices.js

import { getTransactions } from "./storage.js";


// ------------------------------------
// GET CUSTOMER INVOICES
// ------------------------------------

export function getCustomerInvoices(
    customerId,
    endDate = ""
) {

    const transactions =
        getTransactions();


    return transactions
        .filter(transaction => {

            // Only credit sales

            if (
                transaction.type !==
                "revenue"
            ) {

                return false;

            }


            // Must belong to customer

            if (
                transaction.customerId !==
                customerId
            ) {

                return false;

            }


            // Must be Accounts Receivable

            if (
                transaction.account !==
                "1030"
            ) {

                return false;

            }


            // Ignore transactions
            // after requested date

            if (
                endDate &&
                transaction.date >
                endDate
            ) {

                return false;

            }


            return true;

        })

        .map(transaction => ({

            id:
                transaction.id,

            invoiceNumber:
                transaction.reference,

            date:
                transaction.date,

            dueDate:
                transaction.dueDate,

            customerId:
                transaction.customerId,

            customerName:
                transaction.customerName,

            description:
                transaction.description,

            amount:
                Number(
                    transaction.amount || 0
                )

        }));

}


// ------------------------------------
// GET SUPPLIER BILLS
// ------------------------------------

export function getSupplierBills(
    supplierId,
    endDate = ""
) {

    const transactions =
        getTransactions();


    return transactions
        .filter(transaction => {

            // Only credit purchases

            if (
                transaction.type !==
                "expense"
            ) {

                return false;

            }


            // Must belong to supplier

            if (
                transaction.supplierId !==
                supplierId
            ) {

                return false;

            }


            // Must be Accounts Payable

            if (
                transaction.account !==
                "2010"
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


            return true;

        })

        .map(transaction => ({

            id:
                transaction.id,

            billNumber:
                transaction.reference,

            date:
                transaction.date,

            dueDate:
                transaction.dueDate,

            supplierId:
                transaction.supplierId,

            supplierName:
                transaction.supplierName,

            description:
                transaction.description,

            amount:
                Number(
                    transaction.amount || 0
                )

        }));

}