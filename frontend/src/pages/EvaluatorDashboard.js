import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { juryService, gradeService } from '../services/apiService';
import { toast } from 'react-toastify';

function EvaluatorDashboard() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradeInputs, setGradeInputs] = useState({});

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await juryService.getAssignedProjects();
      setProjects(data.projects || []);
    } catch (err) {
      toast.error('Failed to load assigned projects');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (projectId, deliverableId, value) => {
    setGradeInputs({
      ...gradeInputs,
      [`${projectId}-${deliverableId}`]: value
    });
  };

  const handleSubmitGrade = async (projectId, deliverableId) => {
    const key = `${projectId}-${deliverableId}`;
    const value = parseFloat(gradeInputs[key]);

    if (!value || value < 1 || value > 10) {
      toast.error('Grade must be between 1.00 and 10.00');
      return;
    }

    try {
      await gradeService.submit(projectId, deliverableId, value);
      toast.success('Grade submitted successfully!');
      setGradeInputs({ ...gradeInputs, [key]: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit grade');
    }
  };

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>;

  return (
    <>
      <div className="header">
        <div className="header-content">
          <h1>Evaluate Projects</h1>
          <div className="header-info">
            <span>{user?.name}</span>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <h2>Assigned Projects</h2>
          {projects.length === 0 ? (
            <div className="empty-state">
              <p>You have no assigned projects to evaluate at this time.</p>
            </div>
          ) : (
            <ul className="list">
              {projects.map((proj) => (
                <li key={`${proj.projectId}-${proj.deliverableId}`} className="list-item">
                  <h3 style={{ marginTop: '0', marginBottom: '8px', fontSize: '18px' }}>
                    {proj.projectTitle}
                  </h3>
                  <p style={{ marginBottom: '16px', color: 'var(--gray-600)' }}>
                    {proj.projectDescription}
                  </p>
                  <div className="info-grid">
                    <div className="info-row">
                      <span className="info-label">Deliverable</span>
                      <span className="info-value">{proj.deliverableName}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Deadline</span>
                      <span className="info-value">{new Date(proj.deadline).toLocaleString('ro-RO', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                    {proj.videoUrl && (
                      <div className="info-row">
                        <span className="info-label">Video Demo</span>
                        <span className="info-value">
                          <a href={proj.videoUrl} target="_blank" rel="noopener noreferrer">
                            Watch Video
                          </a>
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{ 
                    marginTop: '20px', 
                    padding: '20px', 
                    background: 'var(--primary-light)', 
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--primary)'
                  }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '12px', 
                      fontWeight: '700', 
                      color: 'var(--gray-900)',
                      fontSize: '14px'
                    }}>
                      Submit Grade (1.00 - 10.00)
                    </label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="0.01"
                        className="grade-input"
                        value={gradeInputs[`${proj.projectId}-${proj.deliverableId}`] || ''}
                        onChange={(e) => handleGradeChange(proj.projectId, proj.deliverableId, e.target.value)}
                        placeholder="8.50"
                        style={{ flex: '1', maxWidth: '180px' }}
                      />
                      <button 
                        onClick={() => handleSubmitGrade(proj.projectId, proj.deliverableId)}
                        style={{ padding: '11px 24px' }}
                      >
                        Submit Grade
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default EvaluatorDashboard;
