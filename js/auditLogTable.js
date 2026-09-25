// js/auditLogTable.js

import {
    getAuditLogs,
    createAuditLog
} from "./auditLog.js";


// ============================================
// ELEMENTS
// ============================================

const body =
    document.getElementById(
        "auditLogBody"
    );

const refreshButton =
    document.getElementById(
        "refreshAuditLogs"
    );

const printButton =
    document.getElementById(
        "printAuditLogs"
    );


// ============================================
// FORMAT DATE
// ============================================

function formatDate(
    timestamp
) {

    return new Date(
        timestamp
    ).toLocaleString(
        "en-NG"
    );

}


// ============================================
// FORMAT JSON
// ============================================

function formatValue(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return JSON.stringify(
        value
    );

}


// ============================================
// RENDER
// ============================================

function render() {

    const logs =
        getAuditLogs();


    body.innerHTML =
        "";


    if (
        logs.length === 0
    ) {

        body.innerHTML = `

            <tr>

                <td colspan="8">

                    No audit records found.

                </td>

            </tr>

        `;

        return;

    }


    [...logs]
        .reverse()
        .forEach(
            log => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${formatDate(
                            log.timestamp
                        )}
                    </td>

                    <td>
                        ${log.user}
                    </td>

                    <td>
                        ${log.action}
                    </td>

                    <td>
                        ${log.entityType}
                    </td>

                    <td>
                        ${log.entityId}
                    </td>

                    <td>
                        ${formatValue(
                            log.oldValue
                        )}
                    </td>

                    <td>
                        ${formatValue(
                            log.newValue
                        )}
                    </td>

                    <td>
                        ${log.reason}
                    </td>

                `;


                body.appendChild(
                    row
                );

            }
        );

}


// ============================================
// EVENTS
// ============================================

refreshButton.addEventListener(
    "click",
    render
);


printButton.addEventListener(
    "click",
    function () {

        window.print();

    }
);


render();