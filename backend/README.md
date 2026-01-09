# Backend - Platforma Evaluare Proiecte Studenți

## Descriere
API RESTful pentru sistemul de evaluare anonimă a proiectelor studenților cu asignare aleatorie de evaluatori și agregare inteligentă a notelor.

## Tehnologii
- Node.js + Express
- Sequelize ORM
- MySQL
- JWT Authentication
- bcrypt pentru hash-uri parole

## Instalare și Rulare

### 1. Instalare dependințe
```bash
cd backend
npm install
```

### 2. Configurare MySQL
Creați o bază de date MySQL:
```sql
CREATE DATABASE student_evaluation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configurare mediu
Copiați `.env.example` în `.env` și configurați variabilele:
```bash
copy .env.example .env
```

Editați `.env` cu valorile pentru MySQL:
- `DB_HOST` - host MySQL (localhost)
- `DB_PORT` - port MySQL (3306)
- `DB_NAME` - nume bază de date (student_evaluation)
- `DB_USER` - utilizator MySQL
- `DB_PASSWORD` - parolă MySQL
- `JWT_SECRET` - cheie secretă JWT (OBLIGATORIU de schimbat!)

### 4. Inițializare bază de date
```bash
npm run migrate
```
Această comandă va crea toate tabelele necesare în baza de date MySQL.

### 5. Pornire server

**Development (cu auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Serverul va porni implicit pe `http://localhost:3000`

## Structura API

### Autentificare
- `POST /auth/register` - Înregistrare utilizator nou
- `POST /auth/login` - Autentificare

### Proiecte
- `POST /projects` - Creare proiect (MP only)
- `GET /projects` - Listare proiecte (filtrate după rol)
- `GET /projects/:id` - Detalii proiect

### Livrabile
- `POST /projects/:id/deliverables` - Adăugare livrabil (MP only)
- `GET /projects/:id/deliverables` - Listare livrabile

### Juriu
- `POST /projects/:id/assign-jury` - Asignare automată evaluatori
- `GET /jury/projects` - Proiecte asignate evaluatorului

### Note
- `POST /grades` - Adăugare notă (evaluator only)
- `PUT /grades/:id` - Modificare notă proprie (înainte de deadline)
- `GET /projects/:id/grades-summary` - Sumar note (profesor only)

## Testare cu Postman

### 1. Înregistrare utilizator
`POST http://localhost:3000/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

### 2. Login
`POST http://localhost:3000/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Răspuns va include `token` pe care îl veți folosi în header-ul `Authorization: Bearer <token>` pentru toate cererile ulterioare.

### 3. Creare proiect
`POST http://localhost:3000/projects` (cu token în header)
```json
{
  "title": "Proiect TW",
  "description": "Aplicație web pentru evaluare proiecte"
}
```

### 4. Adăugare livrabil
`POST http://localhost:3000/projects/1/deliverables` (cu token în header)
```json
{
  "name": "Etapa 1",
  "deadline": "2025-12-20T23:59:59",
  "videoUrl": "https://youtube.com/watch?v=example"
}
```

### 5. Asignare evaluatori
`POST http://localhost:3000/projects/1/assign-jury` (cu token în header)
```json
{
  "deliverableId": 1,
  "evaluatorCount": 5
}
```

### 6. Adăugare notă (ca evaluator)
`POST http://localhost:3000/grades` (cu token evaluator în header)
```json
{
  "projectId": 1,
  "deliverableId": 1,
  "value": 8.75
}
```

### 7. Sumar note (ca profesor)
`GET http://localhost:3000/projects/1/grades-summary` (cu token profesor în header)

## Reguli de Business

- **Anonimitate**: Evaluatorii sunt anonimi, identitatea lor nu este expusă în API
- **Asignare aleatorie**: Sistemul alege aleatoriu evaluatori care NU sunt membrii proiectului
- **Calcul note**: Media elimină nota minimă și maximă înainte de calcul
- **Deadline-uri**: Notele pot fi modificate doar înainte de deadline-ul livrabilului
- **Permisiuni stricte**: Fiecare rol are acces doar la resursele permise

## Roluri

1. **Student MP** (Membru Proiect): creează proiecte și livrabile
2. **Student Evaluator**: evaluează proiecte asignate aleatoriu
3. **Profesor**: vizualizează toate proiectele și notele agregate

## Note Dezvoltare

- Baza de date: MySQL cu Sequelize ORM
- JWT secret TREBUIE schimbat în production
- Toate endpoint-urile sunt protejate cu middleware de autentificare
- Validarea rolurilor se face automat prin middleware
- Conexiunea la MySQL se închide graceful la oprirea serverului
