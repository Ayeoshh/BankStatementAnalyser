const pdfreader = require('pdfreader');
const axios = require('axios');
const UserDetails = require('../models/userDetailsModel');
const TransactionHistory = require('../models/transactionHistoryModel');
const fs = require("fs");
const pdf = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);


class ExtractionService{
    async  extractTextFromPdf(file){
        try {
            const pdfData = await pdf(pdfFile.buffer);
            return pdfData.text;
        } catch (error) {
            console.error("Error extracting PDF text:", error.message);
            throw new Error("Failed to extract text from PDF");
        }
    }

    async parseDataWithGemini(textData){
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Convert the following bank statement into structured JSON format:\n${textData}`;
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            
            return JSON.parse(response.text());
        } catch (error) {
            console.error("Error processing with Gemini API:", error.message);
            throw new Error("Failed to parse data with Gemini API");
        }
    }

    async saveExtractedData(parsedData){
        try {
            // Step 1: Upsert user details
            const userDetails = await UserDetails.upsert({
                customerId: parsedData.customerId,
                accountHolder: parsedData.accountHolder,
                jointHolder: parsedData.jointHolder,
                address: parsedData.address,
                ifscCode: parsedData.ifscCode,
                micrCode: parsedData.micrCode,
                nomineeRegistered: parsedData.nomineeRegistered,
                mobileNumber: parsedData.mobileNumber,
                emailId: parsedData.emailId,
                pan: parsedData.pan,
                accountType: parsedData.accountType,
                accountNumber: parsedData.accountNumber,
                openingBalance: parsedData.openingBalance,
                closingBalance: parsedData.closingBalance,
                transactionTotalDebit: parsedData.transactionTotalDebit,
                transactionTotalCredit: parsedData.transactionTotalCredit,
                branchAddress: parsedData.branchAddress
            });
        

            console.log("User details saved successfully");

            // Step 2: Insert Transactions
            if (parsedData.transactions && parsedData.transactions.length > 0) {
                const transactions = parsedData.transactions.map(transaction => ({
                    customerId: parsedData.customerId, // Foreign key reference
                    tranDate: transaction.tranDate,
                    chqNo: transaction.chqNo,
                    particulars: transaction.particulars,
                    debit: transaction.debit,       
                    credit: transaction.credit,
                    balance: transaction.balance
                }));

                await TransactionHistory.bulkCreate(transactions, { ignoreDuplicates: true });

                console.log("Transactions saved successfully");
            }
            try {
                const filePath = "parsed_data.json";
                fs.writeFileSync(filePath, JSON.stringify(parsedData, null, 2));
                return {filePath, message: "Data saved successfully"};
            } catch (error) {
                console.error("Error saving parsed data:", error.message);
                throw new Error("Failed to save extracted data");
            }
            // return { message: "Data saved successfully" };

        } catch (error) {
            console.error("Error saving extracted data:", error.message);
            throw new Error("Failed to save extracted data");
        }
        // try {
        //     const filePath = "parsed_data.json";
        //     fs.writeFileSync(filePath, JSON.stringify(parsedData, null, 2));
        //     return filePath;
        // } catch (error) {
        //     console.error("Error saving parsed data:", error.message);
        //     throw new Error("Failed to save extracted data");
        // }
        // try{
        //     //check if the table is already present in the database
        //     const existingTable = await UserDetails.findOne({table: extractedData.tableName});
        //     if(!existingTable){
                
        //     }
        //     const user = await UserDetails.upsert(extractedData, customerDetails);
        //     for(const transaction of extractedData.transactions){
        //         await TransactionHistory.upsert({...transaction, customerId: extractedData.customerDetails.customerId});
        //     }

        //     return {user, transactions: extractedData.transactions};

        // }catch(error){
        //     throw new Error({message: 'Error saving extracted data'+ error.message});
        // }
    }
}


module.exports = ExtractionService;

