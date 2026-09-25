// js/allocationAdjustment.js

import {
    getTransactions,
    saveTransactions
} from "./storage.js";

import {
    createAuditLog
} from "./auditLog.js";

import {
    ensurePeriodOpen
} from "./accountingPeriods.js";


// ============================================
// GET PAYMENT
// ============================================

function getPayment(
    transactions,
    paymentId
) {

    const payment =
        transactions.find(
            transaction =>
                transaction.id === paymentId
        );


    if (!payment) {

        throw new Error(
            "Payment not found."
        );

    }


    if (
        payment.type !==
            "customer_payment" &&
        payment.type !==
            "supplier_payment"
    ) {

        throw new Error(
            "Selected transaction is not a settlement payment."
        );

    }


    return payment;

}


// ============================================
// GET PAYMENT ALLOCATIONS
// ============================================

export function getPaymentAllocations(
    paymentId
) {

    const transactions =
        getTransactions();


    const payment =
        getPayment(
            transactions,
            paymentId
        );


    return {

        paymentId:
            payment.id,

        paymentType:
            payment.type,

        amount:
            Number(
                payment.amount || 0
            ),

        allocations:
            Array.isArray(
                payment.allocations
            )
                ? payment.allocations
                : [],

        unallocatedAmount:
            Number(
                payment.unallocatedAmount || 0
            )

    };

}


// ============================================
// VALIDATE NEW ALLOCATIONS
// ============================================

function validateNewAllocations(
    payment,
    allocations,
    transactions
) {

    if (
        !Array.isArray(
            allocations
        )
    ) {

        throw new Error(
            "Allocations must be an array."
        );

    }


    const isCustomerPayment =
        payment.type ===
        "customer_payment";


    const documentType =
        isCustomerPayment
            ? "revenue"
            : "expense";


    const partyField =
        isCustomerPayment
            ? "customerId"
            : "supplierId";


    const documentField =
        isCustomerPayment
            ? "invoiceId"
            : "billId";


    let totalAllocated = 0;


    allocations.forEach(
        allocation => {

            const document =
                transactions.find(
                    transaction => {

                        return (

                            transaction.id ===
                                allocation[
                                    documentField
                                ] &&

                            transaction.type ===
                                documentType &&

                            transaction[
                                partyField
                            ] ===
                                payment[
                                    partyField
                                ]

                        );

                    }
                );


            if (!document) {

                throw new Error(
                    "Invalid invoice or bill selected."
                );

            }


            const amount =
                Number(
                    allocation.amount
                );


            if (
                !amount ||
                amount <= 0
            ) {

                throw new Error(
                    "Allocation amount must be greater than zero."
                );

            }


            totalAllocated +=
                amount;

        }
    );


    if (
        totalAllocated >
        Number(payment.amount)
    ) {

        throw new Error(
            "Total allocation exceeds payment amount."
        );

    }


    return totalAllocated;

}


// ============================================
// UPDATE PAYMENT ALLOCATIONS
// ============================================

export function updatePaymentAllocations({

    paymentId,

    allocations,

    reason = "Allocation corrected"

}) {

    const transactions =
        getTransactions();


    const payment =
        getPayment(
            transactions,
            paymentId
        );


    const oldAllocations =
        Array.isArray(
            payment.allocations
        )

            ? JSON.parse(
                JSON.stringify(
                    payment.allocations
                )
            )

            : [];


    const totalAllocated =
        validateNewAllocations(
            payment,
            allocations,
            transactions
        );


    const unallocatedAmount =
        Number(
            payment.amount
        ) -
        totalAllocated;


    payment.allocations =
        allocations.map(
            allocation => ({

                ...allocation,

                updatedAt:
                    new Date()
                        .toISOString()

            })
        );

        ensurePeriodOpen(
            payment.date
        );

    payment.unallocatedAmount =
        unallocatedAmount;


    payment.allocationUpdatedAt =
        new Date()
            .toISOString();


    saveTransactions(
        transactions
    );


    createAuditLog({

        action:
            "UPDATE_ALLOCATION",

        entityType:
            "PAYMENT",

        entityId:
            payment.id,

        description:
            `Allocation updated for ${
                payment.reference
            }`,

        oldValue:
            oldAllocations,

        newValue:
            payment.allocations,

        reason,

        user:
            "System"

    });


    return payment;

}

// ============================================
// REMOVE ALL ALLOCATIONS
// ============================================

export function clearPaymentAllocations({

    paymentId,

    reason =
        "All payment allocations cleared"

}) {

    return updatePaymentAllocations({

        paymentId,

        allocations: [],

        reason

    });

}


// ============================================
// REVERSE SINGLE ALLOCATION
// ============================================

export function reversePaymentAllocation({
    paymentId,
    documentId
}) {

    const transactions =
        getTransactions();


    const payment =
        getPayment(
            transactions,
            paymentId
        );


    if (
        !Array.isArray(
            payment.allocations
        )
    ) {

        throw new Error(
            "Payment has no allocations."
        );

    }


    const documentField =
        payment.type ===
        "customer_payment"

            ? "invoiceId"

            : "billId";


    const existing =
        payment.allocations.find(
            allocation =>
                allocation[
                    documentField
                ] ===
                documentId
        );


    if (!existing) {

        throw new Error(
            "Allocation not found."
        );

    }


    payment.allocations =
        payment.allocations.filter(
            allocation =>
                allocation[
                    documentField
                ] !==
                documentId
        );


    payment.unallocatedAmount =
        Number(
            payment.unallocatedAmount || 0
        ) +
        Number(
            existing.amount || 0
        );


    payment.allocationUpdatedAt =
        new Date().toISOString();


    saveTransactions(
        transactions
    );


    return payment;

}