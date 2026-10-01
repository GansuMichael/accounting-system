const transactionRules = {
    // ------------------------------------
    // REVENUE / SALE
    // ------------------------------------

    revenue: {
        label: "Revenue / Sale",

        debitAccounts: [
            "1010", // Cash
            "1020", // Bank
            "1030"  // Accounts Receivable
        ],

        creditAccounts: [
            "4010", // Sales Revenue
            "4020"  // Service Revenue
        ]
    },

    // ------------------------------------
    // EXPENSE
    // ------------------------------------

    expense: {
        label: "Expense",

        debitAccounts: [
            "5010", // Feed Expense
            "5020", // Salary Expense
            "5030", // Rent Expense
            "5040", // Utilities Expense
            "5050", // Depreciation Expense
            "5060", // Transport Expense
            "5003", // Fuel Expenses
            "5005", // Admin Expenses
            "5006", // Marketing Expenses
            "5007", // Internet Expenses
            "5008", // Office Rent
            "5009", // Bank Charges
            "5012", // Office Generator
            "5013", // Office Supplies
            "5014", // Manufacturing Overhead
            "5070"  // Other Expenses
        ],

        creditAccounts: [
            "1010", // Cash
            "1020", // Bank
            "2010", // Accounts Payable
            "2003"  // Wages Payable
        ]
    },

    // ------------------------------------
    // INVENTORY PURCHASE
    // ------------------------------------

    inventory_purchase: {
        label: "Inventory Purchase",

        debitAccounts: [
            "1040", // Inventory
            "1007", // Raw Material Inventory
            "1004", // Finished Feed Inventory
            "1008"  // Work In Progress
        ],

        creditAccounts: [
            "1010", // Cash
            "1020", // Bank
            "2010"  // Accounts Payable
        ]
    },

    // ------------------------------------
    // COST OF GOODS SOLD
    // ------------------------------------

    inventory_sale_cogs: {
        label: "Cost of Goods Sold",

        debitAccounts: [
            "5080" // Cost of Goods Sold
        ],

        creditAccounts: [
            "1040", // Inventory
            "1004", // Finished Feed Inventory
            "1007", // Raw Material Inventory
            "1008"  // Work In Progress
        ]
    },

    // ------------------------------------
    // ASSET PURCHASE
    // ------------------------------------

    asset_purchase: {
        label: "Asset Purchase",

        debitAccounts: [
            "1005", // Equipment
            "1500", // Machinery
            "1510", // Vehicles
            "1520"  // Buildings
        ],

        creditAccounts: [
            "1010", // Cash
            "1020", // Bank
            "2010", // Accounts Payable
            "2020"  // Loans Payable
        ]
    },

    // ------------------------------------
    // CUSTOMER PAYMENT
    // ------------------------------------

    customer_payment: {
        label: "Customer Payment",

        debitAccounts: [
            "1010", // Cash
            "1020"  // Bank
        ],

        creditAccounts: [
            "1030"  // Accounts Receivable
        ]
    },

    // ------------------------------------
    // SUPPLIER PAYMENT
    // ------------------------------------

    supplier_payment: {
        label: "Supplier Payment",

        debitAccounts: [
            "2010"  // Accounts Payable
        ],

        creditAccounts: [
            "1010", // Cash
            "1020"  // Bank
        ]
    },

    // ------------------------------------
    // CUSTOMER DEPOSIT
    // ------------------------------------

    customer_deposit: {
        label: "Customer Deposit",

        debitAccounts: [
            "1010", // Cash
            "1020"  // Bank
        ],

        creditAccounts: [
            "2030"  // Deferred Revenue
        ]
    },

    // ------------------------------------
    // CUSTOMER DEPOSIT FULFILLMENT
    // ------------------------------------

    customer_deposit_fulfillment: {
        label: "Customer Deposit Fulfillment",

        debitAccounts: [
            "2030"  // Deferred Revenue
        ],

        creditAccounts: [
            "4010", // Sales Revenue
            "4020"  // Service Revenue
        ]
    },

    // ------------------------------------
    // LOAN RECEIVED
    // ------------------------------------

    loan_received: {
        label: "Loan Received",

        debitAccounts: [
            "1010", // Cash
            "1020"  // Bank
        ],

        creditAccounts: [
            "2020"  // Loans Payable
        ]
    },

    // ------------------------------------
    // LOAN REPAYMENT
    // ------------------------------------

    loan_repayment: {
        label: "Loan Repayment",

        debitAccounts: [
            "2020"  // Loans Payable
        ],

        creditAccounts: [
            "1010", // Cash
            "1020"  // Bank
        ]
    },

    // ------------------------------------
    // OWNER INVESTMENT
    // ------------------------------------

    owner_investment: {
        label: "Owner Investment",

        debitAccounts: [
            "1010", // Cash
            "1020"  // Bank
        ],

        creditAccounts: [
            "3000", // Owner's Capital
            "3002"  // Additional Capital
        ]
    },

    // ------------------------------------
    // OWNER DRAWING
    // ------------------------------------

    owner_drawing: {
        label: "Owner Drawing",

        debitAccounts: [
            "3030"  // Owner's Drawings
        ],

        creditAccounts: [
            "1010", // Cash
            "1020"  // Bank
        ]
    }
};

// ------------------------------------
// GET ONE TRANSACTION RULE
// ------------------------------------

export function getTransactionRule(type) {

    return transactionRules[type] || null;

}


// ------------------------------------
// GET ALL TRANSACTION RULES
// ------------------------------------

export function getTransactionRules() {

    return transactionRules;

}