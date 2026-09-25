// js/creditApplicationEngine.js

import {
    getTransactions,
    saveTransactions
} from "./storage.js";

import {
    ensureTransactionEditable
} from "./periodControl.js";


// ============================================
// CUSTOMER CREDIT BALANCE
// ============================================

export function getCustomerCreditBalance(
    customerId
) {

    return getTransactions()
        .filter(
            transaction =>
                transaction.type ===
                    "customer_payment" &&
                transaction.customerId ===
                    customerId
        )
        .reduce(
            (
                total,
                transaction
            ) =>
                total +
                Number(
                    transaction.unallocatedAmount || 0
                ),
            0
        );

}


// ============================================
// SUPPLIER PREPAYMENT BALANCE
// ============================================

export function getSupplierPrepaymentBalance(
    supplierId
) {
    ensureTransactionEditable(
        paymentTransaction
    );
    
    return getTransactions()
        .filter(
            transaction =>
                transaction.type ===
                    "supplier_payment" &&
                transaction.supplierId ===
                    supplierId
        )
        .reduce(
            (
                total,
                transaction
            ) =>
                total +
                Number(
                    transaction.unallocatedAmount || 0
                ),
            0
        );

}


// ============================================
// APPLY CUSTOMER CREDIT
// ============================================

export function applyCustomerCredit({

    paymentId,

    invoiceId,

    amount

}) {

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


    const invoice =
        transactions.find(
            transaction =>
                transaction.id ===
                invoiceId
        );


    if (!invoice) {

        throw new Error(
            "Invoice not found."
        );

    }


    if (
        invoice.type !==
        "revenue"
    ) {

        throw new Error(
            "Selected transaction is not a sales invoice."
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


    amount =
        Number(amount);


    if (
        !amount ||
        amount <= 0
    ) {

        throw new Error(
            "Application amount must be greater than zero."
        );

    }


    const availableCredit =
        Number(
            payment.unallocatedAmount || 0
        );


    if (
        amount >
        availableCredit
    ) {

        throw new Error(
            "Application exceeds available customer credit."
        );

    }


    const invoiceAllocated =
        getAllocatedToInvoice(
            transactions,
            invoiceId
        );


    const invoiceOutstanding =
        Math.max(
            0,
            Number(
                invoice.amount || 0
            ) -
            invoiceAllocated
        );


    if (
        amount >
        invoiceOutstanding
    ) {

        throw new Error(
            "Application exceeds invoice outstanding balance."
        );

    }


    if (
        !Array.isArray(
            payment.allocations
        )
    ) {

        payment.allocations = [];

    }


    payment.allocations.push({

        invoiceId,

        amount,

        appliedAt:
            new Date().toISOString()

    });


    payment.unallocatedAmount =
        availableCredit -
        amount;


    saveTransactions(
        transactions
    );


    return payment;

}


// ============================================
// APPLY SUPPLIER PREPAYMENT
// ============================================

export function applySupplierPrepayment({

    paymentId,

    billId,

    amount

}) {

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


    const bill =
        transactions.find(
            transaction =>
                transaction.id ===
                billId
        );


    if (!bill) {

        throw new Error(
            "Supplier bill not found."
        );

    }


    if (
        bill.type !==
        "expense"
    ) {

        throw new Error(
            "Selected transaction is not a supplier bill."
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


    amount =
        Number(amount);


    if (
        !amount ||
        amount <= 0
    ) {

        throw new Error(
            "Application amount must be greater than zero."
        );

    }


    const availablePrepayment =
        Number(
            payment.unallocatedAmount || 0
        );


    if (
        amount >
        availablePrepayment
    ) {

        throw new Error(
            "Application exceeds available supplier prepayment."
        );

    }


    const billAllocated =
        getAllocatedToBill(
            transactions,
            billId
        );


    const billOutstanding =
        Math.max(
            0,
            Number(
                bill.amount || 0
            ) -
            billAllocated
        );


    if (
        amount >
        billOutstanding
    ) {

        throw new Error(
            "Application exceeds bill outstanding balance."
        );

    }


    if (
        !Array.isArray(
            payment.allocations
        )
    ) {

        payment.allocations = [];

    }


    payment.allocations.push({

        billId,

        amount,

        appliedAt:
            new Date().toISOString()

    });


    payment.unallocatedAmount =
        availablePrepayment -
        amount;


    saveTransactions(
        transactions
    );


    return payment;

}


// ============================================
// GET INVOICE ALLOCATED
// ============================================

function getAllocatedToInvoice(
    transactions,
    invoiceId
) {

    return transactions.reduce(
        (
            total,
            transaction
        ) => {

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
// GET BILL ALLOCATED
// ============================================

function getAllocatedToBill(
    transactions,
    billId
) {

    return transactions.reduce(
        (
            total,
            transaction
        ) => {

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