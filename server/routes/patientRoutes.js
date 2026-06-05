const express = require('express');
const router = express.Router();
const { getPatients, addPatient, getPatient, updatePatient, getPatientHistory, deletePatient } = require('../controllers/patientController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',              protect, getPatients);
router.post('/add',          protect, addPatient);
router.get('/:id',           protect, getPatient);
router.put('/:id',           protect, updatePatient);
router.get('/:id/history',   protect, getPatientHistory);
router.delete('/:id',        protect, adminOnly, deletePatient);

module.exports = router;
