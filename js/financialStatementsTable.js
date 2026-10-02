// js/financialStatementsTable.js

import {
    generateFinancialStatements
} from "./financialStatements.js";


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


/**
 * Render Income Statement.
 */
function renderIncomeStatement(statement) {

    const revenueRows =
        Object.values(
            statement.revenue
        ).map(account => `

            <tr>
                <td>${escapeHtml(account)}</td>
                <td>${formatCurrency(account)}</td>
            </tr>

        `).join("");

    /*
     * The revenue object currently stores
     * account codes as keys.
     */
    const revenueDetails =
        Object.entries(
            statement.revenue
        ).map(([code, amount]) => `

            <tr>
                <td>${escapeHtml(code)}</td>
                <td>${formatCurrency(amount)}</td>
            </tr>

        `).join("");


    const expenseDetails =
        Object.entries(
            statement.expenses
        ).map(([code, amount]) => `

            <tr>
                <td>${escapeHtml(code)}</td>
                <td>${formatCurrency(amount)}</td>
            </tr>

        `).join("");


    return `

        <section class="financial-statement">

            <h2>Income Statement</h2>

            <table class="financial-table">

                <thead>
                    <tr>
                        <th>Account</th>
                        <th>Amount</th>
                    </tr>
                </thead>

                <tbody>

                    ${revenueDetails}

                    <tr class="statement-total">
                        <td>
                            <strong>Total Revenue</strong>
                        </td>

                        <td>
                            <strong>
                                ${formatCurrency(
                                    statement.totalRevenue
                                )}
                            </strong>
                        </td>
                    </tr>

                    ${expenseDetails}

                    <tr class="statement-total">
                        <td>
                            <strong>Total Expenses</strong>
                        </td>

                        <td>
                            <strong>
                                ${formatCurrency(
                                    statement.totalExpenses
                                )}
                            </strong>
                        </td>
                    </tr>

                    <tr class="statement-grand-total">
                        <td>
                            <strong>Net Profit</strong>
                        </td>

                        <td>
                            <strong>
                                ${formatCurrency(
                                    statement.netProfit
                                )}
                            </strong>
                        </td>
                    </tr>

                </tbody>

            </table>

        </section>
    `;
}


/**
 * Render Balance Sheet.
 */
function renderBalanceSheet(
    statement
) {

    const assets =
        Object.values(
            statement.assets
        );


    const liabilities =
        Object.values(
            statement.liabilities
        );


    const equity =
        Object.values(
            statement.equity
        );


    const assetRows =
        assets.map(account => `

            <tr>

                <td>
                    ${escapeHtml(
                        account.code
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        account.name
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        account.balance
                    )}
                </td>

            </tr>

        `).join("");


    const liabilityRows =
        liabilities.map(account => `

            <tr>

                <td>
                    ${escapeHtml(
                        account.code
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        account.name
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        account.balance
                    )}
                </td>

            </tr>

        `).join("");


    const equityRows =
        equity.map(account => `

            <tr>

                <td>
                    ${escapeHtml(
                        account.code
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        account.name
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        -account.balance
                    )}
                </td>

            </tr>

        `).join("");


        const totalAssets =
            statement.totalAssets;


        const totalLiabilities =
            statement.totalLiabilities;


            const totalEquity =
                statement.equity
                ? Object.values(
                    statement.equity
                ).reduce(
                    (total, account) =>
                        total - account.balance,
                    0
                )
                : 0;
                return (
                    equityTotal +
                    statement.currentYearProfitIncluded
                );


    return `

        <section class="financial-statement">

            <h2>Balance Sheet</h2>


            <h3>Assets</h3>

            <table class="financial-table">

                <thead>

                    <tr>
                        <th>Code</th>
                        <th>Account</th>
                        <th>Balance</th>
                    </tr>

                </thead>

                <tbody>

                    ${assetRows}

                    <tr class="statement-total">

                        <td colspan="2">
                            <strong>
                                Total Assets
                            </strong>
                        </td>

                        <td>
                            <strong>
                                ${formatCurrency(
                                    totalAssets
                                )}
                            </strong>
                        </td>

                    </tr>

                </tbody>

            </table>


            <h3>Liabilities</h3>

            <table class="financial-table">

                <tbody>

                    ${liabilityRows}

                    <tr class="statement-total">

                        <td colspan="2">
                            <strong>
                                Total Liabilities
                            </strong>
                        </td>

                        <td>
                            <strong>
                                ${formatCurrency(
                                    totalLiabilities
                                )}
                            </strong>
                        </td>

                    </tr>

                </tbody>

            </table>


            <h3>Equity</h3>

            <table class="financial-table">

                <tbody>

                    ${equityRows}

                    <tr>

                        <td colspan="2">
                            Current Year Profit
                        </td>

                        <td>
                            ${formatCurrency(
                                statement.currentYearProfitIncluded
                            )}
                        </td>

                    </tr>

                    <tr class="statement-total">

                        <td colspan="2">
                            <strong>
                                Total Equity
                            </strong>
                        </td>

                        <td>
                            <strong>
                            ${formatCurrency(
                                totalEquity
                            )}
                            </strong>
                        </td>

                    </tr>

                </tbody>

            </table>

        </section>
    `;
}


