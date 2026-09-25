// js/depreciation.js

import { getTransactions } from "./storage.js";


// ------------------------------------
// STRAIGHT-LINE DEPRECIATION
// ------------------------------------

export function calculateStraightLineDepreciation({
    cost,
    residualValue = 0,
    usefulLifeYears
}) {

    if (cost <= 0) {
        throw new Error(
            "Asset cost must be greater than zero."
        );
    }

    if (usefulLifeYears <= 0) {
        throw new Error(
            "Useful life must be greater than zero."
        );
    }

    if (residualValue < 0) {
        throw new Error(
            "Residual value cannot be negative."
        );
    }

    if (residualValue > cost) {
        throw new Error(
            "Residual value cannot exceed asset cost."
        );
    }


    const depreciableAmount =
        cost - residualValue;


    const annualDepreciation =
        depreciableAmount /
        usefulLifeYears;


    const monthlyDepreciation =
        annualDepreciation / 12;


    return {

        cost,

        residualValue,

        usefulLifeYears,

        depreciableAmount,

        annualDepreciation,

        monthlyDepreciation

    };

}


// ------------------------------------
// CALCULATE ACCUMULATED DEPRECIATION
// ------------------------------------

export function calculateAccumulatedDepreciation({
    cost,
    residualValue = 0,
    usefulLifeYears,
    monthsUsed
}) {

    const depreciation =
        calculateStraightLineDepreciation({

            cost,

            residualValue,

            usefulLifeYears

        });


    const maximumDepreciation =
        depreciation.depreciableAmount;


    const calculatedDepreciation =
        depreciation.monthlyDepreciation *
        monthsUsed;


    const accumulatedDepreciation =
        Math.min(
            calculatedDepreciation,
            maximumDepreciation
        );


    const carryingValue =
        cost -
        accumulatedDepreciation;


    return {

        ...depreciation,

        monthsUsed,

        accumulatedDepreciation,

        carryingValue

    };

}


// ------------------------------------
// GET DEPRECIABLE ASSETS
// ------------------------------------

export function getDepreciableAssets() {

    const transactions =
        getTransactions();


    const assets = [];


    transactions.forEach(transaction => {

        transaction.lines.forEach(line => {

            const assetAccounts = [
                "1500",
                "1510",
                "1520"
            ];


            if (
                !assetAccounts.includes(
                    line.accountCode
                )
            ) {
                return;
            }


            const cost =
                Number(line.debit || 0);


            if (cost <= 0) {
                return;
            }


            assets.push({

                transactionId:
                    transaction.id,

                date:
                    transaction.date,

                reference:
                    transaction.reference,

                description:
                    transaction.description,

                accountCode:
                    line.accountCode,

                assetName:
                    line.accountName,

                cost

            });

        });

    });


    return assets;

}