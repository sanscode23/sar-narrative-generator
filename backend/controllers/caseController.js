const Case = require('../models/Case');
const { logAudit } = require('../utils/auditLogger');

// Get all cases
const getCases = async (req, res) => {
  try {
    const cases = await Case.find({}).sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cases' });
  }
};

// Get single case
const getCaseById = async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (caseItem) {
      await logAudit('Viewed Case', 'Case', caseItem._id, req.user._id);
      res.json(caseItem);
    } else {
      res.status(404).json({ message: 'Case not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching case' });
  }
};

// Create a case
const createCase = async (req, res) => {
  try {
    const newCase = new Case({
      ...req.body,
      assignedTo: req.user._id
    });
    const createdCase = await newCase.save();
    await logAudit('Created Case', 'Case', createdCase._id, req.user._id, { initialData: req.body });
    res.status(201).json(createdCase);
  } catch (error) {
    res.status(400).json({ message: 'Invalid case data', error: error.message });
  }
};

// Update a case
const updateCase = async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    
    if (caseItem) {
      const oldStatus = caseItem.status;
      
      caseItem.title = req.body.title || caseItem.title;
      caseItem.description = req.body.description || caseItem.description;
      caseItem.status = req.body.status || caseItem.status;
      
      const updatedCase = await caseItem.save();
      
      await logAudit('Updated Case', 'Case', updatedCase._id, req.user._id, { 
        updates: req.body,
        statusChange: oldStatus !== updatedCase.status ? `${oldStatus} -> ${updatedCase.status}` : null
      });

      res.json(updatedCase);
    } else {
      res.status(404).json({ message: 'Case not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating case' });
  }
};

module.exports = {
  getCases,
  getCaseById,
  createCase,
  updateCase
};
