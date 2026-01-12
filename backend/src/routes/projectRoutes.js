// rute pentru proiecte
// toate necesita auth
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticate = require('../middleware/authenticate');
const requireRole = require('../middleware/requireRole');

// post creeaza proiect, doar studenti
router.post('/', authenticate, requireRole('student'), projectController.createProject.bind(projectController));

// get lista proiecte, filtrate dupa rol
router.get('/', authenticate, projectController.getAllProjects.bind(projectController));

// get detalii proiect
router.get('/:id', authenticate, projectController.getProjectById.bind(projectController));

module.exports = router;
