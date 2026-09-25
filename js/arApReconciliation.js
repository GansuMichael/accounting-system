// js/arApReconciliation.js

import {
    getTransactions
} from "./storage.js";

import {
    getCustomerInvoiceBalances,
    getSupplierBillBalances
} from "./invoiceBalances.js";

import {
    getCustomerUnallocatedBalance,
    getSupplierPrepaymentBalance
} from "./unallocatedBalances.js";


// ============================================
// GENERAL LEDGER A/R
// ============================================

export function getGeneralLedgerReceivable(
    endDate = ""
) {

    const transactions =
        getTransactions();

    return transactions.reduce(
        (balance, transaction) => {

            if (
                endDate &&
                transaction.date > endDate
            ) {
                return balance;
            }

            if (
                !Array.isArray(
                    transaction.lines
                )
            ) {
                return balance;
            }

            transaction.lines.forEach(line => {

                if (
                    line.accountCode === "1030"
                ) {

                    balance +=
                        Number(line.debit || 0) -
                        Number(line.credit || 0);

                }

            });

            return balance;

        },
        0
    );
}


// ============================================
// GENERAL LEDGER A/P
// ============================================

export function getGeneralLedgerPayable(
    endDate = ""
) {

    const transactions =
        getTransactions();

    return transactions.reduce(
        (balance, transaction) => {

            if (
                endDate &&
                transaction.date > endDate
            ) {
                return balance;
            }

            if (
                !Array.isArray(
                    transaction.lines
                )
            ) {
                return balance;
            }

            transaction.lines.forEach(line => {

                if (
                    line.accountCode === "2010"
                ) {

                    balance +=
                        Number(line.credit || 0) -
                        Number(line.debit || 0);

                }

            });

            return balance;

        },
        0
    );
}


// ============================================
// CUSTOMER IDS
// ============================================

function getCustomerIds(
    endDate = ""
) {

    const transactions =
        getTransactions();

    return [
        ...new Set(
            transactions
                .filter(transaction => {

                    if (
                        endDate &&
                        transaction.date > endDate
                    ) {
                        return false;
                    }

                    return Boolean(
                        transaction.customerId
                    );

                })
                .map(
                    transaction =>
                        transaction.customerId
                )
        )
    ];

}


// ============================================
// SUPPLIER IDS
// ============================================

function getSupplierIds(
    endDate = ""
) {

    const transactions =
        getTransactions();

    return [
        ...new Set(
            transactions
                .filter(transaction => {

                    if (
                        endDate &&
                        transaction.date > endDate
                    ) {
                        return false;
                    }

                    return Boolean(
                        transaction.supplierId
                    );

                })
                .map(
                    transaction =>
                        transaction.supplierId
                )
        )
    ];

}


// ============================================
// CUSTOMER INVOICE SUBLEDGER
// ============================================

export function getCustomerSubledgerTotal(
    endDate = ""
) {

    return getCustomerIds(
        endDate
    ).reduce(
        (total, customerId) => {

            const invoices =
                getCustomerInvoiceBalances(
                    customerId,
                    endDate
                );

            return total +
                invoices.reduce(
                    (sum, invoice) =>
                        sum +
                        Number(
                            invoice.outstanding || 0
                        ),
                    0
                );

        },
        0
    );

}


// ============================================
// CUSTOMER UNALLOCATED CREDITS
// ============================================

export function getCustomerUnallocatedTotal(
    endDate = ""
) {

    return getCustomerIds(
        endDate
    ).reduce(
        (total, customerId) => {

            return total +
                getCustomerUnallocatedBalance(
                    customerId,
                    endDate
                );

        },
        0
    );

}


// ============================================
// EXPECTED A/R CONTROL
// ============================================

export function getExpectedReceivable(
    endDate = ""
) {

    const invoices =
        getCustomerSubledgerTotal(
            endDate
        );

    const unallocated =
        getCustomerUnallocatedTotal(
            endDate
        );

    return {
        invoices,
        unallocated,
        expected:
            invoices - unallocated
    };

}


// ============================================
// SUPPLIER BILL SUBLEDGER
// ============================================

export function getSupplierSubledgerTotal(
    endDate = ""
) {

    return getSupplierIds(
        endDate
    ).reduce(
        (total, supplierId) => {

            const bills =
                getSupplierBillBalances(
                    supplierId,
                    endDate
                );

            return total +
                bills.reduce(
                    (sum, bill) =>
                        sum +
                        Number(
                            bill.outstanding || 0
                        ),
                    0
                );

        },
        0
    );

}


// ============================================
// SUPPLIER PREPAYMENTS
// ============================================

export function getSupplierPrepaymentTotal(
    endDate = ""
) {

    return getSupplierIds(
        endDate
    ).reduce(
        (total, supplierId) => {

            return total +
                getSupplierPrepaymentBalance(
                    supplierId,
                    endDate
                );

        },
        0
    );

}


// ============================================
// EXPECTED A/P CONTROL
// ============================================

export function getExpectedPayable(
    endDate = ""
) {

    const bills =
        getSupplierSubledgerTotal(
            endDate
        );

    const prepayments =
        getSupplierPrepaymentTotal(
            endDate
        );

    return {
        bills,
        prepayments,
        expected:
            bills - prepayments
    };

}


