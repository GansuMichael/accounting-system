// js/openingBalances.js

import {
    getOpeningBalances
} from "./yearEndClosing.js";


// ============================================
// GET NEXT YEAR
// ============================================

function getNextYear(
    endDate
) {

    const year =
        Number(
            endDate.slice(0, 4)
        );

    return String(
        year + 1
    );

}


// ============================================
// CREATE OPENING BALANCES
// ============================================

export function createOpeningBalances(
    endDate
) {

    const balances =
        getOpeningBalances(
            endDate
        );


    const nextYear =
        getNextYear(
            endDate
        );


    return balances.map(
        balance => ({

            accountCode:
                balance.accountCode,

            accountName:
                balance.accountName,

            type:
                balance.type,

            openingBalance:
                balance.balance,

            financialYear:
                nextYear,

            sourceDate:
                endDate

        })
    );

}