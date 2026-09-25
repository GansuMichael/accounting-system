// js/auditLog.js

const AUDIT_KEY = "auditLogs";


// ============================================
// GET AUDIT LOGS
// ============================================

export function getAuditLogs() {

    return JSON.parse(
        localStorage.getItem(
            AUDIT_KEY
        )
    ) || [];

}


// ============================================
// SAVE AUDIT LOGS
// ============================================

function saveAuditLogs(
    logs
) {

    localStorage.setItem(
        AUDIT_KEY,
        JSON.stringify(logs)
    );

}


// ============================================
// CREATE AUDIT LOG
// ============================================

export function createAuditLog({

    action,

    entityType,

    entityId,

    description = "",

    oldValue = null,

    newValue = null,

    reason = "",

    user = "System"

}) {

    const logs =
        getAuditLogs();


    const log = {

        id:
            crypto.randomUUID(),

        timestamp:
            new Date()
                .toISOString(),

        user,

        action,

        entityType,

        entityId,

        description,

        oldValue,

        newValue,

        reason

    };


    logs.push(
        log
    );


    saveAuditLogs(
        logs
    );


    return log;

}


// ============================================
// GET ENTITY AUDIT HISTORY
// ============================================

export function getEntityAuditLogs(
    entityType,
    entityId
) {

    return getAuditLogs()
        .filter(
            log =>

                log.entityType ===
                    entityType &&

                log.entityId ===
                    entityId

        );

}


// ============================================
// CLEAR AUDIT LOGS
// ============================================

export function clearAuditLogs() {

    localStorage.removeItem(
        AUDIT_KEY
    );

}