const fs = require("fs");
const pdf = require("pdf-parse");
const { PDFDocument } = require("pdf-lib");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

// Replace with your actual Gemini API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Path to the password-protected PDF
const pdfPath = "statement.pdf";
const pdfPassword = "AMAN909896209"; // Replace with actual password

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Function to unlock the PDF
async function unlockPDF(pdfPath, password) {
    try {
        const encryptedPdfBytes = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(encryptedPdfBytes, { password });

        const decryptedPdfBytes = await pdfDoc.save();
        return decryptedPdfBytes;
    } catch (error) {
        console.error("Error unlocking PDF:", error.message);
        return null;
    }
}

// Function to extract text from PDF
async function extractPdfText(decryptedPdfBytes) {
    try {
        const pdfData = await pdf(decryptedPdfBytes);
        return pdfData.text;
    } catch (error) {
        console.error("Error extracting PDF text:", error.message);
        return null;
    }
}

// Function to parse text into JSON using Gemini API
async function parseDataWithGemini(textData) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Convert the following bank statement into structured JSON format:\n${textData}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error processing with Gemini API:", error.message);
        return null;
    }
}

// Main function
async function main() {
    console.log("Unlocking the PDF...");
    const decryptedPdfBytes = await unlockPDF(pdfPath, pdfPassword);

    if (!decryptedPdfBytes) {
        console.log("Failed to unlock the PDF.");
        return;
    }

    console.log("Extracting text...");
    const extractedText = await extractPdfText(decryptedPdfBytes);

    if (!extractedText) {
        console.log("Failed to extract text from the PDF.");
        return;
    }

    console.log("Extracted text:", extractedText);

    console.log("Parsing data with Gemini...");
    const jsonData = await parseDataWithGemini(extractedText);

    if (!jsonData) {
        console.log("Failed to parse data with Gemini API.");
        return;
    }

    fs.writeFileSync("parsed_data.json", jsonData);
    console.log("Parsed data saved to parsed_data.json");
}

// Run the main function
main();
