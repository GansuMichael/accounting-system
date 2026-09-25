// js/arApAging.js
import {
    getTransactions
} from "./storage.js";

import {
    getCustomerInvoiceBalances,
    getSupplierBillBalances
} from "./invoiceBalances.js";


// ============================================
// DATE DIFFERENCE
// ============================================

function daysBetween(
    earlierDate,
    laterDate
) {

    const earlier =
        new Date(
            `${earlierDate}T00:00:00`
        );

    const later =
        new Date(
            `${laterDate}T00:00:00`
        );


    const milliseconds =
        later.getTime() -
        earlier.getTime();


    return Math.floor(
        milliseconds /
        (1000 * 60 * 60 * 24)
    );

}


// ============================================
// GET TODAY / REPORT DATE
// ============================================

function getReportDate(
    endDate = ""
) {

    if (endDate) {

        return endDate;

    }


    return new Date()
        .toISOString()
        .slice(0, 10);

}


// ============================================
// CREATE EMPTY BUCKETS
// ============================================

function createBuckets() {

    return {

        current: 0,

        days1to30: 0,

        days31to60: 0,

        days61to90: 0,

        days91to120: 0,

        days120Plus: 0,

        total: 0

    };

}


// ============================================
// PUT AMOUNT INTO AGING BUCKET
// ============================================

function addToBucket(
    buckets,
    days,
    amount
) {

    if (
        amount <= 0
    ) {

        return;

    }


    if (
        days <= 0
    ) {

        buckets.current += amount;

    }
    else if (
        days <= 30
    ) {

        buckets.days1to30 += amount;

    }
    else if (
        days <= 60
    ) {

        buckets.days31to60 += amount;

    }
    else if (
        days <= 90
    ) {

        buckets.days61to90 += amount;

    }
    else if (
        days <= 120
    ) {

        buckets.days91to120 += amount;

    }
    else {

        buckets.days120Plus += amount;

    }


    buckets.total += amount;

}


// ============================================
// CUSTOMER RECEIVABLE AGING
// ============================================

export function getReceivableAging(
    customerId,
    endDate = ""
) {

    const reportDate =
        getReportDate(
            endDate
        );


    const invoices =
        getCustomerInvoiceBalances(
            customerId,
            endDate
        );


    const buckets =
        createBuckets();


    const details = [];


    invoices.forEach(
        invoice => {

            if (
                invoice.outstanding <= 0
            ) {

                return;

            }


            const dueDate =
                invoice.dueDate ||
                invoice.date;


            const daysOutstanding =
                daysBetween(
                    dueDate,
                    reportDate
                );


            addToBucket(
                buckets,
                daysOutstanding,
                invoice.outstanding
            );


            details.push({

                invoiceId:
                    invoice.id,

                invoiceNumber:
                    invoice.invoiceNumber,

                customerId:
                    invoice.customerId,

                customerName:
                    invoice.customerName,

                invoiceDate:
                    invoice.date,

                dueDate,

                amount:
                    invoice.amount,

                paid:
                    invoice.paid,

                outstanding:
                    invoice.outstanding,

                daysOutstanding

            });

        }
    );


    return {

        ...buckets,

        details

    };

}


// ============================================
// SUPPLIER PAYABLE AGING
// ============================================

export function getPayableAging(
    supplierId,
    endDate = ""
) {

    const reportDate =
        getReportDate(
            endDate
        );


    const bills =
        getSupplierBillBalances(
            supplierId,
            endDate
        );


    const buckets =
        createBuckets();


    const details = [];


    bills.forEach(
        bill => {

            if (
                bill.outstanding <= 0
            ) {

                return;

            }


            const dueDate =
                bill.dueDate ||
                bill.date;


            const daysOutstanding =
                daysBetween(
                    dueDate,
                    reportDate
                );


            addToBucket(
                buckets,
                daysOutstanding,
                bill.outstanding
            );


            details.push({

                billId:
                    bill.id,

                billNumber:
                    bill.billNumber,

                supplierId:
                    bill.supplierId,

                supplierName:
                    bill.supplierName,

                billDate:
                    bill.date,

                dueDate,

                amount:
                    bill.amount,

                paid:
                    bill.paid,

                outstanding:
                    bill.outstanding,

                daysOutstanding

            });

        }
    );


    return {

        ...buckets,

        details

    };

}


