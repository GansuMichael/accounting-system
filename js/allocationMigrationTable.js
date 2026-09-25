// js/allocationMigrationTable.js

import {
    getLegacyCustomerPayments,
    getLegacySupplierPayments,
    migrateCustomerPayment,
    migrateSupplierPayment
} from "./allocationMigration.js";


// ============================================
// ELEMENTS
// ============================================

const typeSelect =
    document.getElementById(
        "migrationType"
    );

const loadButton =
    document.getElementById(
        "loadLegacyAllocations"
    );

const migrateButton =
    document.getElementById(
        "migrateSelectedAllocations"
    );

const body =
    document.getElementById(
        "migrationBody"
    );

const resultDisplay =
    document.getElementById(
        "migrationResult"
    );


// ============================================
// LOAD
// ============================================

function loadPayments() {

    body.innerHTML = "";

    resultDisplay.textContent =
        "";


    let payments;


    if (
        typeSelect.value ===
        "customer"
    ) {

        payments =
            getLegacyCustomerPayments();

    }
    else {

        payments =
            getLegacySupplierPayments();

    }


    if (
        payments.length === 0
    ) {

        body.innerHTML = `

            <tr>

                <td colspan="8">

                    No legacy allocations
                    found.

                </td>

            </tr>

        `;

        return;

    }


    payments.forEach(
        payment => {

            const row =
                document.createElement(
                    "tr"
                );


            const party =
                payment.customerName ||
                payment.supplierName;


            const documentId =
                payment.invoiceId ||
                payment.billId;


            row.innerHTML = `

                <td>

                    <input
                        type="checkbox"
                        class="migrationCheck"
                        data-id="${payment.id}"
                    >

                </td>

                <td>
                    ${payment.date}
                </td>

                <td>
                    ${party || ""}
                </td>

                <td>
                    ${payment.reference}
                </td>

                <td>
                    ${documentId}
                </td>

                <td>
                    ${Number(
                        payment.amount || 0
                    ).toLocaleString(
                        "en-NG",
                        {
                            style: "currency",
                            currency: "NGN"
                        }
                    )}
                </td>

                <td>
                    ${Number(
                        payment.allocatedAmount || 0
                    ).toLocaleString(
                        "en-NG",
                        {
                            style: "currency",
                            currency: "NGN"
                        }
                    )}
                </td>

                <td>
                    ${Number(
                        payment.unallocatedAmount || 0
                    ).toLocaleString(
                        "en-NG",
                        {
                            style: "currency",
                            currency: "NGN"
                        }
                    )}
                </td>

            `;


            body.appendChild(
                row
            );

        }
    );

}


// ============================================
// LOAD BUTTON
// ============================================

loadButton.addEventListener(
    "click",
    loadPayments
);


// ============================================
// MIGRATE SELECTED
// ============================================

migrateButton.addEventListener(
    "click",
    function () {

        const selected =
            [
                ...document.querySelectorAll(
                    ".migrationCheck:checked"
                )
            ];


        if (
            selected.length === 0
        ) {

            alert(
                "Select at least one payment."
            );

            return;

        }


        let migrated = 0;

        let failed = 0;


        selected.forEach(
            checkbox => {

                try {

                    if (
                        typeSelect.value ===
                        "customer"
                    ) {

                        migrateCustomerPayment(
                            checkbox.dataset.id
                        );

                    }
                    else {

                        migrateSupplierPayment(
                            checkbox.dataset.id
                        );

                    }

                    migrated++;

                }

                catch (error) {

                    console.error(
                        error
                    );

                    failed++;

                }

            }
        );


        resultDisplay.textContent =
            `Migrated: ${migrated} | Failed: ${failed}`;


        loadPayments();

    }
);