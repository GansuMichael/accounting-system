// js/storage.js

const TRANSACTION_KEY = "transactions";

const ASSET_KEY = "assets";

export function getTransactions() {
    return JSON.parse(
        localStorage.getItem(TRANSACTION_KEY)
    ) || [];
}

export function saveTransactions(transactions) {
    localStorage.setItem(
        TRANSACTION_KEY,
        JSON.stringify(transactions)
    );
}

export function saveTransaction(transaction) {

    const transactions = getTransactions();

    transactions.push(transaction);

    saveTransactions(transactions);

    return transaction;
}

export function updateTransaction(id, updatedTransaction) {

    const transactions = getTransactions();

    const index = transactions.findIndex(
        transaction => transaction.id === id
    );

    if (index === -1) {
        throw new Error("Transaction not found");
    }

    transactions[index] = updatedTransaction;

    saveTransactions(transactions);

    return updatedTransaction;
}

export function deleteTransaction(id) {

    const transactions = getTransactions();

    const filteredTransactions = transactions.filter(
        transaction => transaction.id !== id
    );

    saveTransactions(filteredTransactions);

    return filteredTransactions;
}

export function clearTransactions() {

    localStorage.removeItem(TRANSACTION_KEY);
}

// ------------------------------------
// ASSET STORAGE
// ------------------------------------



// GET ASSETS

export function getAssets() {

    return JSON.parse(
        localStorage.getItem(
            ASSET_KEY
        )
    ) || [];

}


// SAVE ASSETS

export function saveAssets(assets) {

    localStorage.setItem(
        ASSET_KEY,
        JSON.stringify(assets)
    );

}


// SAVE ONE ASSET

export function saveAsset(asset) {

    const assets =
        getAssets();

    assets.push(asset);

    saveAssets(assets);

    return asset;

}


// UPDATE ASSET

export function updateAsset(
    id,
    updatedAsset
) {

    const assets =
        getAssets();


    const index =
        assets.findIndex(
            asset =>
                asset.id === id
        );


    if (index === -1) {

        throw new Error(
            "Asset not found."
        );

    }


    assets[index] =
        updatedAsset;


    saveAssets(assets);

    return updatedAsset;

}