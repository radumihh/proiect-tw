/**
 * Script de migrare pentru crearea tabelelor în baza de date
 * Rulează: npm run migrate
 * 
 * Acest script creează toate tabelele necesare fără a șterge datele existente
 * Folosit pentru inițializarea inițială a bazei de date
 */
const sequelize = require('./models/index');
const User = require('./models/User');
const Project = require('./models/Project');
const Deliverable = require('./models/Deliverable');
const JuryAssignment = require('./models/JuryAssignment');
const Grade = require('./models/Grade');

/**
 * Funcție principală de migrare
 * Creează toate tabelele în baza de date folosind Sequelize sync
 */
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
