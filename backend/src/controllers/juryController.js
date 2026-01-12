const juryService = require('../services/juryService');
const Project = require('../models/Project');

// controller pentru juriu
class JuryController {
  // handler pentru asignare random jurat
  async assignJury(req, res) {
    try {
      const { id } = req.params;
      const { deliverableId, evaluatorCount } = req.body;

      if (!deliverableId) {
        return res.status(400).json({ error: 'deliverableId este obligatoriu' });
      }
      // doar ownerul poate asigna juriul
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

  // handler pentru proiecte asignate evaluatorului
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
