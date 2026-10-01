// js/accounts.js

export const accounts = [
    // ASSETS
    {
        code: "1010",
        name: "Cash",
        type: "asset"
    },
    {
        code: "1020",
        name: "Bank",
        type: "asset"
    },
    {
        code: "1030",
        name: "Accounts Receivable",
        type: "asset"
    },
    {
        code: "1040",
        name: "Inventory",
        type: "asset"
    },
    {
        code: "1500",
        name: "Machinery",
        type: "asset"
    },
    {
        code: "1510",
        name: "Vehicles",
        type: "asset"
    },
    {
        code: "1520",
        name: "Buildings",
        type: "asset"
    },

    // CONTRA ASSETS
    {
        code: "1590",
        name: "Accumulated Depreciation",
        type: "contra_asset"
    },

    // LIABILITIES
    {
        code: "2010",
        name: "Accounts Payable",
        type: "liability"
    },
    {
        code: "2020",
        name: "Loans Payable",
        type: "liability"
    },
    {
        code: "2030",
        name: "Deferred Revenue",
        type: "liability"
    },

    // EQUITY
    {
        code: "3000",
        name: "Owner's Capital",
        type: "equity"
    },
    {
        code: "3020",
        name: "Retained Earnings",
        type: "equity"
    },
    {
        code: "3030",
        name: "Owner's Drawings",
        type: "equity"
    },

    // REVENUE
    {
        code: "4010",
        name: "Sales Revenue",
        type: "revenue"
    },
    {
        code: "4020",
        name: "Service Revenue",
        type: "revenue"
    },

    // EXPENSES
    {
        code: "5010",
        name: "Feed Expense",
        type: "expense"
    },
    {
        code: "5020",
        name: "Salary Expense",
        type: "expense"
    },
    {
        code: "5030",
        name: "Rent Expense",
        type: "expense"
    },
    {
        code: "5040",
        name: "Utilities Expense",
        type: "expense"
    },
    {
        code: "5050",
        name: "Depreciation Expense",
        type: "expense"
    },
    {
        code: "5060",
        name: "Transport Expense",
        type: "expense"
    },
    {
        code: "1004",
        name: "Finished Feed Inventory",
        type: "asset"
    },
    {
        code: "1005",
        name: "Equipment",
        type: "asset"
    },
    {
        code: "1007",
        name: "Raw Material Inventory",
        type: "asset"
    },
    {
        code: "1008",
        name: "Work In Progress",
        type: "asset"
    },
    {
        code: "2003",
        name: "Wages Payable",
        type: "liability"
    },
    {
        code: "3002",
        name: "Additional Capital",
        type: "equity"
    },
    {
        code: "5005",
        name: "Admin Expenses",
        type: "expense"
    },
    {
        code: "5006",
        name: "Marketing Expenses",
        type: "expense"
    },
    {
        code: "5007",
        name: "Internet Expenses",
        type: "expense"
    },
    {
        code: "5008",
        name: "Office Rent",
        type: "expense"
    },
    {
        code: "5009",
        name: "Bank Charges",
        type: "expense"
    },
    {
        code: "5003",
        name: "Fuel Expenses",
        type: "expense"
    },
    {
        code: "5013",
        name: "Office Supplies",
        type: "expense"
    },
    {
        code: "5014",
        name: "Manufacturing Overhead",
        type: "expense"
    },
    {
        code: "5012",
        name: "Office Generator",
        type: "expense"
    },
    {
        code: "5070",
        name: "Other Expenses",
        type: "expense"
    },
    {
        code: "5080",
        name: "Cost of Goods Sold",
        type: "expense"
    }
];

export function getAccountByCode(code) {
    return accounts.find(account => account.code === code);
}

export function getAccountByName(name) {
    return accounts.find(account => account.name === name);
}