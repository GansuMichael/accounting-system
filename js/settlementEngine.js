// js/settlementEngine.js

import { createJournalEntry } from "./journal.js";
import {
    getTransactions,
    saveTransaction
} from "./storage.js";

import {
    getCustomerById,
    getSupplierById
} from "./parties.js";

import {
    ensurePeriodOpen
} from "./accountingPeriods.js";


// ============================================
// ACCOUNT NAMES
// ============================================

function getAccountName(code) {

    const names = {

        "1010": "Cash",

        "1020": "Bank",

        "1030": "Accounts Receivable",

        "2010": "Accounts Payable"

    };

    return names[code] || null;

}


// ============================================
// VALIDATE ALLOCATIONS
// ============================================

function validateAllocations(
    allocations,
    amount,
    documents,
    documentKey
) {

    if (
        !Array.isArray(allocations)
    ) {

        throw new Error(
            "Allocations must be an array."
        );

    }


    let totalAllocated = 0;


    allocations.forEach(
        allocation => {

            const document =
                documents.find(
                    item =>
                        item.id ===
                        allocation[documentKey]
                );


            if (!document) {

                throw new Error(
                    `Document not found: ${allocation[documentKey]}`
                );

            }


            const allocationAmount =
                Number(
                    allocation.amount
                );


            if (
                !allocationAmount ||
                allocationAmount <= 0
            ) {

                throw new Error(
                    "Allocation amount must be greater than zero."
                );

            }


            if (
                allocationAmount >
                Number(
                    document.outstanding
                )
            ) {

                throw new Error(
                    `Allocation exceeds outstanding balance for ${document.reference}`
                );

            }


            totalAllocated +=
                allocationAmount;

        }
    );


    if (
        totalAllocated > Number(amount)
    ) {

        throw new Error(
            "Total allocations cannot exceed payment amount."
        );

    }


    return totalAllocated;

}


// ============================================
// CUSTOMER PAYMENT
// ============================================

export function createCustomerPayment({
    date,
    description,
    amount,
    receivedInto = "1010",
    customerId,
    allocations = [],
    reference = ""
}) {

    if (!date) {

        throw new Error(
            "Payment date is required."
        );

    }


    amount =
        Number(amount);


    if (
        !amount ||
        amount <= 0
    ) {

        throw new Error(
            "Payment amount must be greater than zero."
        );

    }


    if (!customerId) {

        throw new Error(
            "Customer is required."
        );

    }


    const customer =
        getCustomerById(
            customerId
        );


    if (!customer) {

        throw new Error(
            "Customer not found."
        );

    }

    ensurePeriodOpen(date);


    const accountName =
        getAccountName(
            receivedInto
        );


    if (!accountName) {

        throw new Error(
            "Invalid receiving account."
        );

    }


    const transactions =
        getTransactions();


    const invoices =
        transactions

            .filter(
                transaction => {

                    return (
                        transaction.type ===
                            "revenue" &&

                        transaction.customerId ===
                            customerId &&

                        transaction.account ===
                            "1030"
                    );

                }
            )

            .map(
                invoice => {

                    const allocated =
                        getInvoiceAllocated(
                            transactions,
                            invoice.id
                        );


                    return {

                        ...invoice,

                        outstanding:
                            Math.max(
                                0,
                                Number(
                                    invoice.amount || 0
                                ) -
                                allocated
                            )

                    };

                }
            );


    const totalAllocated =
        validateAllocations(
            allocations,
            amount,
            invoices,
            "invoiceId"
        );


    const unallocatedAmount =
        amount -
        totalAllocated;


    const journalEntry =
        createJournalEntry({

            date,

            description:
                description ||
                `Payment from ${customer.name}`,

            reference:
                reference ||
                `REC-${Date.now()}`,

            lines: [

                {
                    accountCode:
                        receivedInto,

                    accountName:
                        accountName,

                    debit:
                        amount,

                    credit:
                        0
                },

                {
                    accountCode:
                        "1030",

                    accountName:
                        "Accounts Receivable",

                    debit:
                        0,

                    credit:
                        amount
                }

            ]

        });


    const transaction = {

        ...journalEntry,

        type:
            "customer_payment",

        amount,

        account:
            receivedInto,

        customerId,

        customerName:
            customer.name,

        allocations,

        unallocatedAmount

    };


    saveTransaction(
        transaction
    );


    return transaction;

}