// ============================================
// RECEIVABLE RECONCILIATION
// ============================================

export function reconcileReceivables(
    endDate = ""
) {

    const generalLedger =
        getGeneralLedgerReceivable(
            endDate
        );

    const details =
        getExpectedReceivable(
            endDate
        );

    const difference =
        generalLedger -
        details.expected;

    return {

        accountCode: "1030",

        accountName:
            "Accounts Receivable",

        generalLedger,

        invoices:
            details.invoices,

        unallocatedCredits:
            details.unallocated,

        expected:
            details.expected,

        difference,

        reconciled:
            Math.abs(
                difference
            ) < 0.01

    };

}


// ============================================
// PAYABLE RECONCILIATION
// ============================================

export function reconcilePayables(
    endDate = ""
) {

    const generalLedger =
        getGeneralLedgerPayable(
            endDate
        );

    const details =
        getExpectedPayable(
            endDate
        );

    const difference =
        generalLedger -
        details.expected;

    return {

        accountCode: "2010",

        accountName:
            "Accounts Payable",

        generalLedger,

        bills:
            details.bills,

        prepayments:
            details.prepayments,

        expected:
            details.expected,

        difference,

        reconciled:
            Math.abs(
                difference
            ) < 0.01

    };

}


// ============================================
// FULL RECONCILIATION
// ============================================

export function getArApReconciliation(
    endDate = ""
) {

    return {

        receivables:
            reconcileReceivables(
                endDate
            ),

        payables:
            reconcilePayables(
                endDate
            )

    };

}


// ============================================
// A/R EXCEPTION DETAILS
// ============================================

export function getReceivableExceptions(
    endDate = ""
) {

    const transactions =
        getTransactions();

    const exceptions = [];

    const customerIds =
        getCustomerIds(
            endDate
        );

    customerIds.forEach(
        customerId => {

            const invoices =
                getCustomerInvoiceBalances(
                    customerId,
                    endDate
                );

            invoices.forEach(
                invoice => {

                    if (
                        invoice.outstanding > 0
                    ) {

                        exceptions.push({

                            type:
                                "outstanding_invoice",

                            customerId:
                                invoice.customerId,

                            customerName:
                                invoice.customerName,

                            documentId:
                                invoice.id,

                            documentNumber:
                                invoice.invoiceNumber,

                            date:
                                invoice.date,

                            dueDate:
                                invoice.dueDate,

                            amount:
                                invoice.amount,

                            paid:
                                invoice.paid,

                            outstanding:
                                invoice.outstanding

                        });

                    }

                }
            );


            const customerPayments =
                transactions.filter(
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
                            transaction.unallocatedAmount ||
                            0
                        ) > 0;

                    }
                );


            customerPayments.forEach(
                payment => {

                    exceptions.push({

                        type:
                            "unallocated_customer_credit",

                        customerId:
                            payment.customerId,

                        customerName:
                            payment.customerName,

                        documentId:
                            payment.id,

                        documentNumber:
                            payment.reference,

                        date:
                            payment.date,

                        dueDate: "",

                        amount:
                            payment.amount,

                        paid:
                            payment.amount -
                            payment.unallocatedAmount,

                        outstanding:
                            payment.unallocatedAmount

                    });

                }
            );

        }
    );


    return exceptions;

}


// ============================================
// A/P EXCEPTION DETAILS
// ============================================

export function getPayableExceptions(
    endDate = ""
) {

    const transactions =
        getTransactions();

    const exceptions = [];

    const supplierIds =
        getSupplierIds(
            endDate
        );

    supplierIds.forEach(
        supplierId => {

            const bills =
                getSupplierBillBalances(
                    supplierId,
                    endDate
                );

            bills.forEach(
                bill => {

                    if (
                        bill.outstanding > 0
                    ) {

                        exceptions.push({

                            type:
                                "outstanding_bill",

                            supplierId:
                                bill.supplierId,

                            supplierName:
                                bill.supplierName,

                            documentId:
                                bill.id,

                            documentNumber:
                                bill.billNumber,

                            date:
                                bill.date,

                            dueDate:
                                bill.dueDate,

                            amount:
                                bill.amount,

                            paid:
                                bill.paid,

                            outstanding:
                                bill.outstanding

                        });

                    }

                }
            );


            const supplierPayments =
                transactions.filter(
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
                            transaction.unallocatedAmount ||
                            0
                        ) > 0;

                    }
                );


            supplierPayments.forEach(
                payment => {

                    exceptions.push({

                        type:
                            "supplier_prepayment",

                        supplierId:
                            payment.supplierId,

                        supplierName:
                            payment.supplierName,

                        documentId:
                            payment.id,

                        documentNumber:
                            payment.reference,

                        date:
                            payment.date,

                        dueDate: "",

                        amount:
                            payment.amount,

                        paid:
                            payment.amount -
                            payment.unallocatedAmount,

                        outstanding:
                            payment.unallocatedAmount

                    });

                }
            );

        }
    );


    return exceptions;

}