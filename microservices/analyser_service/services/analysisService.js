const transactionHistoryModel = require('../../extraction_service/models/transactionHistoryModel');

function calculateMean(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

function calculateMedian(arr) {
    if (arr.length === 0) return 0;
    const sorted = arr.map(Number).sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function calculateMode(arr) {
    if (arr.length === 0) return 0;
    const freqMap = {};
    let maxfreq = 0;
    let mode = null;

    arr.forEach(num => {
        freqMap[num] = (freqMap[num] || 0) + 1;
        if (freqMap[num] > maxfreq) {
            maxfreq = freqMap[num];
            mode = num;
        }
    });

    return mode;
}

exports.analysisService = async (customerId) => {
    try {
        const transactions = await transactionHistoryModel.findAll({
            where: { customerId },
            attributes: ['debit', 'credit', 'balance'] // Ensure correct field names
        });

        if (transactions.length === 0) {
            return { message: "No transactions found for the customer" };
        }

        // Convert to numbers and handle null/undefined
        const debits = transactions.map(transaction => Number(transaction.debit) || 0);
        const credits = transactions.map(transaction => Number(transaction.credit) || 0);
        const balances = transactions.map(transaction => Number(transaction.balance) || 0);

        return {
            credit: {
                mean: calculateMean(credits),
                median: calculateMedian(credits),
                mode: calculateMode(credits)
            },
            debits: {
                mean: calculateMean(debits),
                median: calculateMedian(debits),
                mode: calculateMode(debits)
            },
            balances: {
                mean: calculateMean(balances),
                median: calculateMedian(balances),
                mode: calculateMode(balances)
            }
        };
    } catch (error) {
        console.error('Error calculating transactions statistics', error);
        throw error;
    }
};
