const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

// model pentru deliverables ale proiectelor
// fiecare are deadline si poate avea video
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
