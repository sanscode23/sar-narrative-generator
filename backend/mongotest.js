require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

const caseSchema = mongoose.Schema({
  caseNumber: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Under Review', 'SAR Generated', 'Closed'], default: 'Open' },
  entitiesInvolved: [{ name: String, role: String, accountNumber: String }],
  transactions: [{
    date: { type: Date },
    amount: { type: Number },
    transactionType: { type: String },
    description: { type: String }
  }]
});

const Case = mongoose.model('CaseTest2', caseSchema);

async function testMongo() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected");

    const newCase = new Case({
      caseNumber: 'CAS-123',
      title: 'Test',
      description: 'Desc',
      transactions: [{
        date: new Date(),
        amount: 9500,
        transactionType: 'Cash Deposit',
        description: 'Branch Deposit'
      }]
    });

    const doc = await newCase.save();
    console.log("Saved successfully:", doc);
  } catch (err) {
    console.log("Error:", err.message);
  } finally {
    mongoose.disconnect();
  }
}

testMongo();
