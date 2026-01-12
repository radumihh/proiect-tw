const Grade = require('../models/Grade');
const JuryAssignment = require('../models/JuryAssignment');
const Deliverable = require('../models/Deliverable');
const Project = require('../models/Project');
const { calculateAverageGrade } = require('../utils/gradeCalculator');

// service pentru note
class GradeService {
  // trimite nota pentru un proiect
  // verifica daca evaluatorul e asignat si deadline nu a trecut
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

  // update nota existenta
  // doar evaluatorul care a creat-o o poate modifica inainte de deadline
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

  // ia sumar anonim note pentru un proiect
  // omite identitatea evaluatorilor
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

    // calculeaza media ponderata pentru proiect
    let projectAverage = null;
    const deliverablesWithGrades = summary.filter(d => d.averageGrade !== null);
    
    if (deliverablesWithGrades.length > 0) {
      // verifica daca toate deliverables au weights sau niciuna
      const allProjectDeliverables = deliverables;
      const allHaveWeights = allProjectDeliverables.every(d => d.weight !== null);
      
      if (allHaveWeights && deliverablesWithGrades.every(d => d.weight !== null)) {
        // calculeaza media ponderata, normalizeaza cu total weight
        const totalWeight = deliverablesWithGrades.reduce((sum, d) => sum + d.weight, 0);
        
        if (totalWeight > 0) {
          const weightedSum = deliverablesWithGrades.reduce((sum, d) => {
            return sum + (d.averageGrade * d.weight);
          }, 0);
          // normalizeaza cu total weight
          projectAverage = weightedSum / totalWeight;
        } else {
          // fallback la media simpla daca weight total 0
          const sum = deliverablesWithGrades.reduce((acc, d) => acc + d.averageGrade, 0);
          projectAverage = sum / deliverablesWithGrades.length;
        }
      } else {
        // media simpla daca nu toate au weights
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