// ============================================
// SUPPLIER PAYMENT
// ============================================

export function createSupplierPayment({
    date,
    description,
    amount,
    paidFrom = "1010",
    supplierId,
    allocations = [],
    reference = ""
}) {

    if (!date) {

        throw new Error(
            "Payment date is required."
        );

    }


    amount =
        Number(amount);


    if (
        !amount ||
        amount <= 0
    ) {

        throw new Error(
            "Payment amount must be greater than zero."
        );

    }


    if (!supplierId) {

        throw new Error(
            "Supplier is required."
        );

    }


    const supplier =
        getSupplierById(
            supplierId
        );


    if (!supplier) {

        throw new Error(
            "Supplier not found."
        );

    }


    const accountName =
        getAccountName(
            paidFrom
        );


    if (!accountName) {

        throw new Error(
            "Invalid payment account."
        );

    }

    ensurePeriodOpen(date);


    const transactions =
        getTransactions();


    const bills =
        transactions

            .filter(
                transaction => {

                    return (
                        transaction.type ===
                            "expense" &&

                        transaction.supplierId ===
                            supplierId &&

                        transaction.account ===
                            "2010"
                    );

                }
            )

            .map(
                bill => {

                    const allocated =
                        getBillAllocated(
                            transactions,
                            bill.id
                        );


                    return {

                        ...bill,

                        outstanding:
                            Math.max(
                                0,
                                Number(
                                    bill.amount || 0
                                ) -
                                allocated
                            )

                    };

                }
            );


    const totalAllocated =
        validateAllocations(
            allocations,
            amount,
            bills,
            "billId"
        );


    const unallocatedAmount =
        amount -
        totalAllocated;


    const journalEntry =
        createJournalEntry({

            date,

            description:
                description ||
                `Payment to ${supplier.name}`,

            reference:
                reference ||
                `PAY-${Date.now()}`,

            lines: [

                {
                    accountCode:
                        "2010",

                    accountName:
                        "Accounts Payable",

                    debit:
                        amount,

                    credit:
                        0
                },

                {
                    accountCode:
                        paidFrom,

                    accountName:
                        accountName,

                    debit:
                        0,

                    credit:
                        amount
                }

            ]

        });


    const transaction = {

        ...journalEntry,

        type:
            "supplier_payment",

        amount,

        account:
            paidFrom,

        supplierId,

        supplierName:
            supplier.name,

        allocations,

        unallocatedAmount

    };


    saveTransaction(
        transaction
    );


    return transaction;

}


// ============================================
// CALCULATE EXISTING INVOICE ALLOCATIONS
// ============================================

function getInvoiceAllocated(
    transactions,
    invoiceId
) {

    return transactions.reduce(
        (total, transaction) => {

            if (
                !Array.isArray(
                    transaction.allocations
                )
            ) {

                return total;

            }


            return total +
                transaction.allocations

                    .filter(
                        allocation =>
                            allocation.invoiceId ===
                            invoiceId
                    )

                    .reduce(
                        (
                            sum,
                            allocation
                        ) =>
                            sum +
                            Number(
                                allocation.amount || 0
                            ),
                        0
                    );

        },
        0
    );

}


// ============================================
// CALCULATE EXISTING BILL ALLOCATIONS
// ============================================

function getBillAllocated(
    transactions,
    billId
) {

    return transactions.reduce(
        (total, transaction) => {

            if (
                !Array.isArray(
                    transaction.allocations
                )
            ) {

                return total;

            }


            return total +
                transaction.allocations

                    .filter(
                        allocation =>
                            allocation.billId ===
                            billId
                    )

                    .reduce(
                        (
                            sum,
                            allocation
                        ) =>
                            sum +
                            Number(
                                allocation.amount || 0
                            ),
                        0
                    );

        },
        0
    );

}