// ============================================
// ALL CUSTOMERS
// ============================================

export function getAllReceivablesAging(
    endDate = ""
) {

    return getCustomerInvoiceBalances(
        "",
        endDate
    );

}


// ============================================
// ALL SUPPLIERS
// ============================================

export function getAllPayablesAging(
    endDate = ""
) {

    return getSupplierBillBalances(
        "",
        endDate
    );

}

// ============================================
// COMPANY-WIDE RECEIVABLE AGING
// ============================================

export function getCompanyReceivablesAging(
    endDate = ""
) {

    const invoices =
        getAllCustomerInvoiceBalances(
            endDate
        );


    const customers = {};


    invoices.forEach(
        invoice => {

            if (
                invoice.outstanding <= 0
            ) {

                return;

            }


            const customerId =
                invoice.customerId;


            if (
                !customers[customerId]
            ) {

                customers[customerId] = {

                    customerId,

                    customerName:
                        invoice.customerName,

                    current: 0,

                    days1to30: 0,

                    days31to60: 0,

                    days61to90: 0,

                    days91to120: 0,

                    days120Plus: 0,

                    total: 0

                };

            }


            const dueDate =
                invoice.dueDate ||
                invoice.date;


            const reportDate =
                endDate ||
                new Date()
                    .toISOString()
                    .slice(0, 10);


            const days =
                daysBetween(
                    dueDate,
                    reportDate
                );


            addToBucket(
                customers[customerId],
                days,
                invoice.outstanding
            );

        }
    );


    return Object.values(
        customers
    );

}


// ============================================
// COMPANY-WIDE PAYABLE AGING
// ============================================

export function getCompanyPayablesAging(
    endDate = ""
) {

    const bills =
        getAllSupplierBillBalances(
            endDate
        );


    const suppliers = {};


    bills.forEach(
        bill => {

            if (
                bill.outstanding <= 0
            ) {

                return;

            }


            const supplierId =
                bill.supplierId;


            if (
                !suppliers[supplierId]
            ) {

                suppliers[supplierId] = {

                    supplierId,

                    supplierName:
                        bill.supplierName,

                    current: 0,

                    days1to30: 0,

                    days31to60: 0,

                    days61to90: 0,

                    days91to120: 0,

                    days120Plus: 0,

                    total: 0

                };

            }


            const dueDate =
                bill.dueDate ||
                bill.date;


            const reportDate =
                endDate ||
                new Date()
                    .toISOString()
                    .slice(0, 10);


            const days =
                daysBetween(
                    dueDate,
                    reportDate
                );


            addToBucket(
                suppliers[supplierId],
                days,
                bill.outstanding
            );

        }
    );


    return Object.values(
        suppliers
    );

}


// ============================================
// ALL CUSTOMER INVOICES
// ============================================

function getAllCustomerInvoiceBalances(
    endDate = ""
) {

    const transactions =
        getTransactions();


    const customerIds = [
        ...new Set(
            transactions
                .filter(
                    transaction =>
                        transaction.type ===
                        "revenue" &&
                        transaction.customerId
                )
                .map(
                    transaction =>
                        transaction.customerId
                )
        )
    ];


    const results = [];


    customerIds.forEach(
        customerId => {

            const invoices =
                getCustomerInvoiceBalances(
                    customerId,
                    endDate
                );


            results.push(
                ...invoices
            );

        }
    );


    return results;

}


// ============================================
// ALL SUPPLIER BILLS
// ============================================

function getAllSupplierBillBalances(
    endDate = ""
) {

    const transactions =
        getTransactions();


    const supplierIds = [
        ...new Set(
            transactions
                .filter(
                    transaction =>
                        transaction.type ===
                        "expense" &&
                        transaction.supplierId
                )
                .map(
                    transaction =>
                        transaction.supplierId
                )
        )
    ];


    const results = [];


    supplierIds.forEach(
        supplierId => {

            const bills =
                getSupplierBillBalances(
                    supplierId,
                    endDate
                );


            results.push(
                ...bills
            );

        }
    );


    return results;

}