// rute pentru deliverables
// toate necesita auth
const express = require('express');
const router = express.Router();
const deliverableController = require('../controllers/deliverableController');
const authenticate = require('../middleware/authenticate');
const requireRole = require('../middleware/requireRole');

// post creare deliverable, doar owner
router.post('/:id/deliverables', authenticate, requireRole('student'), deliverableController.createDeliverable.bind(deliverableController));

// get lista deliverables
router.get('/:id/deliverables', authenticate, deliverableController.getDeliverables.bind(deliverableController));

module.exports = router;
