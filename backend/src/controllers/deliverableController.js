const deliverableService = require('../services/deliverableService');

/**
 * Controller pentru gestionarea endpoint-urilor legate de livrabile
 * @class DeliverableController
 */
class DeliverableController {
  /**
   * Handler pentru crearea unui livrabil nou
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async createDeliverable(req, res) {
    try {
      const { id } = req.params;
      const { name, deadline, videoUrl, weight } = req.body;

      if (!name || !deadline) {
        return res.status(400).json({ error: 'Numele și deadline-ul sunt obligatorii' });
      }

      const deliverable = await deliverableService.createDeliverable(
        parseInt(id),
        req.user.id,
        name,
        deadline,
        videoUrl,
        weight
      );

      res.status(201).json({
        message: 'Livrabil creat cu succes',
        deliverable
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Handler pentru obținerea listei de livrabile ale unui proiect
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async getDeliverables(req, res) {
    try {
      const { id } = req.params;

      const deliverables = await deliverableService.getDeliverablesByProject(
        parseInt(id)
      );

      res.json({ deliverables });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new DeliverableController();
