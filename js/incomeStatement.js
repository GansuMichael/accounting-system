// js/incomeStatement.js

import {
    getTransactions
} from "./storage.js";

import {
    getAccountByCode
} from "./accounts.js";


// ============================================
// GET FINANCIAL YEAR
// ============================================

export function getFinancialYear(
    date
) {

    if (!date) {

        throw new Error(
            "Date is required."
        );

    }

    return date.slice(0, 4);

}


// ============================================
// GET YEAR START
// ============================================

export function getFinancialYearStart(
    endDate
) {

    if (!endDate) {

        throw new Error(
            "End date is required."
        );

    }

    return `${endDate.slice(0, 4)}-01-01`;

}


// ============================================
// GET INCOME STATEMENT
// ============================================

export function getIncomeStatement({

    startDate = "",

    endDate = ""

} = {}) {

    const transactions =
        getTransactions()
            .filter(
                transaction => {

                    if (
                        startDate &&
                        transaction.date <
                        startDate
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

                    return true;

                }
            );


    const revenue = {};

    const expenses = {};


    transactions.forEach(
        transaction => {

            // Do not count year-end closing
            // entries as new revenue/expense.

            if (
                transaction.type ===
                "year_end_closing"
            ) {

                return;

            }


            transaction.lines
                .forEach(
                    line => {

                        const account =
                            getAccountByCode(
                                line.accountCode
                            );


                        if (!account) {
                            return;
                        }


                        if (
                            account.type ===
                            "revenue"
                        ) {

                            const amount =
                                Number(
                                    line.credit || 0
                                ) -
                                Number(
                                    line.debit || 0
                                );


                            if (
                                amount !== 0
                            ) {

                                revenue[
                                    line.accountCode
                                ] =
                                    (
                                        revenue[
                                            line.accountCode
                                        ] || 0
                                    ) +
                                    amount;

                            }

                        }


                        if (
                            account.type ===
                            "expense"
                        ) {

                            const amount =
                                Number(
                                    line.debit || 0
                                ) -
                                Number(
                                    line.credit || 0
                                );


                            if (
                                amount !== 0
                            ) {

                                expenses[
                                    line.accountCode
                                ] =
                                    (
                                        expenses[
                                            line.accountCode
                                        ] || 0
                                    ) +
                                    amount;

                            }

                        }

                    }
                );

        }
    );


    const totalRevenue =
        Object.values(
            revenue
        ).reduce(
            (
                total,
                amount
            ) =>
                total + amount,
            0
        );


    const totalExpenses =
        Object.values(
            expenses
        ).reduce(
            (
                total,
                amount
            ) =>
                total + amount,
            0
        );


    return {

        startDate,

        endDate,

        revenue,

        expenses,

        totalRevenue,

        totalExpenses,

        netProfit:
            totalRevenue -
            totalExpenses

    };

}


// ============================================
// CURRENT FINANCIAL YEAR
// ============================================

export function getCurrentYearIncomeStatement(
    endDate
) {

    return getIncomeStatement({

        startDate:
            getFinancialYearStart(
                endDate
            ),

        endDate

    });

}