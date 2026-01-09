const Project = require('../models/Project');
const User = require('../models/User');
const Deliverable = require('../models/Deliverable');

/**
 * Serviciu pentru gestionarea proiectelor studenților
 * @class ProjectService
 */
class ProjectService {
  /**
   * Creează un proiect nou pentru un student
   * Un student poate avea doar un singur proiect
   * @param {number} ownerId - ID-ul studentului care creează proiectul
   * @param {string} title - Titlul proiectului
   * @param {string} description - Descrierea proiectului
   * @returns {Promise<Object>} Proiectul creat
   * @throws {Error} Dacă utilizatorul nu este student sau are deja un proiect
   */
  async createProject(ownerId, title, description) {
    const user = await User.findByPk(ownerId);
    if (!user || user.role !== 'student') {
      throw new Error('Doar studenții pot crea proiecte');
    }

    const existingProject = await Project.findOne({ where: { ownerId } });
    if (existingProject) {
      throw new Error('Ai deja un proiect creat');
    }

    const project = await Project.create({
      ownerId,
      title,
      description
    });

    return project;
  }

  /**
   * Returnează lista de proiecte în funcție de rolul utilizatorului
   * Profesorii văd toate proiectele, studenții văd doar proiectul lor
   * @param {number} userId - ID-ul utilizatorului curent
   * @param {string} userRole - Rolul utilizatorului ('student' sau 'professor')
   * @returns {Promise<Array>} Lista de proiecte
   */
  async getAllProjects(userId, userRole) {
    if (userRole === 'professor') {
      return await Project.findAll({
        include: [{
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }]
      });
    }

    return await Project.findAll({
      where: { ownerId: userId }
    });
  }

  /**
   * Returnează detaliile unui proiect dacă utilizatorul are acces
   * Accesul este permis pentru: proprietar, profesor, sau evaluator asigrenat
   * @param {number} projectId - ID-ul proiectului
   * @param {number} userId - ID-ul utilizatorului curent
   * @param {string} userRole - Rolul utilizatorului
   * @returns {Promise<Object>} Detaliile proiectului
   * @throws {Error} Dacă proiectul nu există sau utilizatorul nu are acces
   */
  async getProjectById(projectId, userId, userRole) {
    const project = await Project.findByPk(projectId, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!project) {
      throw new Error('Proiect negăsit');
    }

    if (userRole === 'professor') {
      return project;
    }

    if (project.ownerId === userId) {
      return project;
    }

    const JuryAssignment = require('../models/JuryAssignment');
    const assignment = await JuryAssignment.findOne({
      where: { 
        projectId,
        evaluatorId: userId
      }
    });

    if (assignment) {
      return project;
    }

    throw new Error('Nu ai acces la acest proiect');
  }
}

module.exports = new ProjectService();
