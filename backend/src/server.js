/**
 * Entry point pentru serverul Express
 * Rulează: npm start sau npm run dev
 * 
 * Acest script:
 * 1. Verifică conexiunea la baza de date MySQL
 * 2. Pornește serverul HTTP pe portul specificat
 * 3. Afișează lista de endpoint-uri disponibile
 * 4. Gestionează închiderea graceful (SIGINT)
 */
const app = require('./app');
const sequelize = require('./models/index');

const PORT = process.env.PORT || 3000;

/**
 * Funcție pentru pornirea serverului
 * Verifică conexiunea la DB înainte de a porni serverul
 */
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexiune MySQL stabilită cu succes');

    app.listen(PORT, () => {
      console.log(`✓ Server pornit pe http://localhost:${PORT}`);
      console.log('\nEndpoint-uri disponibile:');
      console.log('  POST   /auth/register');
      console.log('  POST   /auth/login');
      console.log('  POST   /projects');
      console.log('  GET    /projects');
      console.log('  GET    /projects/:id');
      console.log('  POST   /projects/:id/deliverables');
      console.log('  GET    /projects/:id/deliverables');
      console.log('  POST   /jury/projects/:id/assign-jury');
      console.log('  GET    /jury/projects');
      console.log('  POST   /grades');
      console.log('  PUT    /grades/:id');
      console.log('  GET    /grades/projects/:id/summary');
    });
  } catch (error) {
    console.error('✗ Eroare la pornirea serverului:', error.message);
    process.exit(1);
  }
}

// Handler pentru închidere graceful (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('\n\nÎnchidere graceful...');
  await sequelize.close();
  console.log('✓ Conexiune MySQL închisă');
  process.exit(0);
});

startServer();
