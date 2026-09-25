// js/receivablesPayables.js

import { getTransactions } from "./storage.js";
import { filterTransactionsByDate } from "./filters.js";


// ------------------------------------
// ACCOUNTS RECEIVABLE
// ------------------------------------

export function getAccountsReceivable({
    startDate = "",
    endDate = ""
} = {}) {

    const transactions =
        getTransactions();


    const filteredTransactions =
        filterTransactionsByDate(
            transactions,
            startDate,
            endDate
        );


    let totalDebit = 0;
    let totalCredit = 0;


    filteredTransactions.forEach(
        transaction => {

            transaction.lines.forEach(
                line => {

                    if (
                        line.accountCode !==
                        "1030"
                    ) {
                        return;
                    }


                    totalDebit +=
                        Number(
                            line.debit || 0
                        );


                    totalCredit +=
                        Number(
                            line.credit || 0
                        );

                }
            );

        }
    );


    return {

        accountCode:
            "1030",

        accountName:
            "Accounts Receivable",

        totalDebit,

        totalCredit,

        balance:
            totalDebit -
            totalCredit

    };

}


// ------------------------------------
// ACCOUNTS PAYABLE
// ------------------------------------

export function getAccountsPayable({
    startDate = "",
    endDate = ""
} = {}) {

    const transactions =
        getTransactions();


    const filteredTransactions =
        filterTransactionsByDate(
            transactions,
            startDate,
            endDate
        );


    let totalDebit = 0;
    let totalCredit = 0;


    filteredTransactions.forEach(
        transaction => {

            transaction.lines.forEach(
                line => {

                    if (
                        line.accountCode !==
                        "2010"
                    ) {
                        return;
                    }


                    totalDebit +=
                        Number(
                            line.debit || 0
                        );


                    totalCredit +=
                        Number(
                            line.credit || 0
                        );

                }
            );

        }
    );


    return {

        accountCode:
            "2010",

        accountName:
            "Accounts Payable",

        totalDebit,

        totalCredit,

        balance:
            totalCredit -
            totalDebit

    };

}


// ------------------------------------
// RECEIVABLE MOVEMENTS
// ------------------------------------

export function getReceivableMovements({
    startDate = "",
    endDate = ""
} = {}) {

    const transactions =
        filterTransactionsByDate(
            getTransactions(),
            startDate,
            endDate
        );


    const movements = [];


    transactions.forEach(
        transaction => {

            transaction.lines.forEach(
                line => {

                    if (
                        line.accountCode !==
                        "1030"
                    ) {
                        return;
                    }


                    movements.push({

                        date:
                            transaction.date,

                        reference:
                            transaction.reference,

                        description:
                            transaction.description,

                        debit:
                            Number(
                                line.debit || 0
                            ),

                        credit:
                            Number(
                                line.credit || 0
                            ),

                        balanceChange:
                            Number(
                                line.debit || 0
                            ) -
                            Number(
                                line.credit || 0
                            )

                    });

                }
            );

        }
    );


    return movements;

}


// ------------------------------------
// PAYABLE MOVEMENTS
// ------------------------------------

export function getPayableMovements({
    startDate = "",
    endDate = ""
} = {}) {

    const transactions =
        filterTransactionsByDate(
            getTransactions(),
            startDate,
            endDate
        );


    const movements = [];


    transactions.forEach(
        transaction => {

            transaction.lines.forEach(
                line => {

                    if (
                        line.accountCode !==
                        "2010"
                    ) {
                        return;
                    }


                    movements.push({

                        date:
                            transaction.date,

                        reference:
                            transaction.reference,

                        description:
                            transaction.description,

                        debit:
                            Number(
                                line.debit || 0
                            ),

                        credit:
                            Number(
                                line.credit || 0
                            ),

                        balanceChange:
                            Number(
                                line.credit || 0
                            ) -
                            Number(
                                line.debit || 0
                            )

                    });

                }
            );

        }
    );


    return movements;

}