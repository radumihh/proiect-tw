/**
 * Script de setup complet pentru baza de date cu date de test
 * Rulează: npm run setup-db
 * 
 * ATENȚIE: Acest script șTERGE toate datele existente și creează date de test
 * Folosit doar pentru dezvoltare și testare, NU pentru producție
 * 
 * Date create:
 * - 1 profesor
 * - 5 studenți
 * - 2 proiecte cu livrabile
 * - Asignări de juriu
 * - Note de test
 */
const sequelize = require('./models/sequelize');
const User = require('./models/User');
const Project = require('./models/Project');
const Deliverable = require('./models/Deliverable');
const JuryAssignment = require('./models/JuryAssignment');
const Grade = require('./models/Grade');
const bcrypt = require('bcrypt');

/**
 * Funcție principală de setup
 * Șterge și recreează toate tabelele, apoi populează cu date de test
 */
async function setupDatabase() {
  try {
    console.log('🔄 Conectare la baza de date...');
    await sequelize.authenticate();
    console.log('✅ Conexiune reușită!\n');

    // Șterge și recrează toate tabelele
    console.log('🔄 Ștergere tabele existente...');
    await sequelize.sync({ force: true });
    console.log('✅ Tabele create cu succes!\n');

    console.log('📊 Tabele create:');
    console.log('  - users');
    console.log('  - projects');
    console.log('  - deliverables');
    console.log('  - jury_assignments');
    console.log('  - grades\n');

    // Populare cu date de test
    console.log('🔄 Populare cu date de test...\n');

    // Creare utilizatori
    console.log('👤 Creare utilizatori...');
    const passwordHash = await bcrypt.hash('password123', 10);

    const profesor = await User.create({
      name: 'Prof. Ion Popescu',
      email: 'profesor@example.com',
      passwordHash: passwordHash,
      role: 'professor'
    });
    console.log('  ✅ Profesor creat: profesor@example.com / password123');

    const student1 = await User.create({
      name: 'Maria Ionescu',
      email: 'maria@example.com',
      passwordHash: passwordHash,
      role: 'student'
    });
    console.log('  ✅ Student 1 (MP): maria@example.com / password123');

    const student2 = await User.create({
      name: 'Andrei Popescu',
      email: 'andrei@example.com',
      passwordHash: passwordHash,
      role: 'student'
    });
    console.log('  ✅ Student 2: andrei@example.com / password123');

    const student3 = await User.create({
      name: 'Elena Dumitrescu',
      email: 'elena@example.com',
      passwordHash: passwordHash,
      role: 'student'
    });
    console.log('  ✅ Student 3: elena@example.com / password123');

    const student4 = await User.create({
      name: 'Alexandru Stan',
      email: 'alex@example.com',
      passwordHash: passwordHash,
      role: 'student'
    });
    console.log('  ✅ Student 4: alex@example.com / password123');

    const student5 = await User.create({
      name: 'Ioana Marin',
      email: 'ioana@example.com',
      passwordHash: passwordHash,
      role: 'student'
    });
    console.log('  ✅ Student 5: ioana@example.com / password123\n');

    // Creare proiect pentru student1 (MP)
    console.log('📁 Creare proiect...');
    const project = await Project.create({
      ownerId: student1.id,
      title: 'Platformă E-learning Interactivă',
      description: 'O platformă modernă de învățare online cu funcționalități avansate de interacțiune student-profesor.'
    });
    console.log(`  ✅ Proiect creat: "${project.title}"\n`);

    // Creare livrabile
    console.log('📋 Creare livrabile...');
    const now = new Date();
    
    const deliverable1 = await Deliverable.create({
      projectId: project.id,
      name: 'Etapa 1 - Analiza și Design',
      deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // +7 zile
      videoUrl: 'https://youtube.com/watch?v=demo1'
    });
    console.log(`  ✅ Livrabil 1: "${deliverable1.name}" (deadline: ${deliverable1.deadline.toLocaleDateString()})`);

    const deliverable2 = await Deliverable.create({
      projectId: project.id,
      name: 'Etapa 2 - Implementare Backend',
      deadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // +14 zile
      videoUrl: 'https://youtube.com/watch?v=demo2'
    });
    console.log(`  ✅ Livrabil 2: "${deliverable2.name}" (deadline: ${deliverable2.deadline.toLocaleDateString()})`);

    const deliverable3 = await Deliverable.create({
      projectId: project.id,
      name: 'Etapa 3 - Implementare Frontend',
      deadline: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // +21 zile
      videoUrl: 'https://youtube.com/watch?v=demo3'
    });
    console.log(`  ✅ Livrabil 3: "${deliverable3.name}" (deadline: ${deliverable3.deadline.toLocaleDateString()})\n`);

    // Asignare juriu pentru primul livrabil
    console.log('⚖️ Asignare juriu pentru Livrabil 1...');
    const evaluatori = [student2, student3, student4, student5];
    const evaluatoriSelectati = evaluatori.sort(() => 0.5 - Math.random()).slice(0, 4);

    for (const evaluator of evaluatoriSelectati) {
      await JuryAssignment.create({
        projectId: project.id,
        deliverableId: deliverable1.id,
        evaluatorId: evaluator.id
      });
      console.log(`  ✅ ${evaluator.name} asignat ca evaluator`);
    }
    console.log('');

    // Adăugare note pentru primul livrabil
    console.log('📝 Adăugare note pentru Livrabil 1...');
    const notePosibile = [8.50, 9.00, 8.75, 9.25];
    
    for (let i = 0; i < evaluatoriSelectati.length; i++) {
      const evaluator = evaluatoriSelectati[i];
      const nota = notePosibile[i];
      
      await Grade.create({
        projectId: project.id,
        deliverableId: deliverable1.id,
        evaluatorId: evaluator.id,
        value: nota
      });
      console.log(`  ✅ ${evaluator.name}: ${nota}`);
    }
    
    // Calcul medie (fără min și max)
    const noteArray = notePosibile.sort((a, b) => a - b);
    const noteFiltrate = noteArray.slice(1, -1);
    const medie = noteFiltrate.reduce((a, b) => a + b, 0) / noteFiltrate.length;
    console.log(`  📊 Media finală (fără min/max): ${medie.toFixed(2)}\n`);

    console.log('🎉 BAZA DE DATE COMPLETĂ ȘI FUNCȚIONALĂ!\n');
    console.log('═══════════════════════════════════════════════');
    console.log('📋 CONTURI DE TEST:');
    console.log('═══════════════════════════════════════════════');
    console.log('👨‍🏫 PROFESOR:');
    console.log('   Email: profesor@example.com');
    console.log('   Parolă: password123');
    console.log('');
    console.log('👩‍🎓 STUDENȚI:');
    console.log('   1. maria@example.com / password123 (Manager Proiect)');
    console.log('   2. andrei@example.com / password123 (Evaluator)');
    console.log('   3. elena@example.com / password123 (Evaluator)');
    console.log('   4. alex@example.com / password123 (Evaluator)');
    console.log('   5. ioana@example.com / password123 (Evaluator)');
    console.log('═══════════════════════════════════════════════\n');

    console.log('🚀 Poți porni aplicația cu: npm run dev\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Rulare setup
setupDatabase();
