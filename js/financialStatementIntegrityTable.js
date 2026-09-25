// js/financialStatementIntegrityTable.js

import {
    runFinancialStatementIntegrityCheck
} from "./financialStatementIntegrity.js";


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


function renderIntegrityResult(result) {

    const container =
        document.getElementById(
            "financialStatementIntegrityResult"
        );


    if (!container) {
        return;
    }


    const statusClass =
        result.passed
            ? "reconciled"
            : "not-reconciled";


    const status =
        result.passed
            ? "FINANCIAL STATEMENTS RECONCILED"
            : "FINANCIAL STATEMENTS NOT RECONCILED";


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

            <p>
                Reporting period:
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

    `;
}


function initializeIntegrityCheck() {

    const fromDate =
        document.getElementById(
            "financialIntegrityFromDate"
        );


    const toDate =
        document.getElementById(
            "financialIntegrityToDate"
        );


    const button =
        document.getElementById(
            "runFinancialIntegrityCheck"
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
                    runFinancialStatementIntegrityCheck({

                        startDate:
                            fromDate.value,

                        endDate:
                            toDate.value
                    });


                renderIntegrityResult(
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
    initializeIntegrityCheck
);