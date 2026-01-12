const Project = require('../models/Project');
const User = require('../models/User');
const Deliverable = require('../models/Deliverable');

// service pentru proiecte
class ProjectService {
  // creeaza proiect nou pentru student
  // un student poate avea doar un proiect
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

  // ia lista de proiecte dupa rol
  // profesorii vad toate, studentii doar al lor
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

  // ia detalii proiect daca userul are acces
  // acces: owner, profesor sau evaluator asignat
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
