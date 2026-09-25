// js/companyAgingTable.js

import {
    getCompanyReceivablesAging,
    getCompanyPayablesAging
} from "./arApAging.js";


// ============================================
// ELEMENTS
// ============================================

const typeSelect =
    document.getElementById(
        "companyAgingType"
    );

const dateInput =
    document.getElementById(
        "companyAgingDate"
    );

const calculateButton =
    document.getElementById(
        "calculateCompanyAging"
    );

const resetButton =
    document.getElementById(
        "resetCompanyAging"
    );

const printButton =
    document.getElementById(
        "printCompanyAging"
    );

const body =
    document.getElementById(
        "companyAgingBody"
    );

const totalRow =
    document.getElementById(
        "companyAgingTotalRow"
    );


// ============================================
// CURRENCY
// ============================================

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


// ============================================
// RENDER
// ============================================

function render(
    rows
) {

    body.innerHTML = "";


    const totals = {

        current: 0,

        days1to30: 0,

        days31to60: 0,

        days61to90: 0,

        days91to120: 0,

        days120Plus: 0,

        total: 0

    };


    rows.forEach(
        row => {

            totals.current +=
                row.current;

            totals.days1to30 +=
                row.days1to30;

            totals.days31to60 +=
                row.days31to60;

            totals.days61to90 +=
                row.days61to90;

            totals.days91to120 +=
                row.days91to120;

            totals.days120Plus +=
                row.days120Plus;

            totals.total +=
                row.total;


            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>
                    ${row.customerName || row.supplierName}
                </td>

                <td>
                    ${formatCurrency(
                        row.current
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        row.days1to30
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        row.days31to60
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        row.days61to90
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        row.days91to120
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        row.days120Plus
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        row.total
                    )}
                </td>

            `;


            body.appendChild(
                tr
            );

        }
    );


    totalRow.innerHTML = `

        <th>
            TOTAL
        </th>

        <th>
            ${formatCurrency(
                totals.current
            )}
        </th>

        <th>
            ${formatCurrency(
                totals.days1to30
            )}
        </th>

        <th>
            ${formatCurrency(
                totals.days31to60
            )}
        </th>

        <th>
            ${formatCurrency(
                totals.days61to90
            )}
        </th>

        <th>
            ${formatCurrency(
                totals.days91to120
            )}
        </th>

        <th>
            ${formatCurrency(
                totals.days120Plus
            )}
        </th>

        <th>
            ${formatCurrency(
                totals.total
            )}
        </th>

    `;

}


// ============================================
// CALCULATE
// ============================================

calculateButton.addEventListener(
    "click",
    function () {

        try {

            let rows;


            if (
                typeSelect.value ===
                "receivable"
            ) {

                rows =
                    getCompanyReceivablesAging(
                        dateInput.value
                    );

            }
            else {

                rows =
                    getCompanyPayablesAging(
                        dateInput.value
                    );

            }


            render(
                rows
            );

        }

        catch (error) {

            console.error(
                error
            );

            alert(
                error.message
            );

        }

    }
);


// ============================================
// TYPE CHANGE
// ============================================

typeSelect.addEventListener(
    "change",
    function () {

        body.innerHTML =
            "";

        totalRow.innerHTML =
            "";

    }
);


// ============================================
// RESET
// ============================================

resetButton.addEventListener(
    "click",
    function () {

        typeSelect.value =
            "receivable";

        dateInput.value =
            "";

        body.innerHTML =
            "";

        totalRow.innerHTML =
            "";

    }
);


// ============================================
// PRINT
// ============================================

printButton.addEventListener(
    "click",
    function () {

        window.print();

    }
);