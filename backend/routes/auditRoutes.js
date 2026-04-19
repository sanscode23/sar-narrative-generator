const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/auditController');
const { protect } = require('../middleware/auth');

router.route('/:entityId').get(protect, getAuditLogs);

module.exports = router;
