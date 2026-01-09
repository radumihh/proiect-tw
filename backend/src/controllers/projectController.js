const projectService = require('../services/projectService');

/**
 * Controller pentru gestionarea endpoint-urilor legate de proiecte
 * @class ProjectController
 */
class ProjectController {
  /**
   * Handler pentru crearea unui proiect nou
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
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

  /**
   * Handler pentru obținerea listei de proiecte
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
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

  /**
   * Handler pentru obținerea detaliilor unui proiect specific
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
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
