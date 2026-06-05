const express = require('express');
const router = express.Router();
const { getClinic, updateClinic, getAvailableSlots } = require('../controllers/clinicController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',              protect, getClinic);
router.put('/update',        protect, adminOnly, updateClinic);
router.get('/slots/:date',   protect, getAvailableSlots);

module.exports = router;
