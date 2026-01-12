// entry point pentru server
// verifica db, porneste server, afiseaza endpoints
const app = require('./app');
const sequelize = require('./models/index');

const PORT = process.env.PORT || 3000;

// functie pornire server, verifica db mai intai
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

// handler pentru ctrl+c
process.on('SIGINT', async () => {
  console.log('\n\nÎnchidere graceful...');
  await sequelize.close();
  console.log('✓ Conexiune MySQL închisă');
  process.exit(0);
});

startServer();
