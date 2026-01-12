// seed script simplu pentru testare
const sequelize = require('./src/models/sequelize');
const User = require('./src/models/User');
const Project = require('./src/models/Project');
const Deliverable = require('./src/models/Deliverable');
const JuryAssignment = require('./src/models/JuryAssignment');
const Grade = require('./src/models/Grade');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    console.log('Conectare la DB...');
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('DB resetat!\n');

    const pass = await bcrypt.hash('password123', 10);

    // useri
    const prof = await User.create({
      name: 'Prof. Ionescu',
      email: 'prof@test.com',
      passwordHash: pass,
      role: 'professor'
    });

    const maria = await User.create({
      name: 'Maria Pop',
      email: 'maria@test.com',
      passwordHash: pass,
      role: 'student'
    });

    const ion = await User.create({
      name: 'Ion Vasile',
      email: 'ion@test.com',
      passwordHash: pass,
      role: 'student'
    });

    const ana = await User.create({
      name: 'Ana Georgescu',
      email: 'ana@test.com',
      passwordHash: pass,
      role: 'student'
    });

    const mihai = await User.create({
      name: 'Mihai Popescu',
      email: 'mihai@test.com',
      passwordHash: pass,
      role: 'student'
    });

    const elena = await User.create({
      name: 'Elena Dumitrescu',
      email: 'elena@test.com',
      passwordHash: pass,
      role: 'student'
    });

    const andrei = await User.create({
      name: 'Andrei Stan',
      email: 'andrei@test.com',
      passwordHash: pass,
      role: 'student'
    });

    console.log('Users creati');

    // proiecte
    const proj1 = await Project.create({
      ownerId: maria.id,
      title: 'E-Learning Platform',
      description: 'Platforma online pentru cursuri'
    });

    const proj2 = await Project.create({
      ownerId: ion.id,
      title: 'IoT Smart Home',
      description: 'App pentru casa inteligenta'
    });

    console.log('Proiecte create');

    const now = new Date();

    // deliverables pentru maria
    const d1 = await Deliverable.create({
      projectId: proj1.id,
      name: 'bbbbbbbb',
      deadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      videoUrl: 'https://youtube.com/demo',
      weight: 23.00
    });

    const d2 = await Deliverable.create({
      projectId: proj1.id,
      name: 'aaaa',
      deadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      videoUrl: null,
      weight: 77.00
    });

    // deliverables pentru ion
    const d3 = await Deliverable.create({
      projectId: proj2.id,
      name: 'Hardware',
      deadline: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      videoUrl: null,
      weight: 40.00
    });

    const d4 = await Deliverable.create({
      projectId: proj2.id,
      name: 'Software',
      deadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      videoUrl: null,
      weight: 60.00
    });

    console.log('Deliverables create');

    // asignare juriu pentru d1
    const evaluatori1 = [ion, ana, mihai, elena, andrei];
    for (const ev of evaluatori1) {
      await JuryAssignment.create({
        projectId: proj1.id,
        deliverableId: d1.id,
        evaluatorId: ev.id
      });
    }

    // note pentru d1
    await Grade.create({ projectId: proj1.id, deliverableId: d1.id, evaluatorId: ion.id, value: 9.5 });
    await Grade.create({ projectId: proj1.id, deliverableId: d1.id, evaluatorId: ana.id, value: 8.75 });
    await Grade.create({ projectId: proj1.id, deliverableId: d1.id, evaluatorId: mihai.id, value: 9.0 });
    await Grade.create({ projectId: proj1.id, deliverableId: d1.id, evaluatorId: elena.id, value: 8.5 });
    await Grade.create({ projectId: proj1.id, deliverableId: d1.id, evaluatorId: andrei.id, value: 9.25 });

    console.log('Juriu si note pentru d1');

    // asignare juriu pentru d2
    const evaluatori2 = [ion, ana, mihai, elena, andrei];
    for (const ev of evaluatori2) {
      await JuryAssignment.create({
        projectId: proj1.id,
        deliverableId: d2.id,
        evaluatorId: ev.id
      });
    }

    console.log('Juriu pentru d2');

    console.log('\n=========================');
    console.log('SEED COMPLET!');
    console.log('=========================\n');
    console.log('Conturi:');
    console.log('prof@test.com / password123 (profesor)');
    console.log('maria@test.com / password123 (student cu proiect)');
    console.log('ion@test.com / password123 (student cu proiect)');
    console.log('ana@test.com / password123 (evaluator)');
    console.log('mihai@test.com / password123 (evaluator)');
    console.log('elena@test.com / password123 (evaluator)');
    console.log('andrei@test.com / password123 (evaluator)\n');

    process.exit(0);
  } catch (error) {
    console.error('Eroare:', error);
    process.exit(1);
  }
}

seed();
