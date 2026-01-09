const JuryAssignment = require('../models/JuryAssignment');
const Project = require('../models/Project');
const User = require('../models/User');
const Deliverable = require('../models/Deliverable');
const { selectRandomEvaluators } = require('../utils/randomSelector');

/**
 * Serviciu pentru gestionarea asignării aleatoare a juriu
 * @class JuryService
 */
class JuryService {
  /**
   * Asignează aleatoriu evaluatori pentru un livrabil al unui proiect
   * Exclude proprietarul proiectului din selecție
   * @param {number} projectId - ID-ul proiectului
   * @param {number} deliverableId - ID-ul livrabilului
   * @param {number} evaluatorCount - Numărul de evaluatori de asignat (implicit 5)
   * @returns {Promise<Object>} Rezumat cu numărul de evaluatori asignați
   * @throws {Error} Dacă proiectul/livrabilul nu există sau juriul a fost deja asignat
   */
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

  /**
   * Returnează toate proiectele asignate unui evaluator
   * @param {number} evaluatorId - ID-ul evaluatorului
   * @returns {Promise<Array>} Lista de proiecte cu detalii despre livrabile
   */
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
