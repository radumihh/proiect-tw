const juryService = require('../services/juryService');
const Project = require('../models/Project');

/**
 * Controller pentru gestionarea endpoint-urilor legate de juriu
 * @class JuryController
 */
class JuryController {
  /**
   * Handler pentru asignarea aleatore a juriului unui proiect
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async assignJury(req, res) {
    try {
      const { id } = req.params;
      const { deliverableId, evaluatorCount } = req.body;

      if (!deliverableId) {
        return res.status(400).json({ error: 'deliverableId este obligatoriu' });
      }
      // Verificare: doar proprietarul proiectului poate asigna juriul
      const project = await Project.findByPk(parseInt(id));
      if (!project) {
        return res.status(404).json({ error: 'Proiect negăsit' });
      }

      if (project.ownerId !== req.user.id) {
        return res.status(403).json({ error: 'Doar proprietarul proiectului poate asigna juriul' });
      }

      const result = await juryService.assignJury(
        parseInt(id),
        parseInt(deliverableId),
        evaluatorCount || 5
      );

      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Handler pentru obținerea proiectelor asignate evaluatorului curent
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async getAssignedProjects(req, res) {
    try {
      const projects = await juryService.getAssignedProjects(req.user.id);

      res.json({ projects });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new JuryController();
