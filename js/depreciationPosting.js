// js/depreciationPosting.js

import { createJournalEntry } from "./journal.js";
import {
    getTransactions,
    saveTransaction
} from "./storage.js";

import {
    validateTransactionDate
} from "./periodControl.js";


// ------------------------------------
// POST DEPRECIATION
// ------------------------------------

export function postDepreciation({
    date,
    description,
    amount,
    assetId = "",
    assetName = ""
}) {
    validateTransactionDate(
        date
    );
    
    if (!date) {
        throw new Error(
            "Depreciation date is required."
        );
    }


    if (!amount || amount <= 0) {
        throw new Error(
            "Depreciation amount must be greater than zero."
        );
    }


    // --------------------------------
    // PREVENT DUPLICATE POSTING
    // --------------------------------

    const transactions =
        getTransactions();


    const duplicate =
        transactions.find(transaction =>

            transaction.type ===
                "depreciation"

            && transaction.assetId ===
                assetId

            && transaction.date ===
                date

        );


    if (duplicate) {

        throw new Error(
            "Depreciation has already been posted for this asset on this date."
        );

    }


    // --------------------------------
    // CREATE JOURNAL ENTRY
    // --------------------------------

    const journalEntry =
        createJournalEntry({

            date,

            description:
                description ||
                `Depreciation - ${assetName}`,

            reference:
                `DEP-${Date.now()}`,

            lines: [

                // DEBIT
                {
                    accountCode:
                        "5050",

                    accountName:
                        "Depreciation Expense",

                    debit:
                        amount,

                    credit: 0
                },

                // CREDIT
                {
                    accountCode:
                        "1590",

                    accountName:
                        "Accumulated Depreciation",

                    debit: 0,

                    credit:
                        amount
                }

            ]

        });


    // --------------------------------
    // ADD DEPRECIATION INFORMATION
    // --------------------------------

    const transaction = {

        ...journalEntry,

        type:
            "depreciation",

        amount,

        assetId,

        assetName

    };


    // --------------------------------
    // SAVE TO JOURNAL
    // --------------------------------

    saveTransaction(
        transaction
    );


    return transaction;

}