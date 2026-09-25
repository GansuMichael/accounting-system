// js/periodCloseValidation.js

import {
    runAccountingControlCenter
} from "./accountingControlCenter.js";


/**
 * Validate an accounting period before closing it.
 */
export function validatePeriodClose({
    startDate,
    endDate
}) {

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

    if (startDate > endDate) {
        throw new Error(
            "Start date cannot be after end date."
        );
    }


    const controlResult =
        runAccountingControlCenter({
            startDate,
            endDate
        });


    const failedChecks =
        controlResult.checks.filter(
            check => !check.passed
        );


    return {

        valid:
            failedChecks.length === 0,

        passed:
            failedChecks.length === 0,

        startDate,

        endDate,

        checks:
            controlResult.checks,

        failedChecks,

        controlResult
    };
}