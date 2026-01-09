/**
 * Rute pentru gestionarea livrabilelor parțiale ale proiectelor
 * Toate rutele necesită autentificare
 */
const express = require('express');
const router = express.Router();
const deliverableController = require('../controllers/deliverableController');
const authenticate = require('../middleware/authenticate');
const requireRole = require('../middleware/requireRole');

// POST /projects/:id/deliverables - Creare livrabil pentru proiect (doar owner-ul proiectului)
router.post('/:id/deliverables', authenticate, requireRole('student'), deliverableController.createDeliverable.bind(deliverableController));

// GET /projects/:id/deliverables - Listare livrabile pentru un proiect
router.get('/:id/deliverables', authenticate, deliverableController.getDeliverables.bind(deliverableController));

module.exports = router;
