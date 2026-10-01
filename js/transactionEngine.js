// js/transactionEngine.js
import { getAccountByCode } from "./accounts.js";

import { createJournalEntry } from "./journal.js";

import {
    ensurePeriodOpen
} from "./accountingPeriods.js";

import {
    validateTransactionDate
} from "./periodControl.js";


// ------------------------------------
// REVENUE
// ------------------------------------
// ------------------------------------
// GENERIC JOURNAL TRANSACTION
// ------------------------------------

// ------------------------------------
// GENERIC JOURNAL TRANSACTION
// ------------------------------------

export function createJournalTransaction({
    date,
    description,
    amount,
    debitAccount,
    creditAccount,
    reference = "",
    metadata = {},
    type = "journal",
    additionalLines = []
}) {

    validateTransactionDate(date);

    if (!date) {
        throw new Error(
            "Transaction date is required."
        );
    }

    if (!description) {
        throw new Error(
            "Transaction description is required."
        );
    }

    const transactionAmount =
        Number(amount);

    if (
        !Number.isFinite(transactionAmount) ||
        transactionAmount <= 0
    ) {
        throw new Error(
            "Transaction amount must be greater than zero."
        );
    }

    if (!debitAccount) {
        throw new Error(
            "Debit account is required."
        );
    }

    if (!creditAccount) {
        throw new Error(
            "Credit account is required."
        );
    }

    if (debitAccount === creditAccount) {
        throw new Error(
            "Debit and credit accounts cannot be the same."
        );
    }

    const debit =
        getAccountByCode(debitAccount);

    const credit =
        getAccountByCode(creditAccount);

    if (!debit) {
        throw new Error(
            `Debit account ${debitAccount} does not exist.`
        );
    }

    if (!credit) {
        throw new Error(
            `Credit account ${creditAccount} does not exist.`
        );
    }

    // ------------------------------------
    // VALIDATE ADDITIONAL LINES
    // ------------------------------------

    if (!Array.isArray(additionalLines)) {
        throw new Error(
            "Additional journal lines must be an array."
        );
    }

    const extraLines =
        additionalLines.map(line => {

            if (!line.accountCode) {
                throw new Error(
                    "Every additional journal line requires an account code."
                );
            }

            const account =
                getAccountByCode(
                    line.accountCode
                );

            if (!account) {
                throw new Error(
                    `Account ${line.accountCode} does not exist.`
                );
            }

            const lineDebit =
                Number(line.debit || 0);

            const lineCredit =
                Number(line.credit || 0);

            if (
                lineDebit < 0 ||
                lineCredit < 0
            ) {
                throw new Error(
                    "Journal amounts cannot be negative."
                );
            }

            if (
                lineDebit > 0 &&
                lineCredit > 0
            ) {
                throw new Error(
                    "A journal line cannot contain both debit and credit."
                );
            }

            if (
                lineDebit === 0 &&
                lineCredit === 0
            ) {
                throw new Error(
                    `Journal line for ${account.code} must have a debit or credit amount.`
                );
            }

            return {
                accountCode:
                    account.code,

                accountName:
                    account.name,

                debit:
                    lineDebit,

                credit:
                    lineCredit
            };
        });


    // ------------------------------------
    // BUILD JOURNAL LINES
    // ------------------------------------

    const lines = [

        {
            accountCode:
                debit.code,

            accountName:
                debit.name,

            debit:
                transactionAmount,

            credit: 0
        },

        {
            accountCode:
                credit.code,

            accountName:
                credit.name,

            debit: 0,

            credit:
                transactionAmount
        },

        ...extraLines

    ];


    // ------------------------------------
    // VERIFY JOURNAL BALANCES
    // ------------------------------------

    const totalDebit =
        lines.reduce(
            (total, line) =>
                total + Number(line.debit || 0),
            0
        );

    const totalCredit =
        lines.reduce(
            (total, line) =>
                total + Number(line.credit || 0),
            0
        );

    if (
        Math.abs(totalDebit - totalCredit) >
        0.000001
    ) {
        throw new Error(
            `Journal is not balanced. Debit: ${totalDebit}, Credit: ${totalCredit}.`
        );
    }


    // ------------------------------------
    // ACCOUNTING PERIOD
    // ------------------------------------

    ensurePeriodOpen(date);


    // ------------------------------------
    // CREATE JOURNAL ENTRY
    // ------------------------------------

    const journalEntry =
        createJournalEntry({

            date,

            description,

            reference:
                reference ||
                `JRN-${Date.now()}`,

            lines

        });


    // ------------------------------------
    // RETURN TRANSACTION
    // ------------------------------------

    return {

        ...journalEntry,

        type,

        amount:
            transactionAmount,

        debitAccount:
            debit.code,

        debitAccountName:
            debit.name,

        creditAccount:
            credit.code,

        creditAccountName:
            credit.name,

        reference:
            reference ||
            journalEntry.reference,

        metadata,

        additionalLines:
            extraLines

    };
}
// ------------------------------------
// REVENUE
// ------------------------------------

export function createRevenueTransaction({

    date,

    description,

    amount,

    receivedAccount = "1010",

    revenueAccount = "4010"

}) {
    validateTransactionDate(date);

    const receivingName =
        getAccountName(
            receivedAccount
        );


    const revenueName =
        getAccountName(
            revenueAccount
        );


    if (!receivingName) {

        throw new Error(
            "Invalid receiving account."
        );

    }


    if (!revenueName) {

        throw new Error(
            "Invalid revenue account."
        );

    }

    if (!date) {
        throw new Error(
            "Transaction date is required."
        );
    }

    ensurePeriodOpen(date);


    const journalEntry =
        createJournalEntry({

            date,

            description,

            reference:
                `REV-${Date.now()}`,

            lines: [

                {
                    accountCode:
                        receivedAccount,

                    accountName:
                        receivingName,

                    debit:
                        amount,

                    credit:
                        0
                },

                {
                    accountCode:
                        revenueAccount,

                    accountName:
                        revenueName,

                    debit:
                        0,

                    credit:
                        amount
                }

            ]

        });


    return {

        ...journalEntry,

        type:
            "revenue",

        amount,

        account:
            receivedAccount,

        revenueAccount

    };

}
// ------------------------------------
// EXPENSE
// ------------------------------------

