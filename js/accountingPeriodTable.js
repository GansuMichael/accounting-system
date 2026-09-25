// js/accountingPeriodTable.js

import {
    getAccountingPeriods,
    openAccountingPeriod,
    closeAccountingPeriod,
    reopenAccountingPeriod
} from "./accountingPeriods.js";


const periodInput =
    document.getElementById(
        "accountingPeriod"
    );

const descriptionInput =
    document.getElementById(
        "periodDescription"
    );

const reasonInput =
    document.getElementById(
        "periodReason"
    );

const openButton =
    document.getElementById(
        "openAccountingPeriod"
    );

const closeButton =
    document.getElementById(
        "closeAccountingPeriod"
    );

const reopenButton =
    document.getElementById(
        "reopenAccountingPeriod"
    );

const refreshButton =
    document.getElementById(
        "refreshAccountingPeriods"
    );

const body =
    document.getElementById(
        "accountingPeriodsBody"
    );


// ============================================
// RENDER
// ============================================

function renderPeriods() {

    const periods =
        getAccountingPeriods();

    body.innerHTML = "";

    if (periods.length === 0) {

        body.innerHTML = `

            <tr>

                <td colspan="6">

                    No accounting periods configured.

                </td>

            </tr>

        `;

        return;
    }

    [...periods]
        .sort(
            (a, b) =>
                b.period.localeCompare(
                    a.period
                )
        )
        .forEach(
            period => {

                const row =
                    document.createElement(
                        "tr"
                    );

                row.innerHTML = `

                    <td>
                        ${period.period}
                    </td>

                    <td>
                        ${period.status}
                    </td>

                    <td>
                        ${
                            period.closedAt
                                || ""
                        }
                    </td>

                    <td>
                        ${
                            period.closedBy
                                || ""
                        }
                    </td>

                    <td>
                        ${
                            period.closeReason
                                || ""
                        }
                    </td>

                    <td>
                        ${
                            period.reopenReason
                                || ""
                        }
                    </td>

                `;

                body.appendChild(
                    row
                );

            }
        );

}


// ============================================
// OPEN
// ============================================

openButton.addEventListener(
    "click",
    function () {

        try {

            if (!periodInput.value) {

                throw new Error(
                    "Select an accounting period."
                );

            }

            openAccountingPeriod(
                periodInput.value,
                descriptionInput.value.trim()
            );

            alert(
                "Accounting period opened."
            );

            renderPeriods();

        }
        catch (error) {

            alert(
                error.message
            );

        }

    }
);


// ============================================
// CLOSE
// ============================================

closeButton.addEventListener(
    "click",
    function () {

        try {

            if (!periodInput.value) {

                throw new Error(
                    "Select an accounting period."
                );

            }

            closeAccountingPeriod(

                periodInput.value,

                "System",

                reasonInput.value.trim()

            );

            alert(
                "Accounting period closed."
            );

            renderPeriods();

        }
        catch (error) {

            alert(
                error.message
            );

        }

    }
);


// ============================================
// REOPEN
// ============================================

reopenButton.addEventListener(
    "click",
    function () {

        try {

            if (!periodInput.value) {

                throw new Error(
                    "Select an accounting period."
                );

            }

            if (
                !reasonInput.value.trim()
            ) {

                throw new Error(
                    "Enter a reason for reopening the period."
                );

            }

            reopenAccountingPeriod(

                periodInput.value,

                "System",

                reasonInput.value.trim()

            );

            alert(
                "Accounting period reopened."
            );

            renderPeriods();

        }
        catch (error) {

            alert(
                error.message
            );

        }

    }
);


// ============================================
// REFRESH
// ============================================

refreshButton.addEventListener(
    "click",
    renderPeriods
);


renderPeriods();