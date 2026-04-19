const express = require('express');
const router = express.Router();
const { getCases, getCaseById, createCase, updateCase } = require('../controllers/caseController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getCases)
  .post(protect, createCase);

router.route('/:id')
  .get(protect, getCaseById)
  .put(protect, updateCase);

module.exports = router;
