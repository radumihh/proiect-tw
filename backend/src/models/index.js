const sequelize = require('./sequelize');

const User = require('./User');
const Project = require('./Project');
const Deliverable = require('./Deliverable');
const JuryAssignment = require('./JuryAssignment');
const Grade = require('./Grade');

// relatii user - project
User.hasMany(Project, { foreignKey: 'ownerId', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// relatii project - deliverable
Project.hasMany(Deliverable, { foreignKey: 'projectId', as: 'deliverables' });
Deliverable.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// relatii project - juryassignment
Project.hasMany(JuryAssignment, { foreignKey: 'projectId', as: 'juryAssignments' });
JuryAssignment.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// relatii deliverable - juryassignment
Deliverable.hasMany(JuryAssignment, { foreignKey: 'deliverableId', as: 'juryAssignments' });
JuryAssignment.belongsTo(Deliverable, { foreignKey: 'deliverableId', as: 'deliverable' });

// relatii user - juryassignment
User.hasMany(JuryAssignment, { foreignKey: 'evaluatorId', as: 'evaluatorAssignments' });
JuryAssignment.belongsTo(User, { foreignKey: 'evaluatorId', as: 'evaluator' });

// relatii project - grade
Project.hasMany(Grade, { foreignKey: 'projectId', as: 'grades' });
Grade.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// relatii deliverable - grade
Deliverable.hasMany(Grade, { foreignKey: 'deliverableId', as: 'grades' });
Grade.belongsTo(Deliverable, { foreignKey: 'deliverableId', as: 'deliverable' });

// relatii user - grade
User.hasMany(Grade, { foreignKey: 'evaluatorId', as: 'grades' });
Grade.belongsTo(User, { foreignKey: 'evaluatorId', as: 'evaluator' });

module.exports = sequelize;
