// js/openingBalanceTable.js

import {
    createOpeningBalances
} from "./openingBalances.js";


const dateInput =
    document.getElementById(
        "openingBalanceDate"
    );

const generateButton =
    document.getElementById(
        "generateOpeningBalances"
    );

const body =
    document.getElementById(
        "openingBalanceBody"
    );


function formatCurrency(
    amount
) {

    return Number(amount || 0)
        .toLocaleString(
            "en-NG",
            {
                style: "currency",
                currency: "NGN"
            }
        );

}


generateButton.addEventListener(
    "click",
    function () {

        try {

            if (!dateInput.value) {

                throw new Error(
                    "Select the previous financial year end date."
                );

            }


            const balances =
                createOpeningBalances(
                    dateInput.value
                );


            body.innerHTML =
                "";


            balances.forEach(
                balance => {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>
                            ${balance.financialYear}
                        </td>

                        <td>
                            ${balance.accountCode}
                        </td>

                        <td>
                            ${balance.accountName}
                        </td>

                        <td>
                            ${balance.type}
                        </td>

                        <td>
                            ${formatCurrency(
                                balance.openingBalance
                            )}
                        </td>

                    `;


                    body.appendChild(
                        row
                    );

                }
            );

        }
        catch (error) {

            alert(
                error.message
            );

        }

    }
);