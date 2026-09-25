// js/assetTable.js

import {
    getAssetRegister
} from "./assets.js";


// ------------------------------------
// ELEMENTS
// ------------------------------------

const assetBody =
    document.getElementById(
        "assetRegisterBody"
    );

const fromDate =
    document.getElementById(
        "assetFromDate"
    );

const toDate =
    document.getElementById(
        "assetToDate"
    );

const filterButton =
    document.getElementById(
        "filterAssets"
    );

const resetButton =
    document.getElementById(
        "resetAssetFilter"
    );

const printButton =
    document.getElementById(
        "printAssets"
    );


// ------------------------------------
// CURRENCY
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
// FILTER ASSETS
// ------------------------------------

function filterAssets(
    assets,
    startDate,
    endDate
) {

    return assets.filter(asset => {

        if (
            startDate &&
            asset.date < startDate
        ) {
            return false;
        }


        if (
            endDate &&
            asset.date > endDate
        ) {
            return false;
        }


        return true;

    });

}


// ------------------------------------
// DISPLAY ASSET REGISTER
// ------------------------------------

export function displayAssets() {

    const allAssets =
        getAssetRegister();


    const assets =
        filterAssets(
            allAssets,
            fromDate.value,
            toDate.value
        );


    assetBody.innerHTML = "";


    if (assets.length === 0) {

        assetBody.innerHTML = `

            <tr>

                <td colspan="8">
                    No assets found.
                </td>

            </tr>

        `;

        return;

    }


    assets.forEach(asset => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${asset.date}
            </td>

            <td>
                ${asset.reference}
            </td>

            <td>
                ${asset.assetName}
            </td>

            <td>
                ${asset.description}
            </td>

            <td>
                ${formatCurrency(
                    asset.cost
                )}
            </td>

            <td>
                ${formatCurrency(
                    asset.accumulatedDepreciation
                )}
            </td>

            <td>
                ${formatCurrency(
                    asset.carryingValue
                )}
            </td>

            <td>
                <button
                    type="button"
                    class="asset-view-button"
                    data-id="${asset.transactionId}"
                >
                    View
                </button>
            </td>

        `;


        assetBody.appendChild(row);

    });

}


// ------------------------------------
// FILTER BUTTON
// ------------------------------------

filterButton.addEventListener(
    "click",
    displayAssets
);


// ------------------------------------
// RESET BUTTON
// ------------------------------------

resetButton.addEventListener(
    "click",
    function () {

        fromDate.value = "";

        toDate.value = "";

        displayAssets();

    }
);


// ------------------------------------
// PRINT
// ------------------------------------

printButton.addEventListener(
    "click",
    function () {

        window.print();

    }
);


// ------------------------------------
// INITIAL DISPLAY
// ------------------------------------

displayAssets();