import {
    getLedgerEntries
} from "./ledger.js";


const ledgerContainer =
    document.getElementById(
        "ledgerContainer"
    );


const accountSelect =
    document.getElementById(
        "ledgerAccount"
    );


const fromDate =
    document.getElementById(
        "ledgerFromDate"
    );


const toDate =
    document.getElementById(
        "ledgerToDate"
    );


const filterButton =
    document.getElementById(
        "filterLedger"
    );


const resetButton =
    document.getElementById(
        "resetLedger"
    );


const printButton =
    document.getElementById(
        "printLedger"
    );


// ------------------------------------
// FORMAT MONEY
// ------------------------------------

function formatCurrency(amount) {

    return Number(amount).toLocaleString(
        "en-NG",
        {
            style: "currency",
            currency: "NGN"
        }
    );

}


// ------------------------------------
// DISPLAY LEDGER
// ------------------------------------

export function displayLedger() {

    const ledger = getLedgerEntries({
        startDate: fromDate.value,
        endDate: toDate.value
    });


    ledgerContainer.innerHTML = "";


    const selectedAccount =
        accountSelect.value;


    const start =
        fromDate.value;


    const end =
        toDate.value;


    Object.values(ledger).forEach(
        account => {

            // Account filter
            if (
                selectedAccount &&
                account.accountCode !==
                    selectedAccount
            ) {
                return;
            }


            // Date filter
            const entries =
                account.entries.filter(
                    entry => {

                        if (
                            start &&
                            entry.date < start
                        ) {
                            return false;
                        }


                        if (
                            end &&
                            entry.date > end
                        ) {
                            return false;
                        }


                        return true;

                    }
                );


            if (entries.length === 0) {
                return;
            }


            // --------------------------------
            // ACCOUNT TOTALS
            // --------------------------------

            let totalDebit = 0;

            let totalCredit = 0;

            let balance = 0;


            entries.forEach(entry => {

                totalDebit +=
                    entry.debit;

                totalCredit +=
                    entry.credit;

            });


            balance =
                totalDebit -
                totalCredit;


            // --------------------------------
            // CREATE ACCOUNT SECTION
            // --------------------------------

            const accountSection =
                document.createElement(
                    "div"
                );


            accountSection.className =
                "ledger-account";


            accountSection.innerHTML = `

                <h3>

                    ${account.accountCode}
                    -
                    ${account.accountName}

                </h3>


                <table class="ledger-table">

                    <thead>

                        <tr>

                            <th>Date</th>

                            <th>Reference</th>

                            <th>Description</th>

                            <th>Debit</th>

                            <th>Credit</th>

                        </tr>

                    </thead>


                    <tbody>

                        ${entries.map(
                            entry => `

                            <tr>

                                <td>
                                    ${entry.date}
                                </td>

                                <td>
                                    ${entry.reference}
                                </td>

                                <td>
                                    ${entry.description}
                                </td>

                                <td>
                                    ${
                                        entry.debit
                                            ? formatCurrency(
                                                entry.debit
                                              )
                                            : ""
                                    }
                                </td>

                                <td>
                                    ${
                                        entry.credit
                                            ? formatCurrency(
                                                entry.credit
                                              )
                                            : ""
                                    }
                                </td>

                            </tr>

                        `
                        ).join("")}

                    </tbody>


                    <tfoot>

                        <tr>

                            <th colspan="3">
                                Total
                            </th>

                            <th>
                                ${formatCurrency(
                                    totalDebit
                                )}
                            </th>

                            <th>
                                ${formatCurrency(
                                    totalCredit
                                )}
                            </th>

                        </tr>


                        <tr>

                            <th colspan="4">
                                Balance
                            </th>

                            <th>
                                ${formatCurrency(
                                    balance
                                )}
                            </th>

                        </tr>

                    </tfoot>

                </table>

            `;


            ledgerContainer.appendChild(
                accountSection
            );

        }
    );


    if (
        ledgerContainer.innerHTML === ""
    ) {

        ledgerContainer.innerHTML = `
            <p>
                No ledger entries found.
            </p>
        `;

    }

}


// ------------------------------------
// FILTER
// ------------------------------------

filterButton.addEventListener(
    "click",
    displayLedger
);


// ------------------------------------
// RESET
// ------------------------------------

resetButton.addEventListener(
    "click",
    function () {

        accountSelect.value = "";

        fromDate.value = "";

        toDate.value = "";

        displayLedger();

    }
);


// ------------------------------------
// PRINT
// ------------------------------------

printButton.addEventListener(
    "click",
    function () {

        window.print();

    }
);


// ------------------------------------
// INITIAL DISPLAY
// ------------------------------------

displayLedger();