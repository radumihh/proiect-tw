// rute pentru jurat si asignari
// toate necesita auth student
const express = require('express');
const router = express.Router();
const juryController = require('../controllers/juryController');
const authenticate = require('../middleware/authenticate');
const requireRole = require('../middleware/requireRole');

// post asigna random evaluatori
router.post('/projects/:id/assign-jury', authenticate, requireRole('student'), juryController.assignJury.bind(juryController));

// get proiecte asignate evaluatorului
router.get('/projects', authenticate, requireRole('student'), juryController.getAssignedProjects.bind(juryController));

module.exports = router;
