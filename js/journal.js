// js/journal.js
import { generateId } from "./id.js";

export function createJournalEntry({
    date,
    description,
    reference,
    lines
}) {

    const totalDebit = lines.reduce(
        (total, line) => total + (line.debit || 0),
        0
    );

    const totalCredit = lines.reduce(
        (total, line) => total + (line.credit || 0),
        0
    );

    if (totalDebit !== totalCredit) {
        throw new Error(
            "Journal entry is not balanced."
        );
    }

    return {
        id: generateId("journal"),

        date,

        description,

        reference,

        lines,

        totalDebit,

        totalCredit,

        createdAt: new Date().toISOString()
    };
}