# 🎓 Platformă Web pentru Evaluarea Anonimă a Proiectelor Studenților

## 📌 Despre Proiect

Aplicație web pentru gestionarea și evaluarea anonimă a proiectelor studenților, cu:
- **Asignare aleatorie** de evaluatori
- **Anonimitate completă** a evaluatorilor
- **Calcul inteligent** al mediei (elimină notele extreme)
- **Roluri diferențiate**: Student MP, Student Evaluator, Profesor

---

## 📂 Structura Repository

```
tehnologii-web-proiect/
├── backend/              ← API Server (Node.js + Express + MySQL)
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── package.json
│   └── README.md
│
├── frontend/             ← Client Application (React)
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
└── README.md            ← Acest fișier
```

---

## 🚀 Quick Start

### Backend (ETAPA 2 - COMPLET ✅)

```powershell
cd backend

# Citește instrucțiunile complete
# Opțiunea 1: START_HERE.md (5 min read)
# Opțiunea 2: INSTRUCTIUNI.md (ghid complet)

# Instalare rapidă
npm install
npm run migrate
npm run dev

# Server pornit pe http://localhost:3000
```

**📖 Documentație Backend:**
- `START_HERE.md` - Sumar rapid și ghid de pornire
- `INSTRUCTIUNI.md` - Tutorial pas cu pas
- `LIVRABIL_ETAPA2.md` - Document prezentare completă
- `CHECKLIST.md` - Verificare înainte de prezentare
- `README.md` - Documentație generală API

---

## 📅 Timeline Proiect

### ✅ Etapa 1 - 16.11.2025 (COMPLETAT)
- [x] Specificații detaliate (`prompt-uman.txt`, `prompt-agent.txt`)
- [x] Plan de proiect
- [x] Repository Git creat
- [x] Structură inițială

### ✅ Etapa 2 - 06.12.2025 (COMPLETAT)
- [x] Backend RESTful complet funcțional
- [x] Toate endpoint-urile implementate
- [x] Bază de date MySQL cu 5 tabele
- [x] Autentificare JWT
- [x] Asignare aleatorie evaluatori
- [x] Calcul medie (elimină extreme)
- [x] Anonimitate evaluatori
- [x] Instrucțiuni complete de rulare
- [x] Testabil în Postman

### ✅ Etapa 3 - Finală (COMPLETAT)
- [x] Frontend React complet
- [x] Integrare backend + frontend
- [x] Toate funcționalitățile testate
- [ ] Deploy (backend + frontend) - optional
- [x] Demo funcțional local

---

## 🎯 Funcționalități Principale

### 1. Autentificare & Roluri
- Înregistrare și autentificare cu JWT
- 2 roluri: **Student** și **Profesor**
- Permisiuni diferite per rol

### 2. Gestionare Proiecte
- Student poate crea **UN proiect**
- Definire livrabile (etape) cu deadline-uri
- Upload link video/demo

### 3. Asignare Evaluatori (★ CORE)
- Selecție **ALEATORIE** din toți studenții
- **EXCLUDE** automat membrii echipei proiectului
- Configurabil număr evaluatori (default: 5)
- Asignare per livrabil

### 4. Sistem Note (★ CORE)
- Evaluator acordă note **1.00 - 10.00**
- Poate modifica nota **până la deadline**
- Calcul medie: **elimină min și max**, apoi media
- **Anonimitate totală**: profesorul NU vede identități

### 5. Dashboard-uri per Rol
- **Student MP**: Creare proiect, gestionare livrabile, vedere medie
- **Evaluator**: Vezi proiecte asignate, acordă/modifică note
- **Profesor**: Vezi toate proiectele și notele agregate

---

## 🛠️ Stack Tehnologic

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **ORM**: Sequelize
- **DB**: MySQL
- **Auth**: JWT + bcrypt
- **Middleware**: CORS

### Frontend (Etapa 3 - COMPLETAT)
- **Framework**: React 18
- **Routing**: React Router v6
- **State**: Context API
- **HTTP**: Axios
- **Styling**: Clean CSS (minimal white theme)

---

## 📊 Arhitectură

