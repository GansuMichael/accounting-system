// js/cashFlowTable.js

import {
    getCashFlowStatement,
    getOpeningCashBalance,
    getCashBalance,
    reconcileCashFlow
} from "./cashFlowStatement.js";


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


function renderDetails(
    title,
    details
) {

    if (!details.length) {

        return `
            <p>No transactions in this section.</p>
        `;
    }


    return `
        <h4>${escapeHtml(title)}</h4>

        <table class="financial-table">

            <thead>

                <tr>
                    <th>Date</th>
                    <th>Reference</th>
                    <th>Description</th>
                    <th>Account</th>
                    <th>Amount</th>
                </tr>

            </thead>

            <tbody>

                ${details.map(detail => `

                    <tr>

                        <td>
                            ${escapeHtml(detail.date)}
                        </td>

                        <td>
                            ${escapeHtml(detail.reference)}
                        </td>

                        <td>
                            ${escapeHtml(detail.description)}
                        </td>

                        <td>
                            ${escapeHtml(detail.accountName)}
                        </td>

                        <td>
                            ${formatCurrency(detail.amount)}
                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>
    `;
}


export function renderCashFlowStatement({
    startDate,
    endDate
}) {

    if (!startDate || !endDate) {

        throw new Error(
            "Please select both dates."
        );
    }


    if (startDate > endDate) {

        throw new Error(
            "From Date cannot be after To Date."
        );
    }


    const cashFlow =
        getCashFlowStatement({
            startDate,
            endDate
        });


    const opening =
        getOpeningCashBalance(
            startDate
        );


    const closing =
        getCashBalance(
            endDate
        );


    const reconciliation =
        reconcileCashFlow({
            startDate,
            endDate
        });


    const container =
        document.getElementById(
            "cashFlowStatement"
        );


    if (!container) {
        return;
    }


    const statusClass =
        reconciliation.reconciled
            ? "reconciled"
            : "not-reconciled";


    const statusText =
        reconciliation.reconciled
            ? "RECONCILED"
            : "NOT RECONCILED";


    container.innerHTML = `

        <div class="statement-header">

            <h3>
                Cash Flow Statement
            </h3>

            <p>
                ${escapeHtml(startDate)}
                to
                ${escapeHtml(endDate)}
            </p>

        </div>


        <div class="cash-flow-summary">

            <h3>Opening Cash</h3>

            <p>
                ${formatCurrency(opening.total)}
            </p>


            <h3>Operating Activities</h3>

            <p>
                ${formatCurrency(
                    cashFlow.operating
                )}
            </p>


            <h3>Investing Activities</h3>

            <p>
                ${formatCurrency(
                    cashFlow.investing
                )}
            </p>


            <h3>Financing Activities</h3>

            <p>
                ${formatCurrency(
                    cashFlow.financing
                )}
            </p>


            <h3>Net Cash Flow</h3>

            <p>
                ${formatCurrency(
                    cashFlow.netCashFlow
                )}
            </p>


            <h3>Calculated Closing Cash</h3>

            <p>
                ${formatCurrency(
                    reconciliation.calculatedClosingCash
                )}
            </p>


            <h3>Actual Closing Cash</h3>

            <p>
                ${formatCurrency(
                    reconciliation.actualClosingCash
                )}
            </p>

        </div>


        <div class="${statusClass}">

            <strong>
                Cash Flow Status:
            </strong>

            ${statusText}

            <br>

            Difference:

            ${formatCurrency(
                reconciliation.difference
            )}

        </div>


        <hr>


        <h3>
            Operating Activities
        </h3>

        ${renderDetails(
            "Operating Cash Movements",
            cashFlow.operatingDetails
        )}


        <h3>
            Investing Activities
        </h3>

        ${renderDetails(
            "Investing Cash Movements",
            cashFlow.investingDetails
        )}


        <h3>
            Financing Activities
        </h3>

        ${renderDetails(
            "Financing Cash Movements",
            cashFlow.financingDetails
        )}

    `;
}


function getToday() {

    return new Date()
        .toISOString()
        .slice(0, 10);
}


function initializeCashFlowTable() {

    const fromDate =
        document.getElementById(
            "cashFlowFromDate"
        );

    const toDate =
        document.getElementById(
            "cashFlowToDate"
        );

    const generateButton =
        document.getElementById(
            "generateCashFlow"
        );


    if (!fromDate ||
        !toDate ||
        !generateButton) {

        return;
    }


    const today = getToday();


    if (!fromDate.value) {

        fromDate.value =
            `${today.slice(0, 4)}-01-01`;
    }


    if (!toDate.value) {

        toDate.value = today;
    }


    generateButton.addEventListener(
        "click",
        () => {

            try {

                renderCashFlowStatement({

                    startDate:
                        fromDate.value,

                    endDate:
                        toDate.value
                });

            } catch (error) {

                alert(error.message);
            }
        }
    );


    renderCashFlowStatement({

        startDate:
            fromDate.value,

        endDate:
            toDate.value
    });
}


document.addEventListener(
    "DOMContentLoaded",
    initializeCashFlowTable
);