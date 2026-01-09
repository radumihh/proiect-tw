const sequelize = require('./sequelize');

const User = require('./User');
const Project = require('./Project');
const Deliverable = require('./Deliverable');
const JuryAssignment = require('./JuryAssignment');
const Grade = require('./Grade');

// Relații User - Project (un utilizator poate deține mai multe proiecte)
User.hasMany(Project, { foreignKey: 'ownerId', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Relații Project - Deliverable (un proiect poate avea mai multe livrabile)
Project.hasMany(Deliverable, { foreignKey: 'projectId', as: 'deliverables' });
Deliverable.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// Relații Project - JuryAssignment (un proiect poate avea mai mulți evaluatori)
Project.hasMany(JuryAssignment, { foreignKey: 'projectId', as: 'juryAssignments' });
JuryAssignment.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// Relații Deliverable - JuryAssignment (un livrabil poate avea mai mulți evaluatori)
Deliverable.hasMany(JuryAssignment, { foreignKey: 'deliverableId', as: 'juryAssignments' });
JuryAssignment.belongsTo(Deliverable, { foreignKey: 'deliverableId', as: 'deliverable' });

// Relații User - JuryAssignment (un utilizator poate fi evaluator pentru mai multe proiecte)
User.hasMany(JuryAssignment, { foreignKey: 'evaluatorId', as: 'evaluatorAssignments' });
JuryAssignment.belongsTo(User, { foreignKey: 'evaluatorId', as: 'evaluator' });

// Relații Project - Grade (un proiect poate avea mai multe note)
Project.hasMany(Grade, { foreignKey: 'projectId', as: 'grades' });
Grade.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// Relații Deliverable - Grade (un livrabil poate avea mai multe note)
Deliverable.hasMany(Grade, { foreignKey: 'deliverableId', as: 'grades' });
Grade.belongsTo(Deliverable, { foreignKey: 'deliverableId', as: 'deliverable' });

// Relații User - Grade (un utilizator poate acorda mai multe note)
User.hasMany(Grade, { foreignKey: 'evaluatorId', as: 'grades' });
Grade.belongsTo(User, { foreignKey: 'evaluatorId', as: 'evaluator' });

module.exports = sequelize;
