// js/accountingIntegrityTable.js

import {
    runAccountingIntegrityCheck
} from "./accountingIntegrity.js";


const fromDate =
    document.getElementById(
        "integrityFromDate"
    );

const toDate =
    document.getElementById(
        "integrityToDate"
    );

const runButton =
    document.getElementById(
        "runIntegrityCheck"
    );

const result =
    document.getElementById(
        "integrityResult"
    );


// ============================================
// RUN CHECK
// ============================================

runButton.addEventListener(
    "click",
    function () {

        try {

            const startDate =
                fromDate.value;

            const endDate =
                toDate.value;


            if (!startDate) {

                throw new Error(
                    "Start date is required."
                );

            }


            if (!endDate) {

                throw new Error(
                    "End date is required."
                );

            }


            const report =
                runAccountingIntegrityCheck({

                    startDate,

                    endDate

                });


            renderResult(
                report
            );

        }
        catch (error) {

            alert(
                error.message
            );

        }

    }
);


// ============================================
// RENDER
// ============================================

function renderResult(
    report
) {

    result.innerHTML = `

        <h3>
            ${
                report.passed
                    ? "Accounting System Passed"
                    : "Accounting Exceptions Found"
            }
        </h3>


        <table>

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

                ${
                    report.checks
                        .map(
                            check => `

                                <tr>

                                    <td>
                                        ${check.name}
                                    </td>

                                    <td>
                                        ${
                                            check.passed
                                                ? "PASSED"
                                                : "FAILED"
                                        }
                                    </td>

                                    <td>
                                        ${formatCurrency(
                                            check.difference
                                        )}
                                    </td>

                                </tr>

                            `
                        )
                        .join("")
                }

            </tbody>

        </table>

    `;

}


// ============================================
// CURRENCY
// ============================================

function formatCurrency(
    amount
) {

    return Number(
        amount || 0
    ).toLocaleString(
        "en-NG",
        {
            style: "currency",
            currency: "NGN"
        }
    );

}