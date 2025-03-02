const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// MongoDB Schema for Bank Statement
const BankStatementSchema = new mongoose.Schema({
  fileName: String,
  customerName: String,
  primaryId: String, // e.g., Account Number
  bankName: String,
  expenses: [{
    date: String,
    description: String,
    amount: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

const BankStatement = mongoose.model('BankStatement', BankStatementSchema);

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Function to parse bank statement
const parseBankStatement = (text) => {
  const lines = text.split('\n');
  let customerName = '';
  let primaryId = '';
  let bankName = '';
  const expenses = [];

  // Regular expressions for common patterns (customize these based on your bank statement format)
  const nameRegex = /(?:customer name|name|account holder):\s*([^\n]+)/i;
  const idRegex = /(?:account number|primary id|a\/c no\.):\s*([\d-]+)/i;
  const bankRegex = /(?:bank|institution):\s*([^\n]+)/i;
  const expenseRegex = /(\d{2}\/\d{2}\/\d{4})\s+([^\d]+)\s+([\d,.]+)/i;

  lines.forEach(line => {
    // Extract customer name
    const nameMatch = line.match(nameRegex);
    if (nameMatch && !customerName) {
      customerName = nameMatch[1].trim();
    }

    // Extract primary ID (account number)
    const idMatch = line.match(idRegex);
    if (idMatch && !primaryId) {
      primaryId = idMatch[1].trim();
    }

    // Extract bank name
    const bankMatch = line.match(bankRegex);
    if (bankMatch && !bankName) {
      bankName = bankMatch[1].trim();
    }

    // Extract expenses
    const expenseMatch = line.match(expenseRegex);
    if (expenseMatch) {
      expenses.push({
        date: expenseMatch[1],
        description: expenseMatch[2].trim(),
        amount: parseFloat(expenseMatch[3].replace(/,/g, ''))
      });
    }
  });

  return {
    customerName: customerName || 'Not found',
    primaryId: primaryId || 'Not found',
    bankName: bankName || 'Not found',
    expenses: expenses.length > 0 ? expenses : []
  };
};

// PDF Processing Route
app.post('/api/analyze-bank-statement', upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // Extract text from PDF
    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);
    const extractedText = pdfData.text;

    // Parse the bank statement
    const parsedData = parseBankStatement(extractedText);

    // Store in database
    const statement = new BankStatement({
      fileName: req.file.originalname,
      customerName: parsedData.customerName,
      primaryId: parsedData.primaryId,
      bankName: parsedData.bankName,
      expenses: parsedData.expenses
    });

    await statement.save();

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: 'Bank statement processed successfully',
      data: {
        fileName: req.file.originalname,
        ...parsedData
      }
    });
  } catch (error) {
    console.error('Error processing bank statement:', error);
    res.status(500).json({ error: 'Failed to process bank statement' });
  }
});

// Get all processed statements
app.get('/api/bank-statements', async (req, res) => {
  try {
    const statements = await BankStatement.find().sort({ createdAt: -1 });
    res.status(200).json(statements);
  } catch (error) {
    console.error('Error fetching statements:', error);
    res.status(500).json({ error: 'Failed to fetch statements' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});