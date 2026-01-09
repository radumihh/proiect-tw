/**
 * Rute pentru gestionarea notelor acordate de evaluatori
 * Rutele de adaugare/modificare necesită rol de student
 * Ruta de vizualizare sumar necesită rol de profesor
 */
const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const authenticate = require('../middleware/authenticate');
const requireRole = require('../middleware/requireRole');

// POST /grades - Adaugare notă nouă (doar evaluatori asignați)
router.post('/', authenticate, requireRole('student'), gradeController.submitGrade.bind(gradeController));

// PUT /grades/:id - Modificare notă existentă (doar owner-ul notei, înainte de deadline)
router.put('/:id', authenticate, requireRole('student'), gradeController.updateGrade.bind(gradeController));

// GET /grades/projects/:id/summary - Sumar anonim de note pentru un proiect (doar profesori)
router.get('/projects/:id/summary', authenticate, requireRole('professor'), gradeController.getGradesSummary.bind(gradeController));

module.exports = router;
