const express = require('express');
const { explainProblem, debugCode, reviewCode } = require('../controllers/aiController.js');
const { protect } = require('../middleware/authMiddleware.js');
const router = express.Router();

router.post('/explain', protect, explainProblem);
router.post('/debug', protect, debugCode); // <-- Add this line
router.post('/review', protect, reviewCode); // <-- Add this line

module.exports = router;