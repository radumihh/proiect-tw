# platforma evaluare proiecte studenti

## despre proiect

aplicatie web pentru evaluare anonima proiecte studenti:
- asignare random evaluatori
- anonimitate completa
- calcul medie (omite min si max)
- roluri: student, profesor

## structura repo

```
tehnologii-web-proiect/
├── backend/              
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── package.json
│
├── frontend/             
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
└── README.md
```



## functionalitati

### 1. autentificare
- register si login cu jwt
- 2 roluri: student si profesor

### 2. proiecte
- student creeaza un proiect
- definire deliverables cu deadline
- link video/demo

### 3. asignare evaluatori
- selectie random din toti studentii
- exclude membrii echipei
- configurabil nr evaluatori (default 5)
- asignare per deliverable

### 4. sistem note
- evaluator da note 1.00 - 10.00
- poate modifica nota pana la deadline
- calcul medie: elimina min si max apoi media
- anonimitate totala

### 5. dashboard-uri
- student: creare proiect, deliverables, vedere medie
- evaluator: proiecte asignate, da note
- profesor: toate proiectele si notele

## stack tehnologic

### backend
- node.js + express
- sequelize orm
- mysql
- jwt auth
- bcrypt

### frontend
- react 18
- react router
- axios
- css simplu

## arhitectura backend

```
├── routes       - endpoints
├── controllers  - request/response
├── services     - logica business
├── models       - db schema
├── middleware   - auth
└── utils        - helper functions
```

## baza de date

```
users -> projects -> deliverables
              |
              +-> jury_assignments
              |
              +-> grades
```

## algoritm calcul medie

```javascript
// input: [6.0, 7.5, 8.0, 8.5, 9.5]
// step 1: elimina min (6.0) si max (9.5)
// step 2: raman [7.5, 8.0, 8.5]
// step 3: media = (7.5 + 8.0 + 8.5) / 3 = 8.00
```

## algoritm selectie random

```javascript
// input: projectId, deliverableId, count=5
// step 1: ia toti studentii
// step 2: exclude ownerul
// step 3: shuffle cu fisher-yates
// step 4: ia primii 5
// step 5: insert in jury_assignments
```

## anonimitate

```javascript
// nu se returneaza:
{
  evaluatorId: 123,
  evaluatorName: "john"
}

// doar:
{
  value: 8.75,
  submittedAt: "2025-12-05T10:30:00Z"
}
```

## timeline

| etapa | deadline | status |
|-------|----------|--------|
| etapa 1 | 16.11.2025 | done |
| etapa 2 | 06.12.2025 | done |
| etapa 3 | finala | done |

## testare

### backend
```powershell
cd backend
npm run dev
```

### frontend
```powershell
cd frontend
npm start
```

aplicatia functionala si gata de folosit.
