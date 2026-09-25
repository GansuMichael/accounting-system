import {
    getTransactions,
    saveTransaction
} from "./storage.js";


// ------------------------------------
// STORAGE
// ------------------------------------

const CUSTOMER_KEY = "customers";
const SUPPLIER_KEY = "suppliers";


// ------------------------------------
// GENERATE ID
// ------------------------------------

function generateId(prefix) {

    return `${prefix}-${Date.now()}-${Math.floor(
        Math.random() * 10000
    )}`;

}


// ------------------------------------
// CUSTOMERS
// ------------------------------------

export function getCustomers() {

    return JSON.parse(
        localStorage.getItem(CUSTOMER_KEY)
    ) || [];

}


export function saveCustomer(customer) {

    const customers =
        getCustomers();

    customers.push(customer);

    localStorage.setItem(
        CUSTOMER_KEY,
        JSON.stringify(customers)
    );

    return customer;

}


export function createCustomer({
    name,
    phone = "",
    email = "",
    address = ""
}) {

    if (!name || !name.trim()) {

        throw new Error(
            "Customer name is required."
        );

    }


    const customer = {

        id: generateId("CUS"),

        name: name.trim(),

        phone,

        email,

        address,

        createdAt:
            new Date().toISOString()

    };


    return saveCustomer(
        customer
    );

}


// ------------------------------------
// SUPPLIERS
// ------------------------------------

export function getSuppliers() {

    return JSON.parse(
        localStorage.getItem(SUPPLIER_KEY)
    ) || [];

}


export function saveSupplier(supplier) {

    const suppliers =
        getSuppliers();

    suppliers.push(supplier);

    localStorage.setItem(
        SUPPLIER_KEY,
        JSON.stringify(suppliers)
    );

    return supplier;

}


export function createSupplier({
    name,
    phone = "",
    email = "",
    address = ""
}) {

    if (!name || !name.trim()) {

        throw new Error(
            "Supplier name is required."
        );

    }


    const supplier = {

        id: generateId("SUP"),

        name: name.trim(),

        phone,

        email,

        address,

        createdAt:
            new Date().toISOString()

    };


    return saveSupplier(
        supplier
    );

}


// ------------------------------------
// FIND CUSTOMER
// ------------------------------------

export function getCustomerById(
    customerId
) {

    return getCustomers()
        .find(
            customer =>
                customer.id ===
                customerId
        );

}


// ------------------------------------
// FIND SUPPLIER
// ------------------------------------

export function getSupplierById(
    supplierId
) {

    return getSuppliers()
        .find(
            supplier =>
                supplier.id ===
                supplierId
        );

}