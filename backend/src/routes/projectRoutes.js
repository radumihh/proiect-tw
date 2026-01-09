/**
 * Rute pentru gestionarea proiectelor
 * Toate rutele necesită autentificare
 */
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticate = require('../middleware/authenticate');
const requireRole = require('../middleware/requireRole');

// POST /projects - Creare proiect nou (doar studenți)
router.post('/', authenticate, requireRole('student'), projectController.createProject.bind(projectController));

// GET /projects - Listare proiecte (filtrate după rol)
router.get('/', authenticate, projectController.getAllProjects.bind(projectController));

// GET /projects/:id - Detalii proiect specific
router.get('/:id', authenticate, projectController.getProjectById.bind(projectController));

module.exports = router;
