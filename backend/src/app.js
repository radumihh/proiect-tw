/**
 * Aplicație Express principală pentru API-ul de evaluare a proiectelor studenților
 * Configurează middleware-uri, rute și handlere de erori
 */
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const deliverableRoutes = require('./routes/deliverableRoutes');
const juryRoutes = require('./routes/juryRoutes');
const gradeRoutes = require('./routes/gradeRoutes');

const app = express();

// Middleware pentru CORS, JSON parsing și URL-encoded data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint root pentru informații despre API
app.get('/', (req, res) => {
  res.json({
    message: 'API pentru Platforma de Evaluare Proiecte Studenți',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      projects: '/projects',
      jury: '/jury',
      grades: '/grades'
    }
  });
});

// Rute API
app.use('/auth', authRoutes);  // Autentificare și înregistrare
app.use('/projects', projectRoutes);  // Gestionare proiecte
app.use('/projects', deliverableRoutes);  // Gestionare livrabile (sub-rută de proiecte)
app.use('/jury', juryRoutes);  // Asignare și gestionare juriu
app.use('/grades', gradeRoutes);  // Adaugare și vizualizare note

// Handler 404 - Endpoint negăsit
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint negăsit' });
});

// Handler global de erori
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Eroare internă de server' });
});

module.exports = app;