export function createExpenseTransaction({

    date,

    description,

    amount,

    expenseAccount = "5070",

    paidFrom = "1010"

}) {
    validateTransactionDate(date);

    const expenseName =
        getAccountName(
            expenseAccount
        );


    const paymentName =
        getAccountName(
            paidFrom
        );


    if (!expenseName) {

        throw new Error(
            "Invalid expense account."
        );

    }


    if (!paymentName) {

        throw new Error(
            "Invalid payment account."
        );

    }

    if (!date) {
        throw new Error(
            "Transaction date is required."
        );
    }

    ensurePeriodOpen(date);


    const journalEntry =
        createJournalEntry({

            date,

            description,

            reference:
                `EXP-${Date.now()}`,

            lines: [

                {
                    accountCode:
                        expenseAccount,

                    accountName:
                        expenseName,

                    debit:
                        amount,

                    credit:
                        0
                },

                {
                    accountCode:
                        paidFrom,

                    accountName:
                        paymentName,

                    debit:
                        0,

                    credit:
                        amount
                }

            ]

        });


    return {

        ...journalEntry,

        type:
            "expense",

        amount,

        account:
            paidFrom,

        expenseAccount

    };

}

// ------------------------------------
// ASSET PURCHASE
// ------------------------------------

// ASSET PURCHASE

export function createAssetTransaction({
    date,
    description,
    amount,
    assetAccount,
    paidFrom = "1010"
}) {
    validateTransactionDate(date);

    const assetName =
        getAssetName(assetAccount);


    const paymentName =
        getAccountName(
            paidFrom
        );


    if (!assetName) {

        throw new Error(
            "Invalid fixed asset account."
        );

    }


    if (!paymentName) {

        throw new Error(
            "Invalid payment account."
        );

    }

    if (!date) {
        throw new Error(
            "Transaction date is required."
        );
    }

    ensurePeriodOpen(date);


    const journalEntry =
        createJournalEntry({

            date,

            description,

            reference:
                `AST-${Date.now()}`,

            lines: [

                {
                    accountCode:
                        assetAccount,

                    accountName:
                        assetName,

                    debit:
                        amount,

                    credit:
                        0
                },

                {
                    accountCode:
                        paidFrom,

                    accountName:
                        paymentName,

                    debit:
                        0,

                    credit:
                        amount
                }

            ]

        });


    return {

        ...journalEntry,

        type:
            "asset",

        amount,

        assetAccount,

        account:
            paidFrom

    };

}

export function createOwnerDrawingTransaction({
    date,
    description,
    amount,
    paidFrom = "1010"
}) {
    validateTransactionDate(date);
    
    amount = Number(amount);

    if (!date) {
        throw new Error("Drawing date is required.");
    }

    if (!amount || amount <= 0) {
        throw new Error(
            "Drawing amount must be greater than zero."
        );
    }

    const paymentAccountName =
        getAccountName(paidFrom);

    if (!paymentAccountName) {
        throw new Error(
            "Invalid payment account."
        );
    }

    const journalEntry = createJournalEntry({

        date,

        description:
            description ||
            "Owner withdrawal",

        reference:
            `DRAW-${Date.now()}`,

        lines: [

            {
                accountCode: "3030",
                accountName: "Owner's Drawings",
                debit: amount,
                credit: 0
            },

            {
                accountCode: paidFrom,
                accountName: paymentAccountName,
                debit: 0,
                credit: amount
            }

        ]

    });

    return {

        ...journalEntry,

        type: "owner_drawing",

        amount,

        account: paidFrom

    };

}


// ------------------------------------
// ASSET ACCOUNT NAME
// ------------------------------------

function getAssetName(code) {

    const names = {

        "1500":
            "Machinery",

        "1510":
            "Vehicles",

        "1520":
            "Buildings"

    };


    return names[code] || null;

}

// ------------------------------------
// ACCOUNT NAME
// ------------------------------------

//function getAccountName(code) {

   // const names = {

   //     "1010":
    //        "Cash",

 //       "1020":
  //          "Bank",

  //      "1030":
  //          "Accounts Receivable",

  //      "1040":
  //          "Inventory",

   //     "1500":
 //           "Machinery",

  //      "1510":
  //          "Vehicles",

 //       "1520":
  //          "Buildings",

  //      "2010":
   //         "Accounts Payable",

  //      "2020":
  //          "Loans Payable",

  //      "2030":
 //           "Deferred Revenue",

 //       "3000":
 //           "Owner's Capital",

 //       "3020":
 //           "Retained Earnings",

 //       "4010":
 //           "Sales Revenue",

 //       "4020":
 //           "Service Revenue",

  //      "5010":
  //          "Feed Expense",

 //       "5020":
 //           "Salary Expense",

 //       "5030":
 //           "Rent Expense",

 //       "5040":
  //          "Utilities Expense",

  //      "5050":
 //           "Depreciation Expense",

  //      "5060":
   //         "Transport Expense",

   //     "5070":
  //          "Other Expenses"

 //   };


//    return names[code] || null;

//}

function getAccountName(code) {

    const account = getAccountByCode(code);

    return account
        ? account.name
        : null;
}