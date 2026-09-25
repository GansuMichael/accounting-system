// js/periodCloseTable.js

import {
    validatePeriodClose
} from "./periodCloseValidation.js";

import {
    closeAccountingPeriod
} from "./accountingPeriods.js";


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


function renderValidation(result) {

    const container =
        document.getElementById(
            "periodCloseValidationResult"
        );


    if (!container) {
        return;
    }


    const statusClass =
        result.valid
            ? "reconciled"
            : "not-reconciled";


    const status =
        result.valid
            ? "PERIOD READY TO CLOSE"
            : "PERIOD CANNOT BE CLOSED";


    const rows =
        result.checks.map(check => `

            <tr>

                <td>
                    ${escapeHtml(
                        check.name
                    )}
                </td>

                <td>

                    ${
                        check.passed
                            ? "PASS"
                            : "FAIL"
                    }

                </td>

                <td>
                    ${formatCurrency(
                        check.difference
                    )}
                </td>

            </tr>

        `).join("");


    container.innerHTML = `

        <div class="${statusClass}">

            <h3>
                ${status}
            </h3>

        </div>


        <table class="financial-table">

            <thead>

                <tr>

                    <th>
                        Control
                    </th>

                    <th>
                        Status
                    </th>

                    <th>
                        Difference
                    </th>

                </tr>

            </thead>


            <tbody>

                ${rows}

            </tbody>

        </table>


        ${
            result.failedChecks.length > 0
                ? `

                    <h4>
                        Failed Controls
                    </h4>

                    <ul>

                        ${
                            result.failedChecks
                                .map(
                                    check => `
                                        <li>
                                            ${escapeHtml(
                                                check.name
                                            )}
                                        </li>
                                    `
                                )
                                .join("")
                        }

                    </ul>

                `
                : ""
        }

    `;
}


/**
 * Initialize period closing.
 */
function initializePeriodClose() {

    const startDate =
        document.getElementById(
            "periodCloseStartDate"
        );


    const endDate =
        document.getElementById(
            "periodCloseEndDate"
        );


    const validateButton =
        document.getElementById(
            "validatePeriodClose"
        );


    const closeButton =
        document.getElementById(
            "closeAccountingPeriod"
        );


    if (
        !startDate ||
        !endDate ||
        !validateButton ||
        !closeButton
    ) {
        return;
    }


    let latestValidation = null;


    validateButton.addEventListener(
        "click",
        () => {

            try {

                latestValidation =
                    validatePeriodClose({

                        startDate:
                            startDate.value,

                        endDate:
                            endDate.value
                    });


                renderValidation(
                    latestValidation
                );


                closeButton.disabled =
                    !latestValidation.valid;


            } catch (error) {

                latestValidation = null;

                closeButton.disabled =
                    true;

                alert(error.message);
            }
        }
    );


    closeButton.disabled = true;


    closeButton.addEventListener(
        "click",
        () => {

            try {

                if (
                    !latestValidation ||
                    !latestValidation.valid
                ) {

                    throw new Error(
                        "Period must pass all accounting controls before it can be closed."
                    );
                }


                const period =
                    endDate.value.slice(
                        0,
                        7
                    );


                closeAccountingPeriod(
                    period,
                    "System",
                    "Period passed accounting control validation."
                );


                alert(
                    `Accounting period ${period} has been closed successfully.`
                );


                closeButton.disabled =
                    true;

            } catch (error) {

                alert(error.message);
            }
        }
    );
}


document.addEventListener(
    "DOMContentLoaded",
    initializePeriodClose
);