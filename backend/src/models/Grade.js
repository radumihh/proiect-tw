const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

/**
 * Model Sequelize pentru notele acordate de evaluatori
 * Reprezintă tabelul 'grades' din baza de date
 * Notele sunt anonime și între 1.00 și 10.00 cu 2 zecimale
 */
const Grade = sequelize.define('Grade', {
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
  },
  value: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
    validate: {
      min: 1.0,
      max: 10.0
    }
  }
}, {
  tableName: 'grades',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['projectId', 'deliverableId', 'evaluatorId']
    }
  ]
});

module.exports = Grade;
