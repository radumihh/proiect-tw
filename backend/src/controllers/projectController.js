const projectService = require('../services/projectService');

// controller pentru proiecte
class ProjectController {
  // handler pentru creare proiect nou
  async createProject(req, res) {
    try {
      const { title, description } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Titlul este obligatoriu' });
      }

      const project = await projectService.createProject(
        req.user.id,
        title,
        description
      );

      res.status(201).json({
        message: 'Proiect creat cu succes',
        project
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // handler pentru lista de proiecte
  async getAllProjects(req, res) {
    try {
      const projects = await projectService.getAllProjects(
        req.user.id,
        req.user.role
      );

      res.json({ projects });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // handler pentru detalii proiect specific
  async getProjectById(req, res) {
    try {
      const { id } = req.params;

      const project = await projectService.getProjectById(
        parseInt(id),
        req.user.id,
        req.user.role
      );

      res.json({ project });
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = new ProjectController();
