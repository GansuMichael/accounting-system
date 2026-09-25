// js/ledger.js

import { getTransactions } from "./storage.js";

import {
    filterTransactionsByDate
} from "./filters.js";


// ------------------------------------
// GET ALL LEDGER ENTRIES
// ------------------------------------

export function getLedgerEntries({
    startDate = "",
    endDate = ""
} = {}) {

    const allTransactions =
        getTransactions();

    const transactions =
        filterTransactionsByDate(
            allTransactions,
            startDate,
            endDate
        );

    const ledger = {};


    transactions.forEach(transaction => {

        transaction.lines.forEach(line => {

            const accountCode =
                line.accountCode;


            if (!ledger[accountCode]) {

                ledger[accountCode] = {

                    accountCode,

                    accountName:
                        line.accountName,

                    entries: []

                };

            }


            ledger[accountCode].entries.push({

                date:
                    transaction.date,

                reference:
                    transaction.reference,

                description:
                    transaction.description,

                debit:
                    Number(line.debit || 0),

                credit:
                    Number(line.credit || 0)

            });

        });

    });


    return ledger;
}


// ------------------------------------
// GET ONE ACCOUNT LEDGER
// ------------------------------------

export function getAccountLedger(
    accountCode,
    {
        startDate = "",
        endDate = ""
    } = {}
) {

    const ledger =
        getLedgerEntries({
            startDate,
            endDate
        });


    return ledger[accountCode] || {

        accountCode,

        accountName: "",

        entries: []

    };

}


// ------------------------------------
// CALCULATE ACCOUNT BALANCE
// ------------------------------------

export function calculateAccountBalance(
    accountCode,
    {
        startDate = "",
        endDate = ""
    } = {}
) {

    const account =
        getAccountLedger(
            accountCode,
            {
                startDate,
                endDate
            }
        );


    let balance = 0;


    account.entries.forEach(entry => {

        balance +=
            entry.debit -
            entry.credit;

    });


    return balance;
}