const pdfreader = require('pdfreader');
const axios = require('axios');
const UserDetails = require('../models/userDetailsModel');
const TransactionHistory = require('../models/transactionHistoryModel');

class ExtractionService{
    async  extractTextFromPdf(file){
        try{
            const text = await this.readPDF(file);
            return this.parseBankStatement(text);
        }catch(error){
            throw new Error('error extracting text from pdf'+ error.message);
        }
    }
    // async extractTextFromPdf(file){
    //     try{
    //         const dataBuffer = file.buffer;
    //         const data = await pdfParse(dataBuffer);

    //         const extractedData = this.parsePDFData(data.text);
    //         return extractedData;

    //     }catch(error){
    //         throw new Error('Error extracting text from pdf' + error.message);
    //     }
    // }

    async readPDF(file){
        return new Promise((resolve, reject)=>{
            let extractedText = '';
            new pdfreader.PdfReader().parseBuffer(file.buffer, (err, item) =>{
                if(err) reject(err);
                else if(!item) resolve(extractedText);
                else if(item.text) extractedText += item.text + " ";
            });
        });
    }
    //modify this part 
    async parseBankStatement(text){
        const lines = text.split('\n');

        const customerDetails = {
            customerId: this.extractField(lines, /Customer ID:\s+(\S+)/),
            customerName: this.extractField(lines, /Name:\s+(.+)/),
            bankName: this.extractField(lines, /Bank Name:\s+(.+)/),
            ifscCode: this.extractField(lines, /IFSC Code:\s+(\S+)/),
            pan: this.extractField(lines, /PAN:\s+(\S+)/),
        }   
       

        const transactions = [];
        const transactionRegex = /(\d{2}-\d{2}-\d{4})\s+(\d+)?\s+([\w\s]+)\s+([\d,.]+)?\s+([\d,.]+)?\s+([\d,.]+)\s+([\w\s]+)/;

        for (let line of lines) {
            const match = line.match(transactionRegex);
            if (match) {
                transactions.push({
                    transactionDate: new Date(match[1]),
                    chqNo: match[2] || null,
                    particulars: match[3].trim(),
                    debit: match[4] ? parseFloat(match[4].replace(/,/g, "")) : null,
                    credit: match[5] ? parseFloat(match[5].replace(/,/g, "")) : null,
                    balance: parseFloat(match[6].replace(/,/g, "")),
                    initBr: match[7].trim(),
                });
            }
        }

        return { customerDetails, transactions };
    }

    async saveExtractedData(extractedData){
        try{
            //check if the table is already present in the database
            const existingTable = await UserDetails.findOne({table: extractedData.tableName});
            if(!existingTable){
                
            }
            const user = await UserDetails.upsert(extractedData, customerDetails);
            for(const transaction of extractedData.transactions){
                await TransactionHistory.upsert({...transaction, customerId: extractedData.customerDetails.customerId});
            }

            return {user, transactions: extractedData.transactions};

        }catch(error){
            throw new Error({message: 'Error saving extracted data'+ error.message});
        }
    }

    // async extractUsingGemini(file) {
    //     try {
    //         const response = await axios.post("https://gemini-api-url", {
    //             document: file.buffer.toString("base64"), // Convert PDF to Base64
    //             model: "gemini-pro"
    //         }, {
    //             headers: { Authorization: `Bearer YOUR_GEMINI_API_KEY` }
    //         });

    //         return this.parseBankStatement(response.data.text);
    //     } catch (error) {
    //         throw new Error("Gemini API extraction failed: " + error.message);
    //     }
    // }
}


