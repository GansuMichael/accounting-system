// js/accountingControlCenterTable.js

import {
    runAccountingControlCenter
} from "./accountingControlCenter.js";


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


function renderControlCenter(result) {

    const container =
        document.getElementById(
            "accountingControlCenterResult"
        );


    if (!container) {
        return;
    }


    const statusClass =
        result.passed
            ? "reconciled"
            : "not-reconciled";


    const statusText =
        result.passed
            ? "ACCOUNTING SYSTEM PASSED"
            : "ACCOUNTING SYSTEM HAS EXCEPTIONS";


    const rows =
        result.checks.map(check => `

            <tr>

                <td>
                    ${escapeHtml(
                        check.name
                    )}
                </td>

                <td>

                    <strong>

                        ${
                            check.passed
                                ? "PASS"
                                : "FAIL"
                        }

                    </strong>

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
                ${statusText}
            </h3>

            <p>
                Period:
                ${escapeHtml(
                    result.startDate
                )}
                to
                ${escapeHtml(
                    result.endDate
                )}
            </p>

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
            result.journal.errors.length > 0
                ? renderJournalErrors(
                    result.journal.errors
                )
                : ""
        }

    `;
}


/**
 * Show journal errors.
 */
function renderJournalErrors(errors) {

    return `

        <h3>
            Journal Exceptions
        </h3>

        <table class="financial-table">

            <thead>

                <tr>
                    <th>Date</th>
                    <th>Reference</th>
                    <th>Difference</th>
                </tr>

            </thead>

            <tbody>

                ${errors.map(error => `

                    <tr>

                        <td>
                            ${escapeHtml(
                                error.date
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                error.reference
                            )}
                        </td>

                        <td>
                            ${formatCurrency(
                                error.difference
                            )}
                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>
    `;
}


/**
 * Initialize the Control Center.
 */
function initializeControlCenter() {

    const fromDate =
        document.getElementById(
            "controlCenterFromDate"
        );


    const toDate =
        document.getElementById(
            "controlCenterToDate"
        );


    const button =
        document.getElementById(
            "runAccountingControlCenter"
        );


    if (
        !fromDate ||
        !toDate ||
        !button
    ) {
        return;
    }


    const today =
        new Date()
            .toISOString()
            .slice(0, 10);


    fromDate.value =
        `${today.slice(0, 4)}-01-01`;


    toDate.value =
        today;


    button.addEventListener(
        "click",
        () => {

            try {

                const result =
                    runAccountingControlCenter({

                        startDate:
                            fromDate.value,

                        endDate:
                            toDate.value
                    });


                renderControlCenter(
                    result
                );

            } catch (error) {

                alert(error.message);
            }
        }
    );
}


document.addEventListener(
    "DOMContentLoaded",
    initializeControlCenter
);