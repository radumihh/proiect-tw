/**
 * Servicii API pentru comunicarea cu backend-ul
 * Fiecare serviciu grupează funcționalitățile legate de o entitate
 */
import api from './api';

/**
 * Serviciu pentru autentificare și gestionarea utilizatorilor
 */
export const authService = {
  register: async (name, email, password, role) => {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

/**
 * Serviciu pentru gestionarea proiectelor
 */
export const projectService = {
  create: async (title, description) => {
    const response = await api.post('/projects', { title, description });
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  }
};

/**
 * Serviciu pentru gestionarea livrabilelor parțiale
 */
export const deliverableService = {
  create: async (projectId, name, deadline, videoUrl, weight) => {
    const response = await api.post(`/projects/${projectId}/deliverables`, {
      name,
      deadline,
      videoUrl,
      weight
    });
    return response.data;
  },

  getByProject: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/deliverables`);
    return response.data;
  }
};

/**
 * Serviciu pentru gestionarea juriului și asignărilor
 */
export const juryService = {
  assignJury: async (projectId, deliverableId, evaluatorCount = 5) => {
    const response = await api.post(`/jury/projects/${projectId}/assign-jury`, {
      deliverableId,
      evaluatorCount
    });
    return response.data;
  },

  getAssignedProjects: async () => {
    const response = await api.get('/jury/projects');
    return response.data;
  }
};

/**
 * Serviciu pentru gestionarea notelor acordate de evaluatori
 */
export const gradeService = {
  submit: async (projectId, deliverableId, value) => {
    const response = await api.post('/grades', {
      projectId,
      deliverableId,
      value
    });
    return response.data;
  },

  update: async (gradeId, value) => {
    const response = await api.put(`/grades/${gradeId}`, { value });
    return response.data;
  },

  getSummary: async (projectId) => {
    const response = await api.get(`/grades/projects/${projectId}/summary`);
    return response.data;
  }
};
