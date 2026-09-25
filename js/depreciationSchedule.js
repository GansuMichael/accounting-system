// js/depreciationSchedule.js

import { getAssetRegister } from "./assets.js";
import {
    calculateStraightLineDepreciation
} from "./depreciation.js";
import { postDepreciation } from "./depreciationPosting.js";


// ------------------------------------
// ELEMENTS
// ------------------------------------

const assetSelect =
    document.getElementById(
        "depreciationAsset"
    );

const depreciationDate =
    document.getElementById(
        "depreciationDate"
    );

const usefulLife =
    document.getElementById(
        "depreciationUsefulLife"
    );

const residualValue =
    document.getElementById(
        "depreciationResidualValue"
    );

const costDisplay =
    document.getElementById(
        "depreciationCost"
    );

const monthlyDisplay =
    document.getElementById(
        "depreciationMonthly"
    );

const annualDisplay =
    document.getElementById(
        "depreciationAnnual"
    );

const accumulatedDisplay =
    document.getElementById(
        "depreciationAccumulated"
    );

const carryingDisplay =
    document.getElementById(
        "depreciationCarryingValue"
    );

const postButton =
    document.getElementById(
        "postDepreciation"
    );


// ------------------------------------
// CURRENCY FORMAT
// ------------------------------------

function formatCurrency(amount) {

    return Number(amount || 0)
        .toLocaleString(
            "en-NG",
            {
                style: "currency",
                currency: "NGN"
            }
        );

}


// ------------------------------------
// LOAD ASSETS
// ------------------------------------

function loadAssets() {

    const assets =
        getAssetRegister();


    assetSelect.innerHTML = `
        <option value="">
            Select asset
        </option>
    `;


    assets.forEach(asset => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            asset.transactionId;

        option.textContent =
            `${asset.assetName} - ${formatCurrency(asset.cost)}`;

        assetSelect.appendChild(
            option
        );

    });

}


// ------------------------------------
// DISPLAY SELECTED ASSET
// ------------------------------------

function displayAsset() {

    const assetId =
        assetSelect.value;


    if (!assetId) {

        clearCalculation();

        return;

    }


    const assets =
        getAssetRegister();


    const asset =
        assets.find(
            item =>
                item.transactionId ===
                assetId
        );


    if (!asset) {

        clearCalculation();

        return;

    }


    costDisplay.textContent =
        formatCurrency(
            asset.cost
        );


    accumulatedDisplay.textContent =
        formatCurrency(
            asset.accumulatedDepreciation
        );


    carryingDisplay.textContent =
        formatCurrency(
            asset.carryingValue
        );


    calculateDepreciation(
        asset
    );

}


// ------------------------------------
// CALCULATE DEPRECIATION
// ------------------------------------

function calculateDepreciation(
    asset
) {

    const life =
        Number(
            usefulLife.value
        );


    const residual =
        Number(
            residualValue.value
        );


    if (
        !life ||
        life <= 0
    ) {

        monthlyDisplay.textContent =
            formatCurrency(0);

        annualDisplay.textContent =
            formatCurrency(0);

        return;

    }


    try {

        const depreciation =
            calculateStraightLineDepreciation({

                cost:
                    asset.cost,

                residualValue:
                    residual,

                usefulLifeYears:
                    life

            });


        monthlyDisplay.textContent =
            formatCurrency(
                depreciation.monthlyDepreciation
            );


        annualDisplay.textContent =
            formatCurrency(
                depreciation.annualDepreciation
            );


    } catch (error) {

        monthlyDisplay.textContent =
            error.message;

        annualDisplay.textContent =
            "";

    }

}


// ------------------------------------
// CLEAR CALCULATION
// ------------------------------------

function clearCalculation() {

    costDisplay.textContent =
        formatCurrency(0);

    monthlyDisplay.textContent =
        formatCurrency(0);

    annualDisplay.textContent =
        formatCurrency(0);

    accumulatedDisplay.textContent =
        formatCurrency(0);

    carryingDisplay.textContent =
        formatCurrency(0);

}


// ------------------------------------
// POST DEPRECIATION
// ------------------------------------

postButton.addEventListener(
    "click",
    function () {

        const assetId =
            assetSelect.value;


        if (!assetId) {

            alert(
                "Please select an asset."
            );

            return;

        }


        if (
            !depreciationDate.value
        ) {

            alert(
                "Please select a depreciation date."
            );

            return;

        }


        const life =
            Number(
                usefulLife.value
            );


        const residual =
            Number(
                residualValue.value
            );


        if (
            !life ||
            life <= 0
        ) {

            alert(
                "Please enter a valid useful life."
            );

            return;

        }


        const assets =
            getAssetRegister();


        const asset =
            assets.find(
                item =>
                    item.transactionId ===
                    assetId
            );


        if (!asset) {

            alert(
                "Asset not found."
            );

            return;

        }


        try {

            const depreciation =
                calculateStraightLineDepreciation({

                    cost:
                        asset.cost,

                    residualValue:
                        residual,

                    usefulLifeYears:
                        life

                });


            const remainingDepreciation =
                asset.cost -
                residual -
                asset.accumulatedDepreciation;


            if (
                remainingDepreciation <= 0
            ) {

                alert(
                    "This asset is already fully depreciated."
                );

                return;

            }


            const amount =
                Math.min(
                    depreciation.monthlyDepreciation,
                    remainingDepreciation
                );


            postDepreciation({

                date:
                    depreciationDate.value,

                description:
                    `Monthly depreciation - ${asset.assetName}`,

                amount,

                assetId:
                    asset.transactionId,

                assetName:
                    asset.assetName

            });


            alert(
                `Depreciation of ${formatCurrency(amount)} posted successfully.`
            );


            displayAsset();


        } catch (error) {

            alert(
                error.message
            );

        }

    }
);


// ------------------------------------
// EVENTS
// ------------------------------------

assetSelect.addEventListener(
    "change",
    displayAsset
);


usefulLife.addEventListener(
    "input",
    function () {

        const asset =
            getSelectedAsset();

        if (asset) {
            calculateDepreciation(
                asset
            );
        }

    }
);


residualValue.addEventListener(
    "input",
    function () {

        const asset =
            getSelectedAsset();

        if (asset) {
            calculateDepreciation(
                asset
            );
        }

    }
);


// ------------------------------------
// GET SELECTED ASSET
// ------------------------------------

function getSelectedAsset() {

    const assetId =
        assetSelect.value;


    if (!assetId) {
        return null;
    }


    return getAssetRegister()
        .find(
            asset =>
                asset.transactionId ===
                assetId
        );

}


// ------------------------------------
// INITIALIZE
// ------------------------------------

loadAssets();
clearCalculation();