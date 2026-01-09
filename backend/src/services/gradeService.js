const Grade = require('../models/Grade');
const JuryAssignment = require('../models/JuryAssignment');
const Deliverable = require('../models/Deliverable');
const Project = require('../models/Project');
const { calculateAverageGrade } = require('../utils/gradeCalculator');

/**
 * Serviciu pentru gestionarea notelor acordate de evaluatori
 * @class GradeService
 */
class GradeService {
  /**
   * Trimite o notă pentru un proiect
   * Verifică dacă evaluatorul este asignat și deadline-ul nu a trecut
   * @param {number} evaluatorId - ID-ul evaluatorului
   * @param {number} projectId - ID-ul proiectului
   * @param {number} deliverableId - ID-ul livrabilului
   * @param {number} value - Valoarea notei (1.00 - 10.00)
   * @returns {Promise<Object>} Nota creată
   * @throws {Error} Dacă evaluatorul nu este asignat, deadline-ul a trecut sau nota este invalidă
   */
  async submitGrade(evaluatorId, projectId, deliverableId, value) {
    const assignment = await JuryAssignment.findOne({
      where: { 
        evaluatorId, 
        projectId, 
        deliverableId 
      }
    });

    if (!assignment) {
      throw new Error('Nu ești asignat să evaluezi acest proiect');
    }

    const deliverable = await Deliverable.findByPk(deliverableId);
    if (!deliverable) {
      throw new Error('Livrabil negăsit');
    }

    if (new Date() > new Date(deliverable.deadline)) {
      throw new Error('Deadline-ul pentru evaluare a trecut');
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue < 1 || numericValue > 10) {
      throw new Error('Nota trebuie să fie între 1.00 și 10.00');
    }

    const existingGrade = await Grade.findOne({
      where: { 
        evaluatorId, 
        projectId, 
        deliverableId 
      }
    });

    if (existingGrade) {
      throw new Error('Ai deja o notă pentru acest proiect. Folosește PUT pentru a o modifica.');
    }

    const grade = await Grade.create({
      evaluatorId,
      projectId,
      deliverableId,
      value: numericValue
    });

    return grade;
  }

  /**
   * Actualizează o notă existentă
   * Doar evaluatorul care a creat nota o poate modifica și doar înainte de deadline
   * @param {number} gradeId - ID-ul notei
   * @param {number} evaluatorId - ID-ul evaluatorului
   * @param {number} newValue - Noua valoare a notei (1.00 - 10.00)
   * @returns {Promise<Object>} Nota actualizată
   * @throws {Error} Dacă nota nu există, evaluatorul nu are permisiune sau deadline-ul a trecut
   */
  async updateGrade(gradeId, evaluatorId, newValue) {
    const grade = await Grade.findByPk(gradeId);

    if (!grade) {
      throw new Error('Nota nu a fost găsită');
    }

    if (grade.evaluatorId !== evaluatorId) {
      throw new Error('Nu poți modifica nota altui evaluator');
    }

    const deliverable = await Deliverable.findByPk(grade.deliverableId);
    if (!deliverable) {
      throw new Error('Livrabil negăsit');
    }

    if (new Date() > new Date(deliverable.deadline)) {
      throw new Error('Deadline-ul pentru evaluare a trecut');
    }

    const numericValue = Number(newValue);
    if (!Number.isFinite(numericValue) || numericValue < 1 || numericValue > 10) {
      throw new Error('Nota trebuie să fie între 1.00 și 10.00');
    }

    grade.value = numericValue;
    await grade.save();

    return grade;
  }

  /**
   * Returnează sumar anonim al notelor pentru un proiect
   * Omite identitatea evaluatorilor pentru a menține anonimatul
   * @param {number} projectId - ID-ul proiectului
   * @returns {Promise<Object>} Sumar cu medii calculate și note anonime
   * @throws {Error} Dacă proiectul nu există
   */
  async getGradesSummary(projectId) {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error('Proiect negăsit');
    }

    const deliverables = await Deliverable.findAll({
      where: { projectId }
    });

    const summary = await Promise.all(
      deliverables.map(async (deliverable) => {
        const grades = await Grade.findAll({
          where: { 
            projectId, 
            deliverableId: deliverable.id 
          },
          attributes: ['value', 'createdAt']
        });

        const average = calculateAverageGrade(grades);

        return {
          deliverableId: deliverable.id,
          deliverableName: deliverable.name,
          deadline: deliverable.deadline,
          weight: deliverable.weight ? parseFloat(deliverable.weight) : null,
          gradesCount: grades.length,
          averageGrade: average,
          grades: grades.map(g => ({
            value: parseFloat(g.value),
            submittedAt: g.createdAt
          }))
        };
      })
    );

    // Calculate overall project weighted average
    let projectAverage = null;
    const deliverablesWithGrades = summary.filter(d => d.averageGrade !== null);
    
    if (deliverablesWithGrades.length > 0) {
      // Check if all deliverables have weights
      const allHaveWeights = deliverablesWithGrades.every(d => d.weight !== null);
      
      if (allHaveWeights) {
        // Calculate weighted average
        const totalWeight = deliverablesWithGrades.reduce((sum, d) => sum + d.weight, 0);
        
        if (totalWeight > 0) {
          const weightedSum = deliverablesWithGrades.reduce((sum, d) => {
            return sum + (d.averageGrade * d.weight);
          }, 0);
          projectAverage = weightedSum / totalWeight;
        }
      } else {
        // Simple average if not all have weights
        const sum = deliverablesWithGrades.reduce((acc, d) => acc + d.averageGrade, 0);
        projectAverage = sum / deliverablesWithGrades.length;
      }
    }

    return {
      projectId,
      projectTitle: project.title,
      projectAverage: projectAverage !== null ? parseFloat(projectAverage.toFixed(2)) : null,
      deliverables: summary
    };
  }
}

module.exports = new GradeService();
