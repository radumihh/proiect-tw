// script migrare tabele
// creeaza tabelele fara sa stearga date existente
const sequelize = require('./models/index');
const User = require('./models/User');
const Project = require('./models/Project');
const Deliverable = require('./models/Deliverable');
const JuryAssignment = require('./models/JuryAssignment');
const Grade = require('./models/Grade');

// functie migrare, creeaza tabelele cu sequelize sync
async function migrate() {
  try {
    console.log('Conectare la baza de date MySQL...');
    await sequelize.authenticate();
    console.log('✓ Conexiune reușită!');

    console.log('Creare tabele...');
    await sequelize.sync({ force: false });
    console.log('✓ Toate tabelele au fost create cu succes!');

    console.log('\nTabele create:');
    console.log('- users');
    console.log('- projects');
    console.log('- deliverables');
    console.log('- jury_assignments');
    console.log('- grades');

    process.exit(0);
  } catch (error) {
    console.error('✗ Eroare la migrare:', error.message);
    process.exit(1);
  }
}

migrate();
