// js/allocationMigration.js

import {
    getTransactions,
    saveTransactions
} from "./storage.js";


// ============================================
// FIND LEGACY CUSTOMER PAYMENTS
// ============================================

export function getLegacyCustomerPayments() {

    return getTransactions().filter(
        transaction => {

            return (
                transaction.type ===
                    "customer_payment" &&

                transaction.invoiceId &&

                !Array.isArray(
                    transaction.allocations
                )

            );

        }
    );

}


// ============================================
// FIND LEGACY SUPPLIER PAYMENTS
// ============================================

export function getLegacySupplierPayments() {

    return getTransactions().filter(
        transaction => {

            return (
                transaction.type ===
                    "supplier_payment" &&

                transaction.billId &&

                !Array.isArray(
                    transaction.allocations
                )

            );

        }
    );

}


// ============================================
// MIGRATE CUSTOMER PAYMENT
// ============================================

export function migrateCustomerPayment(
    paymentId
) {

    const transactions =
        getTransactions();


    const payment =
        transactions.find(
            transaction =>
                transaction.id ===
                paymentId
        );


    if (!payment) {

        throw new Error(
            "Customer payment not found."
        );

    }


    if (
        payment.type !==
        "customer_payment"
    ) {

        throw new Error(
            "Selected transaction is not a customer payment."
        );

    }


    if (
        !payment.invoiceId
    ) {

        throw new Error(
            "Payment has no invoice reference."
        );

    }


    if (
        Array.isArray(
            payment.allocations
        )
    ) {

        throw new Error(
            "This payment already has allocation records."
        );

    }


    const allocatedAmount =
        Number(
            payment.allocatedAmount || 0
        );


    if (
        allocatedAmount <= 0
    ) {

        throw new Error(
            "Payment has no allocated amount."
        );

    }


    const invoice =
        transactions.find(
            transaction =>
                transaction.id ===
                    payment.invoiceId &&

                transaction.type ===
                    "revenue"
        );


    if (!invoice) {

        throw new Error(
            "Referenced customer invoice not found."
        );

    }


    if (
        invoice.customerId !==
        payment.customerId
    ) {

        throw new Error(
            "Payment and invoice belong to different customers."
        );

    }


    if (
        allocatedAmount >
        Number(invoice.amount || 0)
    ) {

        throw new Error(
            "Allocated amount exceeds invoice amount."
        );

    }


    payment.allocations = [

        {
            invoiceId:
                invoice.id,

            amount:
                allocatedAmount,

            appliedAt:
                payment.createdAt ||
                new Date().toISOString(),

            migrated:
                true

        }

    ];


    payment.unallocatedAmount =
        Math.max(
            0,
            Number(payment.amount || 0) -
            allocatedAmount
        );


    saveTransactions(
        transactions
    );


    return payment;

}


// ============================================
// MIGRATE SUPPLIER PAYMENT
// ============================================

export function migrateSupplierPayment(
    paymentId
) {

    const transactions =
        getTransactions();


    const payment =
        transactions.find(
            transaction =>
                transaction.id ===
                paymentId
        );


    if (!payment) {

        throw new Error(
            "Supplier payment not found."
        );

    }


    if (
        payment.type !==
        "supplier_payment"
    ) {

        throw new Error(
            "Selected transaction is not a supplier payment."
        );

    }


    if (
        !payment.billId
    ) {

        throw new Error(
            "Payment has no bill reference."
        );

    }


    if (
        Array.isArray(
            payment.allocations
        )
    ) {

        throw new Error(
            "This payment already has allocation records."
        );

    }


    const allocatedAmount =
        Number(
            payment.allocatedAmount || 0
        );


    if (
        allocatedAmount <= 0
    ) {

        throw new Error(
            "Payment has no allocated amount."
        );

    }


    const bill =
        transactions.find(
            transaction =>
                transaction.id ===
                    payment.billId &&

                transaction.type ===
                    "expense"
        );


    if (!bill) {

        throw new Error(
            "Referenced supplier bill not found."
        );

    }


    if (
        bill.supplierId !==
        payment.supplierId
    ) {

        throw new Error(
            "Payment and bill belong to different suppliers."
        );

    }


    if (
        allocatedAmount >
        Number(bill.amount || 0)
    ) {

        throw new Error(
            "Allocated amount exceeds bill amount."
        );

    }


    payment.allocations = [

        {
            billId:
                bill.id,

            amount:
                allocatedAmount,

            appliedAt:
                payment.createdAt ||
                new Date().toISOString(),

            migrated:
                true

        }

    ];


    payment.unallocatedAmount =
        Math.max(
            0,
            Number(payment.amount || 0) -
            allocatedAmount
        );


    saveTransactions(
        transactions
    );


    return payment;

}


// ============================================
// MIGRATE ALL SAFE LEGACY PAYMENTS
// ============================================

export function migrateAllLegacyAllocations() {

    const transactions =
        getTransactions();


    let migratedCustomers = 0;

    let migratedSuppliers = 0;

    let skipped = 0;


    transactions.forEach(
        payment => {

            try {

                if (
                    payment.type ===
                        "customer_payment" &&

                    payment.invoiceId &&

                    !Array.isArray(
                        payment.allocations
                    ) &&

                    Number(
                        payment.allocatedAmount || 0
                    ) > 0
                ) {

                    migrateCustomerPayment(
                        payment.id
                    );

                    migratedCustomers++;

                }


                else if (
                    payment.type ===
                        "supplier_payment" &&

                    payment.billId &&

                    !Array.isArray(
                        payment.allocations
                    ) &&

                    Number(
                        payment.allocatedAmount || 0
                    ) > 0
                ) {

                    migrateSupplierPayment(
                        payment.id
                    );

                    migratedSuppliers++;

                }

            }

            catch (error) {

                console.warn(
                    "Skipped transaction:",
                    payment.id,
                    error.message
                );

                skipped++;

            }

        }
    );


    return {

        migratedCustomers,

        migratedSuppliers,

        skipped,

        totalMigrated:
            migratedCustomers +
            migratedSuppliers

    };

}