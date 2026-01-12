import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectService, gradeService } from '../services/apiService';
import { toast } from 'react-toastify';

function ProfessorDashboard() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [gradesSummary, setGradesSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAll();
      setProjects(data.projects || []);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleViewGrades = async (projectId) => {
    try {
      const summary = await gradeService.getSummary(projectId);
      setGradesSummary(summary);
      setSelectedProject(projectId);
      setShowModal(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to load grades summary');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setGradesSummary(null);
    setSelectedProject(null);
  };

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>;

  return (
    <>
      <div className="header">
        <div className="header-content">
          <h1>All Projects</h1>
          <div className="header-info">
            <span>{user?.name}</span>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <h2>Student Projects</h2>
          {projects.length === 0 ? (
            <div className="empty-state">
              <p>No projects have been created yet.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Owner</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr key={proj.id}>
                    <td style={{ fontWeight: '600' }}>{proj.id}</td>
                    <td style={{ fontWeight: '600', color: 'var(--gray-900)' }}>{proj.title}</td>
                    <td>{proj.owner?.name || 'N/A'}</td>
                    <td>{new Date(proj.createdAt).toLocaleDateString('ro-RO', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</td>
                    <td>
                      <button onClick={() => handleViewGrades(proj.id)} style={{ padding: '8px 16px', fontSize: '13px' }}>
                        View Grades
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showModal && gradesSummary && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{gradesSummary.projectTitle}</h2>
                <button className="modal-close" onClick={closeModal}>&times;</button>
              </div>
              
              <div className="modal-body">
                {gradesSummary.projectAverage !== null && (
                  <>
                    <div className="project-average">
                      <h3>Nota Generală Proiect</h3>
                      <div className="project-average-value">
                        {gradesSummary.projectAverage.toFixed(2)}
                      </div>
                      <small>
                        {gradesSummary.deliverables.every(d => d.weight !== null) 
                          ? '✓ Media ponderată bazată pe procentele deliverable-urilor' 
                          : 'Media simplă a tuturor deliverable-urilor'}
                      </small>
                    </div>
                    
                    <div style={{ 
                      background: 'var(--gray-50)', 
                      padding: '20px', 
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--gray-200)',
                      marginBottom: '32px'
                    }}>
                      <p style={{ 
                        margin: '0 0 12px 0', 
                        fontSize: '14px', 
                        color: 'var(--gray-700)',
                        fontWeight: '600'
                      }}>
                        Metodă de calcul:
                      </p>
                      <ul style={{ 
                        margin: '0', 
                        paddingLeft: '20px',
                        fontSize: '13px',
                        color: 'var(--gray-600)',
                        lineHeight: '1.8'
                      }}>
                        <li><strong>Pentru fiecare deliverable:</strong> Media notelor individuale (omite min și max dacă sunt ≥3 note)</li>
                        <li><strong>Pentru nota finală:</strong> Media ponderată folosind weight-ul fiecărui deliverable</li>
                        <li><strong>Anonimizare:</strong> Identitatea evaluatorilor rămâne confidențială</li>
                      </ul>
                    </div>
                  </>
                )}

                {gradesSummary.deliverables && gradesSummary.deliverables.length === 0 ? (
                  <div className="empty-state">
                    <p>Nu există deliverable-uri pentru acest proiect încă.</p>
                  </div>
                ) : (
                  <div className="project-details-section">
                    <h3>Deliverable-uri & Note</h3>
                    {gradesSummary.deliverables.map((deliv) => (
                      <div key={deliv.deliverableId} className="deliverable-card">
                        <h4>{deliv.deliverableName}</h4>
                        <div className="info-grid">
                          <div className="info-row">
                            <span className="info-label">Deadline</span>
                            <span className="info-value">{new Date(deliv.deadline).toLocaleString('ro-RO', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Pondere</span>
                            <span className="info-value">
                              {deliv.weight !== null ? `${deliv.weight.toFixed(2)}%` : 'Nesetat'}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Note Primite</span>
                            <span className="info-value">{deliv.gradesCount}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Notă Medie</span>
                            <span className="info-value" style={{ fontWeight: '700', fontSize: '20px', color: 'var(--primary)' }}>
                              {deliv.averageGrade !== null ? deliv.averageGrade.toFixed(2) : 'N/A'}
                            </span>
                          </div>
                        </div>

                        {deliv.grades && deliv.grades.length > 0 && (
                          <div style={{ marginTop: '16px' }}>
                            <strong style={{ 
                              fontSize: '13px', 
                              color: 'var(--gray-600)', 
                              textTransform: 'uppercase', 
                              letterSpacing: '0.05em',
                              display: 'block',
                              marginBottom: '12px'
                            }}>
                              Note Individuale (Anonime)
                              {deliv.grades.length >= 3 && (
                                <span style={{ 
                                  fontWeight: '500', 
                                  textTransform: 'none', 
                                  letterSpacing: '0',
                                  fontSize: '12px',
                                  marginLeft: '8px',
                                  color: 'var(--primary)'
                                }}>
                                  — Media omite min și max
                                </span>
                              )}
                            </strong>
                            <div className="grade-list">
                              {deliv.grades.map((grade, idx) => (
                                <div key={idx} className="grade-item">
                                  <span>{new Date(grade.submittedAt).toLocaleString('ro-RO', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}</span>
                                  <span className="grade-value">{grade.value.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button className="secondary" onClick={closeModal}>Închide</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProfessorDashboard;
