const express = require('express');
const router = express.Router();
const { generateSAR, getSARByCaseId, updateSAR } = require('../controllers/sarController');
const { protect } = require('../middleware/auth');

router.route('/generate').post(protect, generateSAR);
router.route('/case/:caseId').get(protect, getSARByCaseId);
router.route('/:id').put(protect, updateSAR);

module.exports = router;
