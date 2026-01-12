const JuryAssignment = require('../models/JuryAssignment');
const Project = require('../models/Project');
const User = require('../models/User');
const Deliverable = require('../models/Deliverable');
const { selectRandomEvaluators } = require('../utils/randomSelector');

// service pentru asignare jurat
class JuryService {
  // asigneaza random evaluatori pentru un deliverable
  // exclude ownerul din selectie
  async assignJury(projectId, deliverableId, evaluatorCount = 5) {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error('Proiect negăsit');
    }

    const deliverable = await Deliverable.findByPk(deliverableId);
    if (!deliverable || deliverable.projectId !== projectId) {
      throw new Error('Livrabil negăsit sau nu aparține acestui proiect');
    }

    const existingAssignments = await JuryAssignment.findAll({
      where: { projectId, deliverableId }
    });

    if (existingAssignments.length > 0) {
      throw new Error('Juriul a fost deja asignat pentru acest livrabil');
    }

    const allStudents = await User.findAll({
      where: { role: 'student' }
    });

    const excludeIds = [project.ownerId];
    
    const selectedEvaluators = selectRandomEvaluators(
      allStudents, 
      excludeIds, 
      evaluatorCount
    );

    if (selectedEvaluators.length === 0) {
      throw new Error('Nu există suficienți studenți disponibili pentru evaluare');
    }

    const assignments = await Promise.all(
      selectedEvaluators.map(evaluator =>
        JuryAssignment.create({
          projectId,
          deliverableId,
          evaluatorId: evaluator.id
        })
      )
    );

    return {
      count: assignments.length,
      message: `${assignments.length} evaluatori au fost asignați`
    };
  }

  // ia toate proiectele asignate unui evaluator
  async getAssignedProjects(evaluatorId) {
    const Grade = require('../models/Grade');
    
    const assignments = await JuryAssignment.findAll({
      where: { evaluatorId },
      include: [
        {
          model: Project,
          as: 'project',
          include: [{
            model: User,
            as: 'owner',
            attributes: ['id', 'name']
          }]
        },
        {
          model: Deliverable,
          as: 'deliverable'
        }
      ]
    });

    const projectsWithGrades = await Promise.all(
      assignments.map(async (a) => {
        const existingGrade = await Grade.findOne({
          where: {
            evaluatorId,
            projectId: a.projectId,
            deliverableId: a.deliverableId
          }
        });

        return {
          projectId: a.projectId,
          projectTitle: a.project.title,
          projectDescription: a.project.description,
          deliverableId: a.deliverableId,
          deliverableName: a.deliverable.name,
          deadline: a.deliverable.deadline,
          videoUrl: a.deliverable.videoUrl,
          existingGrade: existingGrade ? {
            id: existingGrade.id,
            value: parseFloat(existingGrade.value),
            submittedAt: existingGrade.createdAt
          } : null
        };
      })
    );

    return projectsWithGrades;
  }
}

module.exports = new JuryService();
