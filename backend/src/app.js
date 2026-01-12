// app express pentru api evaluare proiecte
// config middleware, rute si erori
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const deliverableRoutes = require('./routes/deliverableRoutes');
const juryRoutes = require('./routes/juryRoutes');
const gradeRoutes = require('./routes/gradeRoutes');

const app = express();

// middleware cors, json si url encoded
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// endpoint root cu info api
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

// rute api
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/projects', deliverableRoutes);
app.use('/jury', juryRoutes);
app.use('/grades', gradeRoutes);

// handler 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint negăsit' });
});

// handler global erori
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Eroare internă de server' });
});

module.exports = app;
