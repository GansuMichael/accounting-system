// js/depreciationEngine.js

import {
    getAssets,
    saveAssets
} from "./storage.js";

import {
    calculateStraightLineDepreciation
} from "./depreciation.js";


// ------------------------------------
// ADD ASSET TO DEPRECIATION REGISTER
// ------------------------------------

export function registerAssetForDepreciation({

    assetId,

    assetName,

    assetAccount,

    purchaseDate,

    cost,

    usefulLifeYears,

    residualValue = 0

}) {

    const assets =
        getAssets();


    const depreciation =
        calculateStraightLineDepreciation({

            cost,

            residualValue,

            usefulLifeYears

        });


    const asset = {

        id: assetId,

        assetName,

        assetAccount,

        purchaseDate,

        cost,

        residualValue,

        usefulLifeYears,

        depreciationMethod:
            "straight-line",

        depreciableAmount:
            depreciation.depreciableAmount,

        annualDepreciation:
            depreciation.annualDepreciation,

        monthlyDepreciation:
            depreciation.monthlyDepreciation,

        accumulatedDepreciation: 0,

        carryingValue: cost

    };


    assets.push(asset);

    saveAssets(assets);


    return asset;

}


// ------------------------------------
// CALCULATE ASSET DEPRECIATION
// ------------------------------------

export function calculateAssetDepreciation(
    assetId,
    months
) {

    const assets =
        getAssets();


    const asset =
        assets.find(
            item =>
                item.id === assetId
        );


    if (!asset) {

        throw new Error(
            "Asset not found."
        );

    }


    const depreciation =
        asset.monthlyDepreciation *
        months;


    asset.accumulatedDepreciation =
        Math.min(
            asset.accumulatedDepreciation +
                depreciation,

            asset.depreciableAmount
        );


    asset.carryingValue =
        asset.cost -
        asset.accumulatedDepreciation;


    saveAssets(assets);


    return asset;

}