/**
 * Render Statement of Equity.
 */
function renderStatementOfEquity(statement) {

    return `

        <section class="financial-statement">

            <h2>
                Statement of Equity
            </h2>

            <table class="financial-table">

                <tbody>

                    <tr>
                        <td>Opening Equity</td>
                        <td>
                            ${formatCurrency(
                                statement.openingEquity
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td>
                            Capital Contributions
                        </td>

                        <td>
                            ${formatCurrency(
                                statement.capitalContributions
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td>
                            Net Profit
                        </td>

                        <td>
                            ${formatCurrency(
                                statement.profitIncluded
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td>
                            Retained Earnings Movement
                        </td>

                        <td>
                            ${formatCurrency(
                                statement.retainedEarningsIncluded
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td>
                            Owner's Drawings
                        </td>

                        <td>
                            (${formatCurrency(
                                statement.drawings
                            )})
                        </td>
                    </tr>

                    <tr class="statement-grand-total">

                        <td>
                            <strong>
                                Closing Equity
                            </strong>
                        </td>

                        <td>
                            <strong>
                                ${formatCurrency(
                                    statement.calculatedClosingEquity
                                )}
                            </strong>
                        </td>

                    </tr>

                    <tr>

                        <td>
                            Balance Sheet Equity
                        </td>

                        <td>
                            ${formatCurrency(
                                statement.balanceSheetClosingEquity
                            )}
                        </td>

                    </tr>

                    <tr>

                        <td>
                            Reconciliation Difference
                        </td>

                        <td>
                            ${formatCurrency(
                                statement.difference
                            )}
                        </td>

                    </tr>

                </tbody>

            </table>

        </section>
    `;
}


/**
 * Render Cash Flow Statement.
 */
function renderCashFlow(
    statement
) {

    const cash =
        statement.cashFlowStatement;

    const balances =
        statement.cashBalances;


    return `

        <section class="financial-statement">

            <h2>Cash Flow Statement</h2>

            <table class="financial-table">

                <tbody>

                    <tr>
                        <td>
                            Opening Cash
                        </td>

                        <td>
                            ${formatCurrency(
                                balances.opening.total
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td>
                            Operating Activities
                        </td>

                        <td>
                            ${formatCurrency(
                                cash.operating
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td>
                            Investing Activities
                        </td>

                        <td>
                            ${formatCurrency(
                                cash.investing
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td>
                            Financing Activities
                        </td>

                        <td>
                            ${formatCurrency(
                                cash.financing
                            )}
                        </td>
                    </tr>

                    <tr class="statement-total">
                        <td>
                            <strong>
                                Net Cash Flow
                            </strong>
                        </td>

                        <td>
                            <strong>
                                ${formatCurrency(
                                    cash.netCashFlow
                                )}
                            </strong>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            Closing Cash
                        </td>

                        <td>
                            ${formatCurrency(
                                balances.closing.total
                            )}
                        </td>
                    </tr>

                </tbody>

            </table>

        </section>
    `;
}


/**
 * Render Trial Balance.
 */
