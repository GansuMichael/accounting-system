// js/id.js

export function generateId(prefix = "id") {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return `${prefix}-${crypto.randomUUID()}`;
    }

    // Fallback for older browsers/environments
    return (
        `${prefix}-${Date.now()}-` +
        Math.random().toString(36).substring(2, 10)
    );
}