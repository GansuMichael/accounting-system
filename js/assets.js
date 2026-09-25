// js/assets.js

import { getTransactions } from "./storage.js";


// ------------------------------------
// FIXED ASSET ACCOUNTS
// ------------------------------------

const ASSET_ACCOUNTS = [
    "1500", // Machinery
    "1510", // Vehicles
    "1520"  // Buildings
];


// ------------------------------------
// GET ASSET REGISTER
// ------------------------------------

export function getAssetRegister() {

    const transactions =
        getTransactions();


    const assets = [];


    // --------------------------------
    // FIND ASSET PURCHASES
    // --------------------------------

    transactions.forEach(
        transaction => {

            transaction.lines.forEach(
                line => {

                    if (
                        !ASSET_ACCOUNTS.includes(
                            line.accountCode
                        )
                    ) {
                        return;
                    }


                    const cost =
                        Number(
                            line.debit || 0
                        );


                    if (cost <= 0) {
                        return;
                    }


                    // --------------------------------
                    // FIND DEPRECIATION FOR THIS ASSET
                    // --------------------------------

                    const depreciation =
                        getAssetDepreciation(
                            transactions,
                            transaction.id
                        );


                    const accumulatedDepreciation =
                        depreciation;


                    const carryingValue =
                        Math.max(
                            0,
                            cost -
                            accumulatedDepreciation
                        );


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

                        cost,

                        accumulatedDepreciation,

                        carryingValue

                    });

                }
            );

        }
    );


    return assets;

}


// ------------------------------------
// FIND DEPRECIATION FOR ASSET
// ------------------------------------

function getAssetDepreciation(
    transactions,
    assetId
) {

    let totalDepreciation = 0;


    transactions.forEach(
        transaction => {

            if (
                transaction.type !==
                "depreciation"
            ) {
                return;
            }


            if (
                transaction.assetId !==
                assetId
            ) {
                return;
            }


            totalDepreciation +=
                Number(
                    transaction.amount || 0
                );

        }
    );


    return totalDepreciation;

}


// ------------------------------------
// TOTAL ASSET COST
// ------------------------------------

export function getTotalAssetCost() {

    const assets =
        getAssetRegister();


    return assets.reduce(
        (total, asset) =>
            total + asset.cost,
        0
    );

}


// ------------------------------------
// TOTAL ACCUMULATED DEPRECIATION
// ------------------------------------

export function getTotalAccumulatedDepreciation() {

    const assets =
        getAssetRegister();


    return assets.reduce(
        (total, asset) =>
            total +
            asset.accumulatedDepreciation,
        0
    );

}


// ------------------------------------
// TOTAL CARRYING VALUE
// ------------------------------------

export function getTotalCarryingValue() {

    const assets =
        getAssetRegister();


    return assets.reduce(
        (total, asset) =>
            total +
            asset.carryingValue,
        0
    );

}


// ------------------------------------
// ASSETS BY ACCOUNT
// ------------------------------------

export function getAssetsByAccount(
    accountCode
) {

    return getAssetRegister()
        .filter(
            asset =>
                asset.accountCode ===
                accountCode
        );

}


// ------------------------------------
// GET SINGLE ASSET
// ------------------------------------

export function getAssetById(
    transactionId
) {

    return getAssetRegister()
        .find(
            asset =>
                asset.transactionId ===
                transactionId
        );

}