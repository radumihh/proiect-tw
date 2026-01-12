// rute pentru note
// add/modify necesita student, view necesita profesor
const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const authenticate = require('../middleware/authenticate');
const requireRole = require('../middleware/requireRole');

// post nota noua, doar evaluatori asignati
router.post('/', authenticate, requireRole('student'), gradeController.submitGrade.bind(gradeController));

// put modifica nota, doar owner inainte de deadline
router.put('/:id', authenticate, requireRole('student'), gradeController.updateGrade.bind(gradeController));

// get sumar note proiect, anonim
router.get('/projects/:id/summary', authenticate, gradeController.getGradesSummary.bind(gradeController));

module.exports = router;
