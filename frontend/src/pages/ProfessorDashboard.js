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
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to load grades summary');
    }
  };

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>;

  return (
    <>
      <div className="header">
        <div className="header-content">
          <h1>Professor Dashboard</h1>
          <div className="header-info">
            <span>{user?.name}</span>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <h2>All Projects</h2>
          {projects.length === 0 ? (
            <div className="empty-state">
              <p>No projects yet.</p>
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
                    <td>{proj.id}</td>
                    <td>{proj.title}</td>
                    <td>{proj.owner?.name || 'N/A'}</td>
                    <td>{new Date(proj.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleViewGrades(proj.id)}>View Grades</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {gradesSummary && selectedProject && (
          <div className="card">
            <h2>Grades Summary: {gradesSummary.projectTitle}</h2>
            
            {/* Project Average */}
            {gradesSummary.projectAverage !== null && (
              <div style={{ 
                backgroundColor: '#e8f5e9', 
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '30px',
                textAlign: 'center'
              }}>
                <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#2e7d32' }}>
                  Project Average Grade
                </h3>
                <div style={{ 
                  fontSize: '48px', 
                  fontWeight: 'bold', 
                  color: '#1b5e20' 
                }}>
                  {gradesSummary.projectAverage.toFixed(2)}
                </div>
                <small style={{ color: '#558b2f', fontSize: '0.9rem' }}>
                  {gradesSummary.deliverables.every(d => d.weight !== null) 
                    ? 'Weighted average based on deliverable percentages' 
                    : 'Simple average of all deliverables'}
                </small>
              </div>
            )}
            
            {gradesSummary.deliverables && gradesSummary.deliverables.length === 0 ? (
              <p>No deliverables for this project yet.</p>
            ) : (
              <div>
                {gradesSummary.deliverables.map((deliv) => (
                  <div key={deliv.deliverableId} style={{ marginBottom: '30px' }}>
                    <h3>{deliv.deliverableName}</h3>
                    <div className="info-grid">
                      <div className="info-row">
                        <span className="info-label">Deadline:</span>
                        <span className="info-value">{new Date(deliv.deadline).toLocaleString()}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Weight:</span>
                        <span className="info-value">
                          {deliv.weight !== null ? `${deliv.weight.toFixed(2)}%` : 'Not set'}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Number of Grades:</span>
                        <span className="info-value">{deliv.gradesCount}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Average Grade:</span>
                        <span className="info-value" style={{ fontWeight: 'bold', fontSize: '18px' }}>
                          {deliv.averageGrade !== null ? deliv.averageGrade.toFixed(2) : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {deliv.grades && deliv.grades.length > 0 && (
                      <>
                        <h4 style={{ marginTop: '15px', marginBottom: '10px' }}>Individual Grades (Anonymous)</h4>
                        <table>
                          <thead>
                            <tr>
                              <th>Grade</th>
                              <th>Submitted At</th>
                            </tr>
                          </thead>
                          <tbody>
                            {deliv.grades.map((grade, idx) => (
                              <tr key={idx}>
                                <td>{grade.value.toFixed(2)}</td>
                                <td>{new Date(grade.submittedAt).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
            <button className="secondary" onClick={() => setGradesSummary(null)}>Close</button>
          </div>
        )}
      </div>
    </>
  );
}

export default ProfessorDashboard;
