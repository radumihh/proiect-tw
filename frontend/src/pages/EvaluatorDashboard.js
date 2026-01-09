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
          <h1>Evaluator Dashboard</h1>
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
              <p>No projects assigned yet.</p>
            </div>
          ) : (
            <ul className="list">
              {projects.map((proj) => (
                <li key={`${proj.projectId}-${proj.deliverableId}`} className="list-item">
                  <h3>{proj.projectTitle}</h3>
                  <p>{proj.projectDescription}</p>
                  <div className="info-grid">
                    <div className="info-row">
                      <span className="info-label">Deliverable:</span>
                      <span className="info-value">{proj.deliverableName}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Deadline:</span>
                      <span className="info-value">{new Date(proj.deadline).toLocaleString()}</span>
                    </div>
                    {proj.videoUrl && (
                      <div className="info-row">
                        <span className="info-label">Video:</span>
                        <span className="info-value">
                          <a href={proj.videoUrl} target="_blank" rel="noopener noreferrer">
                            View Demo
                          </a>
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '15px' }}>
                    <label>Grade (1.00 - 10.00):</label>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="0.01"
                        className="grade-input"
                        value={gradeInputs[`${proj.projectId}-${proj.deliverableId}`] || ''}
                        onChange={(e) => handleGradeChange(proj.projectId, proj.deliverableId, e.target.value)}
                        placeholder="e.g. 8.75"
                      />
                      <button onClick={() => handleSubmitGrade(proj.projectId, proj.deliverableId)}>
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
