const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

/**
 * Model Sequelize pentru livrabilele parțiale ale proiectelor
 * Reprezintă tabelul 'deliverables' din baza de date
 * Fiecare livrabil are un deadline și poate avea un video demonstrativ
 */
const Deliverable = sequelize.define('Deliverable', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  weight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: null,
    comment: 'Pondere în procente (0-100) pentru calculul notei finale'
  }
}, {
  tableName: 'deliverables',
  timestamps: true
});

module.exports = Deliverable;
