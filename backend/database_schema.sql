-- Script SQL pentru inițializare bază de date
-- Platforma Evaluare Proiecte Studenți

-- 1. Creare bază de date
CREATE DATABASE IF NOT EXISTS student_evaluation 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 2. Selectare bază de date
USE student_evaluation;

-- 3. Ștergere tabele existente (dacă există)
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS jury_assignments;
DROP TABLE IF EXISTS deliverables;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;

-- 4. Creare tabel Users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    role ENUM('student', 'professor') NOT NULL DEFAULT 'student',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Creare tabel Projects
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ownerId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_ownerId (ownerId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Creare tabel Deliverables
CREATE TABLE deliverables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    projectId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    deadline DATETIME NOT NULL,
    videoUrl VARCHAR(500),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_projectId (projectId),
    INDEX idx_deadline (deadline)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Creare tabel JuryAssignments
CREATE TABLE jury_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    projectId INT NOT NULL,
    deliverableId INT NOT NULL,
    evaluatorId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (deliverableId) REFERENCES deliverables(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluatorId) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (projectId, deliverableId, evaluatorId),
    INDEX idx_evaluatorId (evaluatorId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Creare tabel Grades
CREATE TABLE grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    projectId INT NOT NULL,
    deliverableId INT NOT NULL,
    evaluatorId INT NOT NULL,
    value DECIMAL(4,2) NOT NULL CHECK (value >= 1.00 AND value <= 10.00),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (deliverableId) REFERENCES deliverables(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluatorId) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_grade (projectId, deliverableId, evaluatorId),
    INDEX idx_projectId_deliverableId (projectId, deliverableId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Verificare tabele create
SHOW TABLES;

-- 10. Afișare structură tabele
DESCRIBE users;
DESCRIBE projects;
DESCRIBE deliverables;
DESCRIBE jury_assignments;
DESCRIBE grades;

-- Script completat cu succes!
-- Acum puteți rula: npm run migrate
-- SAU puteți folosi direct aceste tabele
