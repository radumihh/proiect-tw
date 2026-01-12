const Deliverable = require('../models/Deliverable');
const Project = require('../models/Project');
const JuryAssignment = require('../models/JuryAssignment');

// service pentru deliverables
class DeliverableService {
  // creeaza deliverable nou pentru un proiect
  // doar ownerul poate adauga
  async createDeliverable(projectId, userId, name, deadline, videoUrl, weight) {
    const project = await Project.findByPk(projectId);
    
    if (!project) {
      throw new Error('Proiect negăsit');
    }

    if (project.ownerId !== userId) {
      throw new Error('Nu ai permisiunea să adaugi livrabile la acest proiect');
    }

    // validare weight, obligatoriu si pozitiv
    if (weight === undefined || weight === null || weight === '') {
      throw new Error('Ponderea este obligatorie');
    }

    const numWeight = Number(weight);
    if (!Number.isFinite(numWeight) || numWeight <= 0 || numWeight > 100) {
      throw new Error('Ponderea trebuie să fie mai mare decât 0% și maxim 100%');
    }

    // tranzactie pentru verificare atomica weight total
    const sequelize = require('./deliverableService').sequelize || require('../models/sequelize');
    const transaction = await sequelize.transaction();
    
    try {
      // verifica iar weight-ul in tranzactie
      const existingDeliverables = await Deliverable.findAll({
        where: { projectId },
        attributes: ['weight'],
        transaction
      });
      
      const totalWeight = existingDeliverables.reduce((sum, d) => {
        return sum + (d.weight ? parseFloat(d.weight) : 0);
      }, 0);
      
      const remaining = 100 - totalWeight;
      
      // verifica daca mai e weight disponibil
      if (remaining <= 0) {
        throw new Error('Ponderea totală este completă (0% disponibil). Editează livrabilele existente pentru a redistribui ponderea.');
      }
      
      // verifica daca weight-ul incape
      if (numWeight > remaining) {
        throw new Error(`Pondere prea mare. Disponibil: ${remaining.toFixed(2)}%`);
      }

      const deliverable = await Deliverable.create({
        projectId,
        name,
        deadline: new Date(deadline),
        videoUrl,
        weight: numWeight
      }, { transaction });
      
      await transaction.commit();
      return deliverable;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ia deliverables pentru un proiect, ordonate dupa deadline
  async getDeliverablesByProject(projectId) {
    const deliverables = await Deliverable.findAll({
      where: { projectId },
      order: [['deadline', 'ASC']]
    });

    // adauga nr jurati asignati pentru fiecare deliverable
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

  // ia detalii deliverable dupa id
  async getDeliverableById(deliverableId) {
    const deliverable = await Deliverable.findByPk(deliverableId);
    
    if (!deliverable) {
      throw new Error('Livrabil negăsit');
    }

    return deliverable;
  }
}

module.exports = new DeliverableService();
