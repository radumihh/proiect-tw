/**
 * Rute pentru gestionarea juriului și asignărilor de evaluatori
 * Toate rutele necesită autentificare ca student
 */
const express = require('express');
const router = express.Router();
const juryController = require('../controllers/juryController');
const authenticate = require('../middleware/authenticate');
const requireRole = require('../middleware/requireRole');

// POST /jury/projects/:id/assign-jury - Asignare aleatore de evaluatori pentru un livrabil
router.post('/projects/:id/assign-jury', authenticate, requireRole('student'), juryController.assignJury.bind(juryController));

// GET /jury/projects - Proiecte asignate evaluatorului curent
router.get('/projects', authenticate, requireRole('student'), juryController.getAssignedProjects.bind(juryController));

module.exports = router;
