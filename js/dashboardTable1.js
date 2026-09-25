// js/dashboardTable.js

import {
    getDashboardData,
    formatDashboardCurrency
} from "./dashboard.js";


// ============================================
// ELEMENTS
// ============================================

const fromDate =
    document.getElementById(
        "dashboardFromDate"
    );

const toDate =
    document.getElementById(
        "dashboardToDate"
    );

const refreshButton =
    document.getElementById(
        "refreshDashboard"
    );

const dashboard =
    document.getElementById(
        "dashboard"
    );


// ============================================
// REFRESH
// ============================================

refreshButton.addEventListener(
    "click",
    renderDashboard
);


// ============================================
// RENDER
// ============================================

function renderDashboard() {

    try {

        const data =
            getDashboardData({

                startDate:
                    fromDate.value,

                endDate:
                    toDate.value

            });


        dashboard.innerHTML = `

            <!-- ============================ -->
            <!-- PERIOD -->
            <!-- ============================ -->

            <div class="dashboard-period">

                <strong>
                    Reporting Period:
                </strong>

                ${data.period.startDate}

                →

                ${data.period.endDate}

            </div>


            <!-- ============================ -->
            <!-- PERFORMANCE -->
            <!-- ============================ -->

            <section>

                <h2>
                    Performance
                </h2>


                <div class="dashboard-cards">

                    <div class="dashboard-card">

                        <h3>
                            Revenue
                        </h3>

                        <strong>
                            ${formatDashboardCurrency(
                                data.performance.revenue
                            )}
                        </strong>

                    </div>


                    <div class="dashboard-card">

                        <h3>
                            Expenses
                        </h3>

                        <strong>
                            ${formatDashboardCurrency(
                                data.performance.expenses
                            )}
                        </strong>

                    </div>


                    <div class="dashboard-card">

                        <h3>
                            Net Profit
                        </h3>

                        <strong>
                            ${formatDashboardCurrency(
                                data.performance.profit
                            )}
                        </strong>

                    </div>


                    <div class="dashboard-card">

                        <h3>
                            Profit Margin
                        </h3>

                        <strong>
                            ${data.performance
                                .profitMargin
                                .toFixed(2)}%
                        </strong>

                    </div>

                </div>

            </section>


            <!-- ============================ -->
            <!-- FINANCIAL POSITION -->
            <!-- ============================ -->

            <section>

                <h2>
                    Financial Position
                </h2>


                <div class="dashboard-cards">

                    <div class="dashboard-card">

                        <h3>
                            Cash
                        </h3>

                        <strong>
                            ${formatDashboardCurrency(
                                data.financialPosition.cash
                            )}
                        </strong>

                    </div>


                    <div class="dashboard-card">

                        <h3>
                            Bank
                        </h3>

                        <strong>
                            ${formatDashboardCurrency(
                                data.financialPosition.bank
                            )}
                        </strong>

                    </div>


                    <div class="dashboard-card">

                        <h3>
                            Total Assets
                        </h3>

                        <strong>
                            ${formatDashboardCurrency(
                                data.financialPosition.totalAssets
                            )}
                        </strong>

                    </div>


                    <div class="dashboard-card">

                        <h3>
                            Total Liabilities
                        </h3>

                        <strong>
                            ${formatDashboardCurrency(
                                data.financialPosition.totalLiabilities
                            )}
                        </strong>

                    </div>


                    <div class="dashboard-card">

                        <h3>
                            Total Equity
                        </h3>

                        <strong>
                            ${formatDashboardCurrency(
                                data.financialPosition.totalEquity
                            )}
                        </strong>

                    </div>

                </div>

            </section>


            <!-- ============================ -->
            <!-- WORKING CAPITAL -->
            <!-- ============================ -->

            <section>

                <h2>
                    Working Capital
                </h2>


                <div class="dashboard-cards">

                    <div class="dashboard-card">

                        <h3>
                            Accounts Receivable
                        </h3>

                        <strong>
                            ${formatDashboardCurrency(
                                data.workingCapital
                                    .receivables
                            )}
                        </strong>

                    </div>


                    <div class="dashboard-card">

                        <h3>
                            Accounts Payable
                        </h3>

                        <strong>
                            ${formatDashboardCurrency(
                                data.workingCapital
                                    .payables
                            )}
                        </strong>

                    </div>


                    <div class="dashboard-card">

                        <h3>
                            Customer Credits
                        </h3>

                        <strong>
                            ${formatDashboardCurrency(
                                data.workingCapital
                                    .customerCredits
                            )}
                        </strong>

                    </div>


                    <div class="dashboard-card">

                        <h3>
                            Supplier Prepayments
                        </h3>

                        <strong>
                            ${formatDashboardCurrency(
                                data.workingCapital
                                    .supplierPrepayments
                            )}
                        </strong>

                    </div>

                </div>

            </section>


            <!-- ============================ -->
            <!-- CONTROLS -->
            <!-- ============================ -->

            <section>

                <h2>
                    Accounting Controls
                </h2>


                <table>

                    <thead>

                        <tr>

                            <th>
                                Control
                            </th>

                            <th>
                                Difference
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        <tr>

                            <td>
                                Accounts Receivable
                            </td>

                            <td>
                                ${formatDashboardCurrency(
                                    data.controls
                                        .receivablesDifference
                                )}
                            </td>

                            <td>
                                ${
                                    isZero(
                                        data.controls
                                            .receivablesDifference
                                    )
                                    ? "OK"
                                    : "CHECK"
                                }
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Accounts Payable
                            </td>

                            <td>
                                ${formatDashboardCurrency(
                                    data.controls
                                        .payablesDifference
                                )}
                            </td>

                            <td>
                                ${
                                    isZero(
                                        data.controls
                                            .payablesDifference
                                    )
                                    ? "OK"
                                    : "CHECK"
                                }
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Balance Sheet
                            </td>

                            <td>
                                ${formatDashboardCurrency(
                                    data.controls
                                        .balanceSheetDifference
                                )}
                            </td>

                            <td>
                                ${
                                    isZero(
                                        data.controls
                                            .balanceSheetDifference
                                    )
                                    ? "OK"
                                    : "CHECK"
                                }
                            </td>

                        </tr>

                    </tbody>

                </table>

            </section>

        `;

    }
    catch (error) {

        alert(
            error.message
        );

    }

}


// ============================================
// ZERO CHECK
// ============================================

function isZero(
    value
) {

    return Math.abs(
        Number(value || 0)
    ) < 0.01;

}


// ============================================
// INITIAL LOAD
// ============================================

renderDashboard();