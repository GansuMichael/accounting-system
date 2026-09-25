// js/filters.js

// ------------------------------------
// FILTER TRANSACTIONS BY DATE RANGE
// ------------------------------------

export function filterTransactionsByDate(
    transactions,
    startDate = "",
    endDate = ""
) {

    return transactions.filter(transaction => {

        const transactionDate = transaction.date;

        // Start date
        if (
            startDate &&
            transactionDate < startDate
        ) {
            return false;
        }

        // End date
        if (
            endDate &&
            transactionDate > endDate
        ) {
            return false;
        }

        return true;
    });
}


// ------------------------------------
// GET TRANSACTIONS UP TO A DATE
// ------------------------------------

export function transactionsUpToDate(
    transactions,
    endDate = ""
) {

    if (!endDate) {
        return transactions;
    }

    return transactions.filter(
        transaction =>
            transaction.date <= endDate
    );
}