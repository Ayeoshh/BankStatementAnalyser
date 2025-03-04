const fs = require("fs");
const pdf = require("pdf-parse");

const pdfPath = "statement.pdf"; // Ensure it's unlocked before parsing

// Function to extract structured data
async function extractTransactions(pdfPath) {
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdf(dataBuffer);
    const text = pdfData.text;

    console.log("Extracted PDF Text:\n", text); // Debugging output

    // Define regex for transactions (adjust based on your statement format)
    const transactionRegex = /(\d{2}\/\d{2}\/\d{4})\s+([\w\s]+)\s+([-+]?\d+,\d+\.\d{2})\s+(\d+,\d+\.\d{2})/g;
    
    let transactions = [];
    let match;
    
    while ((match = transactionRegex.exec(text)) !== null) {
        transactions.push({
            date: match[1], // Extracted date
            description: match[2].trim(), // Transaction description
            amount: match[3], // Debit or Credit amount
            balance: match[4] // Balance after transaction
        });
    }

    // Save to JSON
    fs.writeFileSync("transactions.json", JSON.stringify(transactions, null, 2));
    fs.writeFileSync("trans.txt", text);
    console.log("Transactions saved to transactions.json");
}

// Run the extraction
extractTransactions(pdfPath);

// const fs = require("fs");
// const PDFParser = require("pdf2json");

// const pdfPath = "statement.pdf";

// const pdfParser = new PDFParser();

// pdfParser.on("pdfParser_dataReady", (pdfData) => {
//     fs.writeFileSync("parsed_output.json", JSON.stringify(pdfData, null, 2));
//     console.log("Parsed data saved to parsed_output.json");
// });

// pdfParser.loadPDF(pdfPath);

