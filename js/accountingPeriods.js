// js/accountingPeriods.js

const PERIOD_KEY = "accountingPeriods";


// ============================================
// GET PERIODS
// ============================================

export function getAccountingPeriods() {

    return JSON.parse(
        localStorage.getItem(PERIOD_KEY)
    ) || [];

}


// ============================================
// SAVE PERIODS
// ============================================

function saveAccountingPeriods(periods) {

    localStorage.setItem(
        PERIOD_KEY,
        JSON.stringify(periods)
    );

}


// ============================================
// GET MONTH KEY
// ============================================

export function getPeriodKey(date) {

    if (!date) {
        throw new Error(
            "Date is required."
        );
    }

    return date.slice(0, 7);

}


// ============================================
// GET PERIOD
// ============================================

export function getAccountingPeriod(date) {

    const periodKey =
        getPeriodKey(date);

    return getAccountingPeriods()
        .find(
            period =>
                period.period ===
                periodKey
        );

}


// ============================================
// CHECK WHETHER PERIOD IS CLOSED
// ============================================

export function isPeriodClosed(date) {

    const period =
        getAccountingPeriod(date);

    return Boolean(
        period &&
        period.status === "closed"
    );

}


// ============================================
// ENSURE PERIOD IS OPEN
// ============================================

export function ensurePeriodOpen(date) {

    if (!date) {

        throw new Error(
            "Transaction date is required."
        );

    }

    if (isPeriodClosed(date)) {

        const period =
            getAccountingPeriod(date);

        throw new Error(
            `Accounting period ${period.period} is closed.`
        );

    }

    return true;

}


// ============================================
// OPEN PERIOD
// ============================================

export function openAccountingPeriod(
    period,
    description = ""
) {

    if (!/^\d{4}-\d{2}$/.test(period)) {

        throw new Error(
            "Period must use YYYY-MM format."
        );

    }

    const periods =
        getAccountingPeriods();

    const existing =
        periods.find(
            item =>
                item.period === period
        );

    if (existing) {

        existing.status = "open";

        existing.description =
            description ||
            existing.description;

        existing.updatedAt =
            new Date().toISOString();

    }
    else {

        periods.push({

            period,

            status: "open",

            description,

            createdAt:
                new Date().toISOString()

        });

    }

    saveAccountingPeriods(
        periods
    );

}


// ============================================
// CLOSE PERIOD
// ============================================

export function closeAccountingPeriod(
    period,
    closedBy = "System",
    reason = ""
) {

    if (!/^\d{4}-\d{2}$/.test(period)) {

        throw new Error(
            "Period must use YYYY-MM format."
        );

    }

    const periods =
        getAccountingPeriods();

    let accountingPeriod =
        periods.find(
            item =>
                item.period === period
        );

    if (!accountingPeriod) {

        accountingPeriod = {

            period,

            status: "closed",

            description: "",

            createdAt:
                new Date().toISOString()

        };

        periods.push(
            accountingPeriod
        );

    }

    accountingPeriod.status =
        "closed";

    accountingPeriod.closedAt =
        new Date().toISOString();

    accountingPeriod.closedBy =
        closedBy;

    accountingPeriod.closeReason =
        reason;

    saveAccountingPeriods(
        periods
    );

    return accountingPeriod;

}


// ============================================
// REOPEN PERIOD
// ============================================

export function reopenAccountingPeriod(
    period,
    reopenedBy = "System",
    reason = ""
) {

    const periods =
        getAccountingPeriods();

    const accountingPeriod =
        periods.find(
            item =>
                item.period === period
        );

    if (!accountingPeriod) {

        throw new Error(
            "Accounting period not found."
        );

    }

    accountingPeriod.status =
        "open";

    accountingPeriod.reopenedAt =
        new Date().toISOString();

    accountingPeriod.reopenedBy =
        reopenedBy;

    accountingPeriod.reopenReason =
        reason;

    saveAccountingPeriods(
        periods
    );

    return accountingPeriod;

}