// js/invoiceBalances.js

import {
    getTransactions
} from "./storage.js";

import {
    getCustomerInvoices,
    getSupplierBills
} from "./invoices.js";


// ============================================
// CUSTOMER INVOICE BALANCES
// ============================================

export function getCustomerInvoiceBalances(
    customerId,
    endDate = ""
) {

    const transactions =
        getTransactions();


    const invoices =
        getCustomerInvoices(
            customerId,
            endDate
        );


    return invoices.map(
        invoice => {

            const allocated =
                getInvoiceAllocatedAmount(
                    transactions,
                    invoice.id,
                    endDate
                );


            const outstanding =
                Math.max(
                    0,
                    Number(
                        invoice.amount || 0
                    ) -
                    allocated
                );


            return {

                ...invoice,

                paid:
                    allocated,

                outstanding

            };

        }
    );

}


// ============================================
// SUPPLIER BILL BALANCES
// ============================================

export function getSupplierBillBalances(
    supplierId,
    endDate = ""
) {

    const transactions =
        getTransactions();


    const bills =
        getSupplierBills(
            supplierId,
            endDate
        );


    return bills.map(
        bill => {

            const allocated =
                getBillAllocatedAmount(
                    transactions,
                    bill.id,
                    endDate
                );


            const outstanding =
                Math.max(
                    0,
                    Number(
                        bill.amount || 0
                    ) -
                    allocated
                );


            return {

                ...bill,

                paid:
                    allocated,

                outstanding

            };

        }
    );

}


// ============================================
// OPEN CUSTOMER INVOICES
// ============================================

export function getOpenCustomerInvoices(
    customerId,
    endDate = ""
) {

    return getCustomerInvoiceBalances(
        customerId,
        endDate
    ).filter(
        invoice =>
            invoice.outstanding > 0
    );

}


// ============================================
// OPEN SUPPLIER BILLS
// ============================================

export function getOpenSupplierBills(
    supplierId,
    endDate = ""
) {

    return getSupplierBillBalances(
        supplierId,
        endDate
    ).filter(
        bill =>
            bill.outstanding > 0
    );

}


// ============================================
// INVOICE ALLOCATED AMOUNT
// ============================================

export function getInvoiceAllocatedAmount(
    transactions,
    invoiceId,
    endDate = ""
) {

    return transactions.reduce(
        (
            total,
            transaction
        ) => {

            if (
                endDate &&
                transaction.date >
                endDate
            ) {

                return total;

            }


            if (
                !Array.isArray(
                    transaction.allocations
                )
            ) {

                return total;

            }


            const amount =
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


            return total + amount;

        },

        0
    );

}


// ============================================
// BILL ALLOCATED AMOUNT
// ============================================

export function getBillAllocatedAmount(
    transactions,
    billId,
    endDate = ""
) {

    return transactions.reduce(
        (
            total,
            transaction
        ) => {

            if (
                endDate &&
                transaction.date >
                endDate
            ) {

                return total;

            }


            if (
                !Array.isArray(
                    transaction.allocations
                )
            ) {

                return total;

            }


            const amount =
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


            return total + amount;

        },

        0
    );

}


// ============================================
// CUSTOMER TOTAL OUTSTANDING
// ============================================

export function getCustomerOutstanding(
    customerId,
    endDate = ""
) {

    return getCustomerInvoiceBalances(
        customerId,
        endDate
    ).reduce(
        (
            total,
            invoice
        ) =>
            total +
            invoice.outstanding,
        0
    );

}


// ============================================
// SUPPLIER TOTAL OUTSTANDING
// ============================================

export function getSupplierOutstanding(
    supplierId,
    endDate = ""
) {

    return getSupplierBillBalances(
        supplierId,
        endDate
    ).reduce(
        (
            total,
            bill
        ) =>
            total +
            bill.outstanding,
        0
    );

}


// ============================================
// VALIDATE CUSTOMER ALLOCATION
// ============================================

export function validateCustomerAllocation(
    invoice,
    amount
) {

    if (!invoice) {

        throw new Error(
            "Invoice not found."
        );

    }


    amount =
        Number(amount);


    if (
        !amount ||
        amount <= 0
    ) {

        throw new Error(
            "Allocation amount must be greater than zero."
        );

    }


    if (
        amount >
        invoice.outstanding
    ) {

        throw new Error(
            "Allocation cannot exceed invoice outstanding balance."
        );

    }


    return true;

}


// ============================================
// VALIDATE SUPPLIER ALLOCATION
// ============================================

export function validateSupplierAllocation(
    bill,
    amount
) {

    if (!bill) {

        throw new Error(
            "Bill not found."
        );

    }


    amount =
        Number(amount);


    if (
        !amount ||
        amount <= 0
    ) {

        throw new Error(
            "Allocation amount must be greater than zero."
        );

    }


    if (
        amount >
        bill.outstanding
    ) {

        throw new Error(
            "Allocation cannot exceed bill outstanding balance."
        );

    }


    return true;

}