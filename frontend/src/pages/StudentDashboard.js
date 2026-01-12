import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectService, deliverableService, juryService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function StudentDashboard() {
  const { user, logout } = useAuth();
  const [project, setProject] = useState(null);
  const [deliverables, setDeliverables] = useState([]);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateDeliverable, setShowCreateDeliverable] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [projectForm, setProjectForm] = useState({ title: '', description: '' });
  const [deliverableForm, setDeliverableForm] = useState({
    name: '',
    deadline: '',
    videoUrl: '',
    weight: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const projectsData = await projectService.getAll();
      if (projectsData.projects && projectsData.projects.length > 0) {
        const myProject = projectsData.projects[0];
        setProject(myProject);
        const delivsData = await deliverableService.getByProject(myProject.id);
        setDeliverables(delivsData.deliverables || []);
      }
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // calculeaza total weight si ramasa
  const calculateWeights = () => {
    const totalUsed = deliverables.reduce((sum, d) => {
      return sum + (d.weight ? parseFloat(d.weight) : 0);
    }, 0);
    const remaining = 100 - totalUsed;
    return { totalUsed, remaining };
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await projectService.create(projectForm.title, projectForm.description);
      toast.success('Project created successfully!');
      setShowCreateProject(false);
      setProjectForm({ title: '', description: '' });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create project');
    }
  };

  const handleCreateDeliverable = async (e) => {
    e.preventDefault();
    try {
      let weightValue;
      if (deliverableForm.weight) {
        weightValue = parseFloat(deliverableForm.weight);
      } else {
        const { remaining } = calculateWeights();
        weightValue = remaining;
      }

      await deliverableService.create(
        project.id,
        deliverableForm.name,
        deliverableForm.deadline,
        deliverableForm.videoUrl,
        weightValue
      );
      toast.success('Deliverable created successfully!');
      setShowCreateDeliverable(false);
      setDeliverableForm({ name: '', deadline: '', videoUrl: '', weight: '' });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create deliverable');
    }
  };

  const handleAssignJury = async (deliverableId) => {
    try {
      const result = await juryService.assignJury(project.id, deliverableId, 5);
      toast.success(result.message || 'Jury assigned successfully!');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to assign jury');
    }
  };

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>;

  return (
    <>
      <div className="header">
        <div className="header-content">
          <h1>My Project</h1>
          <div className="header-info">
            <span>{user?.name}</span>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container">
        {!project ? (
          <div className="card">
            <h2>Create Your Project</h2>
            {!showCreateProject ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <p style={{ marginBottom: '24px', color: 'var(--gray-600)', fontSize: '15px' }}>
                  You haven't created a project yet. Get started by creating your first project.
                </p>
                <button onClick={() => setShowCreateProject(true)}>Create Project</button>
              </div>
            ) : (
              <form onSubmit={handleCreateProject}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    rows="4"
                  />
                </div>
                <div className="actions">
                  <button type="submit">Create</button>
                  <button type="button" className="secondary" onClick={() => setShowCreateProject(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ marginBottom: '8px', paddingBottom: '0', border: 'none' }}>{project.title}</h2>
                  <p style={{ margin: '0', color: 'var(--gray-600)' }}>{project.description}</p>
                </div>
              </div>
              <div className="info-grid">
                <div className="info-row">
                  <span className="info-label">Project ID</span>
                  <span className="info-value">{project.id}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Created</span>
                  <span className="info-value">{new Date(project.createdAt).toLocaleDateString('ro-RO', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Deliverables</span>
                  <span className="info-value">{deliverables.length}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Total Weight</span>
                  <span className="info-value">{calculateWeights().totalUsed.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Deliverables</h2>
              {deliverables.length === 0 ? (
                <div className="empty-state">
                  <p>No deliverables added yet. Create your first deliverable to get started.</p>
                </div>
              ) : (
                <ul className="list">
                  {deliverables.map((deliv) => (
                    <li key={deliv.id} className="list-item">
                      <div className="deliverable-header">
                        <h3>{deliv.name}</h3>
                        {deliv.juryAssigned && (
                          <span className="badge success">
                            Jury Assigned ({deliv.juryCount} evaluators)
                          </span>
                        )}
                      </div>
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
                          <span className="info-label">Weight</span>
                          <span className="info-value">
                            {deliv.weight ? `${parseFloat(deliv.weight).toFixed(2)}%` : 'Not set'}
                          </span>
                        </div>
                        {deliv.videoUrl && (
                          <div className="info-row">
                            <span className="info-label">Video</span>
                            <span className="info-value">
                              <a href={deliv.videoUrl} target="_blank" rel="noopener noreferrer">
                                View Demo
                              </a>
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="deliverable-actions">
                        {deliv.juryAssigned ? (
                          <button className="assigned" disabled>
                            Jury Already Assigned
                          </button>
                        ) : (
                          <button className="success" onClick={() => handleAssignJury(deliv.id)}>
                            Assign Jury
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {!showCreateDeliverable ? (
                <>
                  {calculateWeights().remaining > 0 && (
                    <div style={{ 
                      marginTop: '24px', 
                      padding: '16px', 
                      background: 'var(--primary-light)', 
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--primary)',
                      textAlign: 'center'
                    }}>
                      <p style={{ margin: '0', color: 'var(--primary)', fontWeight: '600', fontSize: '14px' }}>
                        Available weight: {calculateWeights().remaining.toFixed(2)}% 
                        {deliverables.length === 0 && ' — Add your first deliverable'}
                      </p>
                    </div>
                  )}
                  <button 
                    style={{ marginTop: '20px', width: '100%' }}
                    onClick={() => {
                      const { remaining } = calculateWeights();
                      setDeliverableForm({ ...deliverableForm, weight: remaining > 0 ? remaining.toFixed(2) : '' });
                      setShowCreateDeliverable(true);
                    }}
                    disabled={project && calculateWeights().remaining <= 0}
                  >
                    Add Deliverable
                  </button>
                  {project && calculateWeights().remaining <= 0 && (
                    <p style={{ color: 'var(--danger)', fontSize: '14px', marginTop: '12px', textAlign: 'center', fontWeight: '500' }}>
                      Total weight is 100%. Edit existing deliverables to redistribute weight.
                    </p>
                  )}
                </>
              ) : (
                <form onSubmit={handleCreateDeliverable} style={{ 
                  marginTop: '24px', 
                  padding: '24px', 
                  background: 'var(--gray-50)', 
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--gray-200)'
                }}>
                  <h3 style={{ marginTop: '0', marginBottom: '20px', color: 'var(--gray-900)' }}>New Deliverable</h3>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      value={deliverableForm.name}
                      onChange={(e) => setDeliverableForm({ ...deliverableForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Deadline</label>
                    <input
                      type="datetime-local"
                      value={deliverableForm.deadline}
                      onChange={(e) => setDeliverableForm({ ...deliverableForm, deadline: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Video URL (optional)</label>
                    <input
                      type="url"
                      value={deliverableForm.videoUrl}
                      onChange={(e) => setDeliverableForm({ ...deliverableForm, videoUrl: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Weight (%) — Available: {calculateWeights().remaining.toFixed(2)}%</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={calculateWeights().remaining}
                      value={deliverableForm.weight}
                      onChange={(e) => setDeliverableForm({ ...deliverableForm, weight: e.target.value })}
                      placeholder={`Default: ${calculateWeights().remaining.toFixed(2)}%`}
                    />
                    <small style={{ color: 'var(--gray-600)', fontSize: '13px' }}>
                      Leave empty to use all remaining weight ({calculateWeights().remaining.toFixed(2)}%)
                    </small>
                  </div>
                  <div className="actions">
                    <button type="submit">Create Deliverable</button>
                    <button type="button" className="secondary" onClick={() => setShowCreateDeliverable(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              {project && calculateWeights().remaining <= 0 && !showCreateDeliverable && (
                <p style={{ color: '#dc3545', fontSize: '0.9rem', marginTop: '10px' }}>
                  Total weight is complete (100%). Edit existing deliverables to redistribute weight before adding more.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default StudentDashboard;
