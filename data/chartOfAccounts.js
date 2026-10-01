// data/chartOfAccounts.js

export const chartOfAccounts = [

    // =====================
    // ASSETS (1000)
    // =====================

    {
        code: "1010",
        name: "Cash",
        type: "Asset",
        category: "Current Asset",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    {
        code: "1020",
        name: "Bank",
        type: "Asset",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    {
        code: "1030",
        name: "Accounts Receivable",
        type: "Asset",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    {
        code: "1004",
        name: "Finished Goods Inventory",
        type: "Asset",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    {
        code: "1005",
        name: "Equipment",
        type: "Asset",
        normalBalance: "Debit",
        cashFlowCategory: "Investing"
    },

    {
        code: "1590",
        name: "Accumulated Depreciation",
        type: "Contra Asset",
        normalBalance: "Credit",
        cashFlowCategory: "Investing"
    },

    {
        code: "1007",
        name: "Raw Materials Inventory",
        type: "Asset",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    {
        code: "1008",
        name: "Work in Process Inventory",
        type: "Asset",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    {
        code: "1040",
        name: "Inventory",
        type: "Asset",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    // =====================
    // LIABILITIES (2000)
    // =====================

    {
        code: "2010",
        name: "Accounts Payable",
        type: "Liability",
        normalBalance: "Credit",
        cashFlowCategory: "Operating"
    },

    {
        code: "2020",
        name: "Loan Payable",
        type: "Liability",
        normalBalance: "Credit",
        cashFlowCategory: "Financing"
    },

    {
        code: "2003",
        name: "Wages Payable",
        type: "Liability",
        normalBalance: "Credit",
        cashFlowCategory: "Operating"
    },

    {
        code: "2030",
        name: "Deferred Revenue",
        type: "Liability",
        normalBalance: "Credit",
        cashFlowCategory: "Operating"
    },

    // =====================
    // EQUITY (3000)
    // =====================

    {
        code: "3000",
        name: "Owner Capital",
        type: "Equity",
        normalBalance: "Credit",
        cashFlowCategory: "Financing"
    },

    {
        code: "3002",
        name: "Additional Capital",
        type: "Equity",
        normalBalance: "Credit",
        cashFlowCategory: "Financing"
    },

    {
        code: "3030",
        name: "Owner Drawings / Dividends",
        type: "Equity",
        normalBalance: "Debit",
        cashFlowCategory: "Financing"
    },

    {
        code: "3020",
        name: "Retained Earnings",
        type: "Equity",
        normalBalance: "Credit",
        cashFlowCategory: "Financing"
    },

    {
        code: "3005",
        name: "Current Year Earnings",
        type: "Equity",
        normalBalance: "Credit",
        cashFlowCategory: "Financing"
    },

    {
        code: "3006",
        name: "Income Summary",
        type: "Equity",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    // =====================
    // REVENUE (4000)
    // =====================

    {
        code: "4010",
        name: "Sales Revenue",
        type: "Revenue",
        normalBalance: "Credit",
        cashFlowCategory: "Operating"
    },

    {
        code: "4020",
        name: "Service Revenue",
        type: "Revenue",
        normalBalance: "Credit",
        cashFlowCategory: "Operating"
    },

    // =====================
    // EXPENSES (5000)
    // =====================

    {
        code: "5020",
        name: "Salary Expense",
        type: "Expense",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },


    {
        code: "5080",
        name: "Cost of Good sold",
        type: "Expense",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    {
        code: "5003",
        name: "Fuel",
        type: "Expense",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    {
        code: "5050",
        name: "Depreciation Expense",
        type: "Expense",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    {
        code: "5005",
        name: "Admin Expense",
        type: "Expense",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    {
        code: "5006",
        name: "Marketing Expense",
        type: "Expense",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    {
        code: "5007",
        name: "Internet Expense",
        type: "Expense",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    {
        code: "5008",
        name: "Office Rent Expense",
        type: "Expense",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    {
        code: "5060",
        name: "Transportation Expense",
        type: "Expense",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    {
        code: "5009",
        name: "Bank Charges Expense",
        type: "Expense",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    {
        code: "5040",
        name: "Utility Expense",
        type: "Expense",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    {
        code: "5012",
        name: "Office Generator Expense",
        type: "Expense",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    {
        code: "5013",
        name: "Office Supplies Expense",
        type: "Expense",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    },

    {
        code: "5014",
        name: "Manufacturing Overhead Expense",
        type: "Expense",
        normalBalance: "Debit",
        cashFlowCategory: "Operating"
    }

];