function renderTrialBalance(
    trialBalance
) {

    const rows =
        trialBalance.trialBalance
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


    return `

        <section class="financial-statement">

            <h2>Trial Balance</h2>

            <table class="financial-table">

                <thead>

                    <tr>
                        <th>Code</th>
                        <th>Account</th>
                        <th>Debit</th>
                        <th>Credit</th>
                    </tr>

                </thead>

                <tbody>

                    ${rows}

                    <tr class="statement-grand-total">

                        <td colspan="2">
                            <strong>
                                Total
                            </strong>
                        </td>

                        <td>
                            <strong>
                                ${formatCurrency(
                                    trialBalance
                                        .totalDebit
                                )}
                            </strong>
                        </td>

                        <td>
                            <strong>
                                ${formatCurrency(
                                    trialBalance
                                        .totalCredit
                                )}
                            </strong>
                        </td>

                    </tr>

                </tbody>

            </table>

        </section>
    `;
}


/**
 * Render the complete financial report.
 */
export function renderFinancialStatements({
    startDate,
    endDate
}) {

    if (!startDate || !endDate) {

        throw new Error(
            "Both reporting dates are required."
        );
    }


    if (startDate > endDate) {

        throw new Error(
            "From Date cannot be after To Date."
        );
    }


    const statements =
        generateFinancialStatements({
            startDate,
            endDate
        });


    const container =
        document.getElementById(
            "financialStatements"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div
            class="financial-report"
            id="financialReport"
        >

            <header class="financial-report-header">

                <h1>
                    Financial Statements
                </h1>

                <p>
                    Reporting Period:
                    ${escapeHtml(startDate)}
                    to
                    ${escapeHtml(endDate)}
                </p>

            </header>


            ${renderIncomeStatement(
                statements.incomeStatement
            )}


            ${renderBalanceSheet({

                ...statements.balanceSheet,
            
                totalAssets:
                    statements.totals.totalAssets,
            
                totalLiabilities:
                    statements.totals.totalLiabilities,
            
                totalEquity:
                    statements.totals.totalEquity,
            
                currentYearProfitIncluded:
                    statements.currentYearProfitIncluded
            
            })}


            ${renderCashFlow(
                statements
            )}


            ${renderStatementOfEquity(
                statements.statementOfEquity
            )}


            ${renderTrialBalance(
                statements.trialBalance
            )}


            <section class="financial-statement">

                <h2>
                    Accounting Controls
                </h2>

                <table class="financial-table">

                    <tbody>

                        <tr>

                            <td>
                                Balance Sheet Difference
                            </td>

                            <td>
                                ${formatCurrency(
                                    statements
                                        .totals
                                        .balanceSheetDifference
                                )}
                            </td>

                        </tr>

                        <tr>

                            <td>
                                Trial Balance Difference
                            </td>

                            <td>
                                ${formatCurrency(
                                    statements
                                        .trialBalanceTotals
                                        .totalDebit -
                                    statements
                                        .trialBalanceTotals
                                        .totalCredit
                                )}
                            </td>

                        </tr>

                        <tr>

                            <td>
                                Statement of Equity
                            </td>

                            <td>
                                ${
                                    statements
                                        .statementOfEquity
                                        .reconciled
                                        ? "RECONCILED"
                                        : "NOT RECONCILED"
                                }
                            </td>

                        </tr>

                    </tbody>

                </table>

            </section>

        </div>
    `;
}


/**
 * Initialize the master report.
 */
function initializeFinancialStatements() {

    const fromDate =
        document.getElementById(
            "financialStatementsFromDate"
        );

    const toDate =
        document.getElementById(
            "financialStatementsToDate"
        );

    const generateButton =
        document.getElementById(
            "generateFinancialStatements"
        );

    const printButton =
        document.getElementById(
            "printFinancialStatements"
        );


    if (
        !fromDate ||
        !toDate ||
        !generateButton
    ) {
        return;
    }


    const today =
        new Date()
            .toISOString()
            .slice(0, 10);


    fromDate.value =
        `${today.slice(0, 4)}-01-01`;

    toDate.value = today;


    generateButton.addEventListener(
        "click",
        () => {

            try {

                renderFinancialStatements({

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


    if (printButton) {

        printButton.addEventListener(
            "click",
            () => {

                window.print();
            }
        );
    }


    renderFinancialStatements({

        startDate:
            fromDate.value,

        endDate:
            toDate.value
    });
}


document.addEventListener(
    "DOMContentLoaded",
    initializeFinancialStatements
);