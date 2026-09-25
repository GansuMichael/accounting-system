// js/trialBalance.js

import { getLedgerEntries } from "./ledger.js";
import { accounts } from "./accounts.js";


/**
 * Generate Trial Balance as of a particular date.
 */
export function generateTrialBalance({
    endDate = ""
} = {}) {

    if (!endDate) {
        throw new Error(
            "Trial Balance end date is required."
        );
    }


    const ledger =
        getLedgerEntries({
            endDate
        });


    const trialBalance = [];


    /*
     * Start with every account in the Chart
     * of Accounts so zero-balance accounts
     * can also appear.
     */
    accounts.forEach(account => {

        const ledgerAccount =
            ledger[account.code];


        let balance = 0;


        if (ledgerAccount) {

            balance =
                ledgerAccount.entries.reduce(
                    (total, entry) => {

                        return (
                            total +
                            Number(entry.debit || 0) -
                            Number(entry.credit || 0)
                        );

                    },
                    0
                );
        }


        let debit = 0;
        let credit = 0;


        if (balance > 0) {
            debit = balance;
        }


        if (balance < 0) {
            credit = Math.abs(balance);
        }


        trialBalance.push({

            accountCode:
                account.code,

            accountName:
                account.name,

            accountType:
                account.type,

            debit,

            credit,

            balance
        });
    });


    const totalDebit =
        trialBalance.reduce(
            (total, account) =>
                total + account.debit,
            0
        );


    const totalCredit =
        trialBalance.reduce(
            (total, account) =>
                total + account.credit,
            0
        );


    const difference =
        totalDebit -
        totalCredit;


    return {

        endDate,

        trialBalance,

        totalDebit,

        totalCredit,

        difference,

        balanced:
            Math.abs(difference) < 0.01
    };
}


/**
 * Get Trial Balance totals.
 */
export function getTrialBalanceTotals({
    endDate = ""
} = {}) {

    const result =
        generateTrialBalance({
            endDate
        });


    return {

        totalDebit:
            result.totalDebit,

        totalCredit:
            result.totalCredit,

        difference:
            result.difference,

        balanced:
            result.balanced
    };
}