# Frontend - Student Evaluation Platform

React SPA pentru platforma de evaluare anonimă a proiectelor studenților.

## Instalare și Rulare

### 1. Instalare dependințe
```powershell
cd frontend
npm install
```

### 2. Configurare
Fișierul `.env` este deja configurat:
```
REACT_APP_API_URL=http://localhost:3000
```

### 3. Pornire aplicație
```powershell
npm start
```

Aplicația se va deschide automat la `http://localhost:3000` în browser.

## IMPORTANT: Backend trebuie să ruleze!

Asigură-te că backend-ul rulează pe `http://localhost:3000` înainte de a porni frontend-ul.

```powershell
# În alt terminal
cd backend
npm run dev
```

## Funcționalități

### Pentru Studenți
1. **Register/Login** - Creează cont și autentifică-te
2. **Dashboard** - Vizualizare proiect personal
3. **Create Project** - Creează un proiect (doar unul per student)
4. **Add Deliverables** - Adaugă livrabile cu deadline și link video
5. **Assign Jury** - Asignează automat evaluatori pentru fiecare livrabil
6. **Jury View** (`/jury`)- Vezi proiectele la care ești asignat ca evaluator și acordă note

### Pentru Profesori
1. **Professor Dashboard** (`/professor`) - Vezi toate proiectele
2. **View Grades** - Vezi sumar note agregate (fără identități evaluatori)
3. **Grade Details** - Vezi notele individuale (anonime) și media calculată

## Structura Aplicației

```
src/
├── components/
│   └── ProtectedRoute.js    # Route protection
├── context/
│   └── AuthContext.js        # Authentication state
├── pages/
│   ├── Login.js              # Login page
│   ├── Register.js           # Registration page
│   ├── StudentDashboard.js   # Student main dashboard
│   ├── EvaluatorDashboard.js # Jury evaluation page
│   └── ProfessorDashboard.js # Professor dashboard
├── services/
│   ├── api.js                # Axios instance with interceptors
│   └── apiService.js         # API service functions
├── App.js                    # Main app with routing
├── index.js                  # Entry point
└── index.css                 # Minimal styling
```

## Flow Complet de Testare

### Pas 1: Creează utilizatori
1. Deschide `http://localhost:3000/register`
2. Înregistrează 5 studenți:
   - Student1 (va fi MP)
   - Student2, Student3, Student4, Student5 (evaluatori)
3. Înregistrează 1 profesor

### Pas 2: Student1 creează proiect
1. Login cu Student1
2. Click "Create Project"
3. Completează titlu și descriere
4. Click "Add Deliverable"
5. Adaugă livrabil cu deadline în viitor
6. Click "Assign Jury" pentru livrabil

### Pas 3: Evaluatorii acordă note
1. Logout Student1
2. Login cu Student2
3. Du-te la `/jury` (sau link în navbar)
4. Vezi proiectul asignat
5. Acordă notă (ex: 8.50)
6. Repetă pentru Student3, Student4, Student5

### Pas 4: Profesor vede rezultate
1. Login cu profesorul
2. Dashboard arată toate proiectele
3. Click "View Grades" pe proiect
4. Vezi:
   - Număr note
   - Media (după eliminare min/max)
   - Note individuale (fără nume evaluatori)

## Navigare

- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Student dashboard (project management)
- `/jury` - Evaluator view (grade assigned projects)
- `/professor` - Professor dashboard (view all projects and grades)

## Styling

Aplicația folosește CSS minimalist în `index.css`:
- Clean white theme
- Simple layout
- No emojis or fancy elements
- Focus on functionality

## API Integration

Toate serviciile sunt în `src/services/apiService.js`:
- `authService` - register, login, logout
- `projectService` - CRUD projects
- `deliverableService` - CRUD deliverables
- `juryService` - assign jury, get assigned projects
- `gradeService` - submit, update, get summary

## Troubleshooting

### "Network Error" sau "Failed to fetch"
- Backend nu rulează sau rulează pe alt port
- Verifică că backend-ul e pe `http://localhost:3000`

### "401 Unauthorized"
- Token expirat sau invalid
- Logout și login din nou

### "403 Forbidden"
- Încerci să accesezi o resursă pentru care nu ai permisiuni
- Verifică rolul utilizatorului

### Nu văd proiecte asignate în `/jury`
- Nu ai fost asignat încă ca evaluator
- Așteaptă ca un MP să asigneze jury pentru un livrabil

## Build pentru Production

```powershell
npm run build
```

Fișierele vor fi în directorul `build/`.

## Note Importante

1. **Anonimitate**: Frontend-ul NU primește niciodată identități de evaluatori
2. **Roluri**: Redirect automat după login bazat pe rol
3. **Protected Routes**: Toate rutele sunt protejate cu ProtectedRoute
4. **JWT**: Token stocat în localStorage
5. **Auto logout**: La 401 Unauthorized

---

**Frontend gata de testare!**
