const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

// model pentru useri, studenti si profesori
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('student', 'professor'),
    allowNull: false,
    defaultValue: 'student'
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
