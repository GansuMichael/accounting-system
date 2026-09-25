const transactionRules = {
    revenue: {
        label: "Revenue / Sale",

        debitAccounts: [
            "1010",
            "1020",
            "1030"
        ],

        creditAccounts: [
            "4010",
            "4020"
        ]
    },

    expense: {
        label: "Expense",

        debitAccounts: [
            "5010",
            "5020",
            "5030",
            "5040",
            "5050",
            "5060",
            "5070"
        ],

        creditAccounts: [
            "1010",
            "1020",
            "2010"
        ]
    },

    inventory_purchase: {
        label: "Inventory Purchase",

        debitAccounts: [
            "1040"
        ],

        creditAccounts: [
            "1010",
            "1020",
            "2010"
        ]
    },

    asset_purchase: {
        label: "Asset Purchase",

        debitAccounts: [
            "1500",
            "1510",
            "1520"
        ],

        creditAccounts: [
            "1010",
            "1020",
            "2010",
            "2020"
        ]
    },

    customer_payment: {
        label: "Customer Payment",

        debitAccounts: [
            "1010",
            "1020"
        ],

        creditAccounts: [
            "1030"
        ]
    },

    supplier_payment: {
        label: "Supplier Payment",

        debitAccounts: [
            "2010"
        ],

        creditAccounts: [
            "1010",
            "1020"
        ]
    },

    customer_deposit: {
        label: "Customer Deposit",

        debitAccounts: [
            "1010",
            "1020"
        ],

        creditAccounts: [
            "2030"
        ]
    },

    loan_received: {
        label: "Loan Received",

        debitAccounts: [
            "1010",
            "1020"
        ],

        creditAccounts: [
            "2020"
        ]
    },

    loan_repayment: {
        label: "Loan Repayment",

        debitAccounts: [
            "2020"
        ],

        creditAccounts: [
            "1010",
            "1020"
        ]
    },

    owner_investment: {
        label: "Owner Investment",

        debitAccounts: [
            "1010",
            "1020"
        ],

        creditAccounts: [
            "3000"
        ]
    },

    owner_drawing: {
        label: "Owner Drawing",

        debitAccounts: [
            "3030"
        ],

        creditAccounts: [
            "1010",
            "1020"
        ]
    }
};

export function getTransactionRule(type) {
    return transactionRules[type] || null;
}

export function getTransactionRules() {
    return transactionRules;
}