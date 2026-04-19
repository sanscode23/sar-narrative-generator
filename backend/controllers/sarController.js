const SAR = require('../models/SAR');
const Case = require('../models/Case');
const { logAudit } = require('../utils/auditLogger');

// Helper to simulate AI generation
const generateMockNarrative = (caseData) => {
  const { caseNumber, title, description, entitiesInvolved, transactions } = caseData;
  let narrative = `Suspicious Activity Report for Case #${caseNumber} (${title}).\n\n`;
  narrative += `Investigation Background:\n${description}\n\n`;
  
  if (entitiesInvolved && entitiesInvolved.length > 0) {
    narrative += `Entities Involved:\n`;
    entitiesInvolved.forEach(entity => {
      narrative += `- ${entity.name} (Role: ${entity.role}, Acct: ${entity.accountNumber})\n`;
    });
    narrative += `\n`;
  }

  if (transactions && transactions.length > 0) {
    narrative += `Transaction Activity:\n`;
    const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    narrative += `A total of $${totalAmount.toFixed(2)} was transacted across ${transactions.length} suspicious events.\n`;
  }

  narrative += `\nConclusion:\nThe activity detailed above is deemed suspicious due to the rapid execution of transactions and lack of clear economic purpose. Refer to internal system for full logs.`;
  
  return narrative;
};

// Generate SAR
const generateSAR = async (req, res) => {
  try {
    const { caseId } = req.body;
    const caseData = await Case.findById(caseId);
    
    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Check if SAR already exists for case
    let sar = await SAR.findOne({ caseId });
    
    const generatedText = generateMockNarrative(caseData);

    if (sar) {
      sar.narrative = generatedText;
      sar.status = 'Draft';
      await sar.save();
      await logAudit('Regenerated SAR Narrative', 'SAR', sar._id, req.user._id, { method: 'Mock AI' });
    } else {
      sar = await SAR.create({
        caseId,
        narrative: generatedText,
        createdBy: req.user._id
      });
      await logAudit('Generated Initial SAR Narrative', 'SAR', sar._id, req.user._id, { method: 'Mock AI' });
    }

    // Update case status
    caseData.status = 'SAR Generated';
    await caseData.save();

    res.status(201).json(sar);
  } catch (error) {
    res.status(500).json({ message: 'Error generating SAR', error: error.message });
  }
};

// Get SAR by Case ID
const getSARByCaseId = async (req, res) => {
  try {
    const sar = await SAR.findOne({ caseId: req.params.caseId });
    if (sar) {
      await logAudit('Viewed SAR', 'SAR', sar._id, req.user._id);
      res.json(sar);
    } else {
      res.status(404).json({ message: 'SAR not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching SAR' });
  }
};

// Update SAR 
const updateSAR = async (req, res) => {
  try {
    const sar = await SAR.findById(req.params.id);
    if (!sar) {
      return res.status(404).json({ message: 'SAR not found' });
    }

    const { narrative, status } = req.body;
    
    sar.narrative = narrative || sar.narrative;
    sar.status = status || sar.status;
    
    const updatedSar = await sar.save();
    
    await logAudit('Manually Updated SAR', 'SAR', sar._id, req.user._id, { 
      status: sar.status 
    });

    res.json(updatedSar);
  } catch (error) {
    res.status(500).json({ message: 'Error updating SAR', error: error.message });
  }
};

module.exports = {
  generateSAR,
  getSARByCaseId,
  updateSAR
};