### Backend Structure
```
MVC Pattern + Services Layer
├── Routes       → HTTP endpoints
├── Controllers  → Request/Response handling
├── Services     → Business logic
├── Models       → Database schemas
├── Middleware   → Auth & permissions
└── Utils        → Helper functions
```

### Database Schema
```
Users ──┬─→ Projects ──┬─→ Deliverables
        │               │
        │               ├─→ JuryAssignments
        │               │
        └───────────────┴─→ Grades
```

---

## 🎓 Pentru Dezvoltatori

### Pornire Dezvoltare Backend
```powershell
cd backend
npm run dev     # Auto-reload cu nodemon
```

### Testare API
```powershell
# PowerShell script
.\test-api.ps1

# SAU Postman
# Importă: Postman_Collection.json
```

### Bază de Date
```sql
-- Creare DB
CREATE DATABASE student_evaluation;

-- SAU rulează
mysql -u root -p < database_schema.sql
```

---

## 📝 Documente Importante

### Specificații
- `prompt-uman.txt` - Descriere completă în română (cerințe, roluri, flow)
- `prompt-agent.txt` - Specificații tehnice pentru implementare

### Backend (Directorul `backend/`)
- `START_HERE.md` - **ÎNCEPE AICI!** Sumar rapid
- `INSTRUCTIUNI.md` - Tutorial instalare pas cu pas
- `LIVRABIL_ETAPA2.md` - Prezentare completă Etapa 2
- `CHECKLIST.md` - Verificare înainte de prezentare
- `README.md` - Documentație API
- `database_schema.sql` - Schema SQL manuală

---

## 🔥 Highlights Tehnice

### Algoritm Calcul Medie
```javascript
// Input: [6.0, 7.5, 8.0, 8.5, 9.5]
// Step 1: Elimină min (6.0) și max (9.5)
// Step 2: Rămân [7.5, 8.0, 8.5]
// Step 3: Media = (7.5 + 8.0 + 8.5) / 3 = 8.00
```

### Algoritm Selecție Aleatorie
```javascript
// Input: projectId, deliverableId, count=5
// Step 1: Get all students
// Step 2: Exclude project.ownerId
// Step 3: Shuffle (Fisher-Yates)
// Step 4: Take first 5
// Step 5: Insert in jury_assignments
```

### Anonimitate Garantată
```javascript
// ❌ NU se returnează NICIODATĂ:
{
  evaluatorId: 123,
  evaluatorName: "John Doe"
}

// ✅ Doar:
{
  value: 8.75,
  submittedAt: "2025-12-05T10:30:00Z"
}
```

---

## 🤝 Contribuitori

- **Nume Student**: [Numele tău]
- **Grupă**: [Grupa ta]
- **Profesor**: [Numele profesorului]
- **Disciplină**: Tehnologii Web
- **An Universitar**: 2024-2025

---

## 📞 Contact & Suport

Pentru probleme:
1. Verifică `INSTRUCTIUNI.md` în directorul `backend/`
2. Verifică `CHECKLIST.md` pentru troubleshooting
3. Verifică issues în repository
4. Contactează echipa

---

## 📄 Licență

Acest proiect este dezvoltat în scop educațional pentru cursul de Tehnologii Web.

---

## 🎉 Status Proiect

| Etapă | Deadline | Status |
|-------|----------|--------|
| Etapa 1 | 16.11.2025 | ✅ COMPLETAT |
| Etapa 2 | 06.12.2025 | ✅ COMPLETAT |
| Etapa 3 | Finală | ✅ COMPLETAT |

**Ultima actualizare**: 05.12.2025

---

## 🚀 Quick Start - Aplicație Completă

### Backend
```powershell
cd backend
npm install
npm run migrate
npm run dev
```

### Frontend (în alt terminal)
```powershell
cd frontend
npm install
npm start
```

### Testare Completă
Citește `frontend/TESTARE.md` pentru flow complet de testare (15 minute).

---

**🎉 APLICAȚIE COMPLETĂ ȘI FUNCȚIONALĂ!**
**Ready for demo și prezentare finală!**
