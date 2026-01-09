/**
 * Script complet de seeding pentru testare manuală comprehensivă
 * Rulează: node seed-complete.js
 * 
 * Acest script creează:
 * - 1 profesor
 * - 8 studenți (4 cu proiecte, 4 evaluatori)
 * - 4 proiecte complete
 * - 3 livrabile pentru fiecare proiect
 * - Asignări de juriu complete (5 evaluatori/livrabil)
 * - Note date de evaluatori pentru unele livrabile
 * - Mix de scenarii: livrabile cu/fără juriu, cu/fără note, deadline-uri diferite
 */

const sequelize = require('./src/models/sequelize');
const User = require('./src/models/User');
const Project = require('./src/models/Project');
const Deliverable = require('./src/models/Deliverable');
const JuryAssignment = require('./src/models/JuryAssignment');
const Grade = require('./src/models/Grade');
const bcrypt = require('bcrypt');

async function seedCompleteDatabase() {
  try {
    console.log('🔄 Conectare la baza de date...');
    await sequelize.authenticate();
    console.log('✓ Conexiune reușită!\n');

    // Șterge și recrează tabelele
    console.log('🔄 Resetare tabele...');
    await sequelize.sync({ force: true });
    console.log('✓ Tabele resetate!\n');

    const passwordHash = await bcrypt.hash('password123', 10);

    // CREARE UTILIZATORI
    console.log('👥 Creare utilizatori...\n');

    // Profesor
    const profesor = await User.create({
      name: 'Prof. Adrian Marinescu',
      email: 'profesor@test.com',
      passwordHash: passwordHash,
      role: 'professor'
    });
    console.log('✓ Profesor: profesor@test.com / password123');

    // Studenți cu proiecte
    const student1 = await User.create({
      name: 'Maria Popescu',
      email: 'maria@test.com',
      passwordHash: passwordHash,
      role: 'student'
    });
    console.log('✓ Student 1 (MP): maria@test.com / password123');

    const student2 = await User.create({
      name: 'Ion Ionescu',
      email: 'ion@test.com',
      passwordHash: passwordHash,
      role: 'student'
    });
    console.log('✓ Student 2 (MP): ion@test.com / password123');

    const student3 = await User.create({
      name: 'Ana Georgescu',
      email: 'ana@test.com',
      passwordHash: passwordHash,
      role: 'student'
    });
    console.log('✓ Student 3 (MP): ana@test.com / password123');

    const student4 = await User.create({
      name: 'Mihai Popa',
      email: 'mihai@test.com',
      passwordHash: passwordHash,
      role: 'student'
    });
    console.log('✓ Student 4 (MP): mihai@test.com / password123');

    // Evaluatori EXTRA (studenți fără proiecte proprii - doar evaluează)
    const evaluator5 = await User.create({
      name: 'Elena Dumitrescu',
      email: 'elena@test.com',
      passwordHash: passwordHash,
      role: 'student'
    });
    console.log('✓ Evaluator 5: elena@test.com / password123');

    const evaluator6 = await User.create({
      name: 'Andrei Stan',
      email: 'andrei@test.com',
      passwordHash: passwordHash,
      role: 'student'
    });
    console.log('✓ Evaluator 6: andrei@test.com / password123');

    const evaluator7 = await User.create({
      name: 'Sofia Radu',
      email: 'sofia@test.com',
      passwordHash: passwordHash,
      role: 'student'
    });
    console.log('✓ Evaluator 7: sofia@test.com / password123');

    const evaluator8 = await User.create({
      name: 'Cristian Marin',
      email: 'cristian@test.com',
      passwordHash: passwordHash,
      role: 'student'
    });
    console.log('✓ Evaluator 8: cristian@test.com / password123');

    console.log('\n📁 Creare proiecte și livrabile...\n');

    const now = new Date();
    // Pool de evaluatori: toți studenții minus proprietarul curent
    const allStudents = [student1, student2, student3, student4, evaluator5, evaluator6, evaluator7, evaluator8];

    // PROIECT 1 - Maria (Complet cu juriu și note)
    const project1 = await Project.create({
      ownerId: student1.id,
      title: 'Platformă E-Learning AI',
      description: 'Platformă de învățare cu recomandări personalizate folosind machine learning'
    });
    console.log(`✓ Proiect 1: "${project1.title}" (Maria)`);

    const p1_deliverable1 = await Deliverable.create({
      projectId: project1.id,
      name: 'Etapa 1 - Analiza și Design',
      deadline: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // -2 zile (expirat)
      videoUrl: 'https://youtube.com/watch?v=demo1',
      weight: 20.00
    });

    const p1_deliverable2 = await Deliverable.create({
      projectId: project1.id,
      name: 'Etapa 2 - Backend API',
      deadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // +3 zile
      videoUrl: 'https://youtube.com/watch?v=demo2',
      weight: 50.00
    });

    const p1_deliverable3 = await Deliverable.create({
      projectId: project1.id,
      name: 'Etapa 3 - Frontend & Deployment',
      deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // +7 zile
      videoUrl: null,
      weight: 30.00
    });

    // Asignare juriu și note pentru Livrabilul 1 (deadline expirat)
    // Evaluatori: includem și studenți care au proiecte proprii (Ion, Ana, Mihai + 2 evaluatori extra)
    const p1_d1_evaluatori = allStudents.filter(e => e.id !== student1.id).slice(0, 5);
    for (const evaluator of p1_d1_evaluatori) {
      await JuryAssignment.create({
        projectId: project1.id,
        deliverableId: p1_deliverable1.id,
        evaluatorId: evaluator.id
      });
    }
    // Note complete
    await Grade.create({ projectId: project1.id, deliverableId: p1_deliverable1.id, evaluatorId: p1_d1_evaluatori[0].id, value: 9.5 });
    await Grade.create({ projectId: project1.id, deliverableId: p1_deliverable1.id, evaluatorId: p1_d1_evaluatori[1].id, value: 8.75 });
    await Grade.create({ projectId: project1.id, deliverableId: p1_deliverable1.id, evaluatorId: p1_d1_evaluatori[2].id, value: 9.0 });
    await Grade.create({ projectId: project1.id, deliverableId: p1_deliverable1.id, evaluatorId: p1_d1_evaluatori[3].id, value: 8.5 });
    await Grade.create({ projectId: project1.id, deliverableId: p1_deliverable1.id, evaluatorId: p1_d1_evaluatori[4].id, value: 9.25 });
    console.log('  ✓ Livrabil 1: Juriu asignat (5 - include studenți cu proiecte) + Note complete (5)');

    // Asignare juriu pentru Livrabilul 2 (partial notes)
    const p1_d2_evaluatori = [student3, student4, evaluator6, evaluator7, evaluator8];
    for (const evaluator of p1_d2_evaluatori) {
      await JuryAssignment.create({
        projectId: project1.id,
        deliverableId: p1_deliverable2.id,
        evaluatorId: evaluator.id
      });
    }
    // Doar 2 note (unul e student cu proiect, altul e evaluator pur)
    await Grade.create({ projectId: project1.id, deliverableId: p1_deliverable2.id, evaluatorId: student3.id, value: 8.0 });
    await Grade.create({ projectId: project1.id, deliverableId: p1_deliverable2.id, evaluatorId: evaluator6.id, value: 8.5 });
    console.log('  ✓ Livrabil 2: Juriu asignat (5 - mix studenți/evaluatori) + Note parțiale (2/5)');

    // Livrabilul 3 - fără juriu
    console.log('  ✓ Livrabil 3: Fără juriu asignat');

    // PROIECT 2 - Ion (Parțial completat)
    const project2 = await Project.create({
      ownerId: student2.id,
      title: 'Aplicație IoT Smart Home',
      description: 'Sistem de automatizare casă inteligentă cu senzori și control mobil'
    });
    console.log(`\n✓ Proiect 2: "${project2.title}" (Ion)`);

    const p2_deliverable1 = await Deliverable.create({
      projectId: project2.id,
      name: 'Prototip Hardware',
      deadline: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // +1 zi
      videoUrl: 'https://youtube.com/watch?v=demo3',
      weight: 40.00
    });

    const p2_deliverable2 = await Deliverable.create({
      projectId: project2.id,
      name: 'Software & Mobile App',
      deadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // +5 zile
      videoUrl: null,
      weight: 35.00
    });

    const p2_deliverable3 = await Deliverable.create({
      projectId: project2.id,
      name: 'Testare & Documentație',
      deadline: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // +10 zile
      videoUrl: null,
      weight: 25.00
    });

    // Juriu doar pentru primul livrabil, cu note incomplete
    // Include Maria (are proiect), Ana (are proiect) și 3 evaluatori puri
    const p2_d1_evaluatori = [student1, student3, evaluator5, evaluator6, evaluator7];
    for (const evaluator of p2_d1_evaluatori) {
      await JuryAssignment.create({
        projectId: project2.id,
        deliverableId: p2_deliverable1.id,
        evaluatorId: evaluator.id
      });
    }
    await Grade.create({ projectId: project2.id, deliverableId: p2_deliverable1.id, evaluatorId: student1.id, value: 7.5 });
    await Grade.create({ projectId: project2.id, deliverableId: p2_deliverable1.id, evaluatorId: evaluator5.id, value: 8.25 });
    await Grade.create({ projectId: project2.id, deliverableId: p2_deliverable1.id, evaluatorId: evaluator6.id, value: 7.75 });
    console.log('  ✓ Livrabil 1: Juriu asignat (5 - include Maria și Ana cu proiecte) + Note parțiale (3/5)');
    console.log('  ✓ Livrabil 2 & 3: Fără juriu');

    // PROIECT 3 - Ana (Fără juriu)
    const project3 = await Project.create({
      ownerId: student3.id,
      title: 'Blockchain Voting System',
      description: 'Sistem de votare securizat bazat pe blockchain pentru transparență'
    });
    console.log(`\n✓ Proiect 3: "${project3.title}" (Ana)`);

    await Deliverable.create({
      projectId: project3.id,
      name: 'Research & Architecture',
      deadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      videoUrl: null,
      weight: 30.00
    });

    await Deliverable.create({
      projectId: project3.id,
      name: 'Smart Contracts',
      deadline: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
      videoUrl: null,
      weight: 40.00
    });

    await Deliverable.create({
      projectId: project3.id,
      name: 'Web Interface',
      deadline: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
      videoUrl: null,
      weight: 30.00
    });

    console.log('  ✓ 3 livrabile create (fără juriu asignat)');

    // PROIECT 4 - Mihai (Proiect nou, fără livrabile)
    const project4 = await Project.create({
      ownerId: student4.id,
      title: 'AI Chatbot Medical Assistant',
      description: 'Asistent virtual pentru triaj medical și sfaturi de sănătate'
    });
    console.log(`\n✓ Proiect 4: "${project4.title}" (Mihai)`);

    await Deliverable.create({
      projectId: project4.id,
      name: 'NLP Model Training',
      deadline: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
      videoUrl: null,
      weight: 60.00
    });

    await Deliverable.create({
      projectId: project4.id,
      name: 'API & Integration',
      deadline: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
      videoUrl: null,
      weight: 40.00
    });

    console.log('  ✓ 2 livrabile create (fără juriu)');

    console.log('\n\n═══════════════════════════════════════════════════════');
    console.log('🎉 BAZA DE DATE COMPLETĂ PENTRU TESTARE!');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('📋 CONTURI DISPONIBILE:\n');
    console.log('👨‍🏫 PROFESOR:');
    console.log('   Email: profesor@test.com');
    console.log('   Parolă: password123');
    console.log('   Poate vedea: Toate proiectele și notele anonime\n');

    console.log('👩‍🎓 STUDENȚI CU PROIECTE (au și rol de evaluatori):');
    console.log('   1. maria@test.com / password123 (Proiect E-Learning - COMPLET)');
    console.log('      - Are propriul proiect: 3 livrabile, 2 cu juriu și note');
    console.log('      - Este evaluator pentru: Proiectul lui Ion');
    console.log('   2. ion@test.com / password123 (Proiect IoT - PARȚIAL)');
    console.log('      - Are propriul proiect: 3 livrabile, 1 cu juriu și note parțiale');
    console.log('      - Este evaluator pentru: Proiectul Mariei (livrabil 1)');
    console.log('   3. ana@test.com / password123 (Proiect Blockchain - NOU)');
    console.log('      - Are propriul proiect: 3 livrabile, fără juriu');
    console.log('      - Este evaluator pentru: Proiectele Mariei și Ion');
    console.log('   4. mihai@test.com / password123 (Proiect AI Chatbot - NOU)');
    console.log('      - Are propriul proiect: 2 livrabile, fără juriu');
    console.log('      - Este evaluator pentru: Proiectul Mariei\n');

    console.log('👥 EVALUATORI PURI (nu au proiecte proprii):');
    console.log('   5. elena@test.com / password123');
    console.log('      - Este evaluator pentru: Proiectul lui Ion');
    console.log('   6. andrei@test.com / password123');
    console.log('      - Este evaluator pentru: Proiectele Mariei și Ion');
    console.log('   7. sofia@test.com / password123');
    console.log('      - Este evaluator pentru: Proiectul lui Ion');
    console.log('   8. cristian@test.com / password123');
    console.log('      - Este evaluator pentru: Proiectul Mariei\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 STATISTICI:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`✓ ${await User.count()} utilizatori (1 profesor + 8 studenți)`);
    console.log(`✓ ${await Project.count()} proiecte`);
    console.log(`✓ ${await Deliverable.count()} livrabile`);
    console.log(`✓ ${await JuryAssignment.count()} asignări de juriu`);
    console.log(`✓ ${await Grade.count()} note acordate`);
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('🔍 CE POȚI TESTA:\n');
    console.log('1. Login ca PROFESOR:');
    console.log('   - Vezi toate proiectele');
    console.log('   - Vezi sumar note (anonime) pentru fiecare proiect');
    console.log('   - Vezi medii calculate (omite min/max)\n');

    console.log('2. Login ca STUDENT cu PROIECT (ex: ion@test.com):');
    console.log('   - Tab "My Project": Vezi propriul proiect și livrabile');
    console.log('   - Tab "My Project": Poți adăuga livrabile noi');
    console.log('   - Tab "My Project": Poți asigna juriu (disabled dacă deja asignat)');
    console.log('   - Tab "Evaluate Projects": Vezi proiectele pentru care ești în juriu');
    console.log('   - Tab "Evaluate Projects": Poți da note la proiectele asignate\n');

    console.log('3. Login ca EVALUATOR PUR (ex: andrei@test.com):');
    console.log('   - Tab "My Project": Nu are proiect propriu');
    console.log('   - Tab "Evaluate Projects": Vezi proiectele pentru care ești în juriu');
    console.log('   - Poți da note (1.00 - 10.00) pentru proiectele asignate\n');

    console.log('4. TESTE FUNCȚIONALE:');
    console.log('   ✓ Toggle între "My Project" și "Evaluate Projects"');
    console.log('   ✓ Badge cu număr de proiecte de evaluat');
    console.log('   ✓ Studenți cu proiecte pot și evalua alte proiecte');
    console.log('   ✓ Juriu deja asignat → buton disabled');
    console.log('   ✓ Note anonime pentru profesor');
    console.log('   ✓ Calcul medie omitând min/max');
    console.log('   ✓ Validare deadline la acordare note');
    console.log('   ✓ Doar proprietar poate asigna juriu');
    console.log('   ✓ Toast notifications pentru toate acțiunile\n');

    console.log('🚀 Pornește aplicația:');
    console.log('   Backend:  npm run dev  (port 3000)');
    console.log('   Frontend: npm start    (port 3001)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Eroare la seeding:', error);
    console.error(error);
    process.exit(1);
  }
}

seedCompleteDatabase();
