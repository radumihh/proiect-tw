const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

/**
 * Model Sequelize pentru asignările de evaluatori (juriu)
 * Reprezintă tabelul 'jury_assignments' din baza de date
 * Stochează care evaluatori sunt asignați să evalueze care proiecte/livrabile
 */
const JuryAssignment = sequelize.define('JuryAssignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id'
    }
  },
  deliverableId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'deliverables',
      key: 'id'
    }
  },
  evaluatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'jury_assignments',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['projectId', 'deliverableId', 'evaluatorId']
    }
  ]
});

module.exports = JuryAssignment;
