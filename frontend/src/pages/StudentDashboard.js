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
    videoUrl: ''
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
      await deliverableService.create(
        project.id,
        deliverableForm.name,
        deliverableForm.deadline,
        deliverableForm.videoUrl
      );
      toast.success('Deliverable created successfully!');
      setShowCreateDeliverable(false);
      setDeliverableForm({ name: '', deadline: '', videoUrl: '' });
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
          <h1>Student Dashboard</h1>
          <div className="header-info">
            <span>{user?.name}</span>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container">
        {!project ? (
          <div className="card">
            <h2>My Project</h2>
            {!showCreateProject ? (
              <>
                <p>You don't have a project yet.</p>
                <button onClick={() => setShowCreateProject(true)}>Create Project</button>
              </>
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
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <div className="info-grid">
                <div className="info-row">
                  <span className="info-label">Project ID:</span>
                  <span className="info-value">{project.id}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Created:</span>
                  <span className="info-value">{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Deliverables</h2>
              {deliverables.length === 0 ? (
                <p>No deliverables yet.</p>
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
                          <span className="info-label">Deadline:</span>
                          <span className="info-value">{new Date(deliv.deadline).toLocaleString()}</span>
                        </div>
                        {deliv.videoUrl && (
                          <div className="info-row">
                            <span className="info-label">Video:</span>
                            <span className="info-value">
                              <a href={deliv.videoUrl} target="_blank" rel="noopener noreferrer">
                                View
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
                <button onClick={() => setShowCreateDeliverable(true)}>Add Deliverable</button>
              ) : (
                <form onSubmit={handleCreateDeliverable} style={{ marginTop: '20px' }}>
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
                  <div className="actions">
                    <button type="submit">Create</button>
                    <button type="button" className="secondary" onClick={() => setShowCreateDeliverable(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default StudentDashboard;
