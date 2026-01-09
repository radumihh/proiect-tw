const Deliverable = require('../models/Deliverable');
const Project = require('../models/Project');
const JuryAssignment = require('../models/JuryAssignment');

/**
 * Serviciu pentru gestionarea livrabilelor parțiale ale proiectelor
 * @class DeliverableService
 */
class DeliverableService {
  /**
   * Creează un livrabil parțial pentru un proiect
   * Doar proprietarul proiectului poate adăuga livrabile
   * @param {number} projectId - ID-ul proiectului
   * @param {number} userId - ID-ul utilizatorului care creează livrabilul
   * @param {string} name - Numele livrabilului
   * @param {Date} deadline - Data limită pentru evaluare
   * @param {string} videoUrl - URL optional către video demonstrativ
   * @param {number} weight - Pondere în procente (0-100)
   * @returns {Promise<Object>} Livrabilul creat
   * @throws {Error} Dacă proiectul nu există sau utilizatorul nu are permisiune
   */
  async createDeliverable(projectId, userId, name, deadline, videoUrl, weight) {
    const project = await Project.findByPk(projectId);
    
    if (!project) {
      throw new Error('Proiect negăsit');
    }

    if (project.ownerId !== userId) {
      throw new Error('Nu ai permisiunea să adaugi livrabile la acest proiect');
    }

    // Validate weight - mandatory and strictly positive
    if (weight === undefined || weight === null || weight === '') {
      throw new Error('Ponderea este obligatorie');
    }

    const numWeight = Number(weight);
    if (!Number.isFinite(numWeight) || numWeight <= 0 || numWeight > 100) {
      throw new Error('Ponderea trebuie să fie mai mare decât 0% și maxim 100%');
    }

    // Check total weight doesn't exceed 100%
    const existingDeliverables = await Deliverable.findAll({
      where: { projectId },
      attributes: ['weight']
    });
    
    const totalWeight = existingDeliverables.reduce((sum, d) => {
      return sum + (d.weight ? parseFloat(d.weight) : 0);
    }, 0);

    if (totalWeight + numWeight > 100) {
      throw new Error(`Ponderea totală depășește 100%. Disponibil: ${(100 - totalWeight).toFixed(2)}%`);
    }

    const deliverable = await Deliverable.create({
      projectId,
      name,
      deadline: new Date(deadline),
      videoUrl,
      weight: numWeight
    });

    return deliverable;
  }

  /**
   * Returnează toate livrabilele unui proiect, ordonate după deadline
   * @param {number} projectId - ID-ul proiectului
   * @returns {Promise<Array>} Lista de livrabile
   */
  async getDeliverablesByProject(projectId) {
    const deliverables = await Deliverable.findAll({
      where: { projectId },
      order: [['deadline', 'ASC']]
    });

    // Add jury assignment count for each deliverable
    const deliverablesWithJury = await Promise.all(
      deliverables.map(async (deliverable) => {
        const juryCount = await JuryAssignment.count({
          where: { 
            projectId,
            deliverableId: deliverable.id 
          }
        });
        
        return {
          ...deliverable.toJSON(),
          juryAssigned: juryCount > 0,
          juryCount
        };
      })
    );

    return deliverablesWithJury;
  }

  /**
   * Returnează detaliile unui livrabil specific
   * @param {number} deliverableId - ID-ul livrabilului
   * @returns {Promise<Object>} Detaliile livrabilului
   * @throws {Error} Dacă livrabilul nu este găsit
   */
  async getDeliverableById(deliverableId) {
    const deliverable = await Deliverable.findByPk(deliverableId);
    
    if (!deliverable) {
      throw new Error('Livrabil negăsit');
    }

    return deliverable;
  }
}

module.exports = new DeliverableService();
