// js/trialBalanceTable.js

import {
    generateTrialBalance
} from "./trialBalance.js";


function formatCurrency(amount) {

    return Number(amount || 0)
        .toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN"
        });
}


function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


export function renderTrialBalanceTable(
    endDate
) {

    const result =
        generateTrialBalance({
            endDate
        });


    const container =
        document.getElementById(
            "trialBalance"
        );


    if (!container) {
        return;
    }


    const rows =
        result.trialBalance
            .map(account => `

                <tr>

                    <td>
                        ${escapeHtml(
                            account.accountCode
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            account.accountName
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            account.accountType
                        )}
                    </td>

                    <td>
                        ${formatCurrency(
                            account.debit
                        )}
                    </td>

                    <td>
                        ${formatCurrency(
                            account.credit
                        )}
                    </td>

                </tr>

            `)
            .join("");


    const status =
        result.balanced
            ? "BALANCED"
            : "NOT BALANCED";


    container.innerHTML = `

        <div class="statement-header">

            <h2>
                Trial Balance
            </h2>

            <p>
                As of:
                ${escapeHtml(endDate)}
            </p>

        </div>


        <table class="financial-table">

            <thead>

                <tr>

                    <th>
                        Account Code
                    </th>

                    <th>
                        Account Name
                    </th>

                    <th>
                        Type
                    </th>

                    <th>
                        Debit
                    </th>

                    <th>
                        Credit
                    </th>

                </tr>

            </thead>


            <tbody>

                ${rows}

                <tr class="statement-grand-total">

                    <td colspan="3">
                        <strong>
                            TOTAL
                        </strong>
                    </td>

                    <td>
                        <strong>
                            ${formatCurrency(
                                result.totalDebit
                            )}
                        </strong>
                    </td>

                    <td>
                        <strong>
                            ${formatCurrency(
                                result.totalCredit
                            )}
                        </strong>
                    </td>

                </tr>

            </tbody>

        </table>


        <div class="${
            result.balanced
                ? "reconciled"
                : "not-reconciled"
        }">

            <strong>
                Trial Balance:
            </strong>

            ${status}

            <br>

            Difference:

            ${formatCurrency(
                result.difference
            )}

        </div>

    `;
}


/**
 * Initialize Trial Balance screen.
 */
function initializeTrialBalance() {

    const dateInput =
        document.getElementById(
            "trialBalanceDate"
        );


    const generateButton =
        document.getElementById(
            "generateTrialBalance"
        );


    if (
        !dateInput ||
        !generateButton
    ) {
        return;
    }


    const today =
        new Date()
            .toISOString()
            .slice(0, 10);


    dateInput.value = today;


    generateButton.addEventListener(
        "click",
        () => {

            try {

                renderTrialBalanceTable(
                    dateInput.value
                );

            } catch (error) {

                alert(error.message);
            }
        }
    );


    renderTrialBalanceTable(
        dateInput.value
    );
}


document.addEventListener(
    "DOMContentLoaded",
    initializeTrialBalance
);