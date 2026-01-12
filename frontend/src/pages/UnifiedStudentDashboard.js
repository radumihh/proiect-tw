import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectService, deliverableService, juryService, gradeService } from '../services/apiService';
import { toast } from 'react-toastify';

function UnifiedStudentDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('myProject');
  
  // My Project state
  const [project, setProject] = useState(null);
  const [deliverables, setDeliverables] = useState([]);
  const [projectGradeSummary, setProjectGradeSummary] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateDeliverable, setShowCreateDeliverable] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: '', description: '' });
  const [deliverableForm, setDeliverableForm] = useState({
    name: '',
    deadline: '',
    videoUrl: '',
    weight: ''
  });

  // Evaluation state
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [gradeInputs, setGradeInputs] = useState({});
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      // Load my project
      const projectsData = await projectService.getAll();
      if (projectsData.projects && projectsData.projects.length > 0) {
        const myProject = projectsData.projects[0];
        setProject(myProject);
        const delivsData = await deliverableService.getByProject(myProject.id);
        setDeliverables(delivsData.deliverables || []);
        
        // Load grade summary for own project
        try {
          const summary = await gradeService.getSummary(myProject.id);
          setProjectGradeSummary(summary);
        } catch (err) {
          // It's ok if grades aren't available yet
          setProjectGradeSummary(null);
        }
      }
      
      // Load assigned projects for evaluation
      const assignedData = await juryService.getAssignedProjects();
      setAssignedProjects(assignedData.projects || []);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total weight used and remaining
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
      loadAllData();
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
      loadAllData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create deliverable');
    }
  };

  const handleAssignJury = async (deliverableId) => {
    try {
      const result = await juryService.assignJury(project.id, deliverableId, 5);
      toast.success(result.message || 'Jury assigned successfully!');
      loadAllData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to assign jury');
    }
  };

  const handleGradeChange = (projectId, deliverableId, value) => {
    setGradeInputs({
      ...gradeInputs,
      [`${projectId}-${deliverableId}`]: value
    });
  };

  const handleSubmitGrade = async (projectId, deliverableId, existingGradeId) => {
    const key = `${projectId}-${deliverableId}`;
    const value = parseFloat(gradeInputs[key]);

    if (!value || value < 1 || value > 10) {
      toast.error('Grade must be between 1.00 and 10.00');
      return;
    }

    try {
      if (existingGradeId) {
        // Update existing grade
        await gradeService.update(existingGradeId, value);
        toast.success('Grade updated successfully!');
      } else {
        // Submit new grade
        await gradeService.submit(projectId, deliverableId, value);
        toast.success('Grade submitted successfully!');
      }
      setGradeInputs({ ...gradeInputs, [key]: '' });
      loadAllData(); // Reload to get updated grade info
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit grade');
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
        {/* Tab Navigation */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'myProject' ? 'active' : ''}`}
            onClick={() => setActiveTab('myProject')}
          >
            My Project
          </button>
          <button
            className={`tab ${activeTab === 'evaluate' ? 'active' : ''}`}
            onClick={() => setActiveTab('evaluate')}
          >
            Evaluate Projects
            {assignedProjects.length > 0 && (
              <span className="badge info" style={{ marginLeft: '8px' }}>
                {assignedProjects.length}
              </span>
            )}
          </button>
        </div>

        {/* My Project Tab */}
        {activeTab === 'myProject' && (
          <>
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
                  
                  {projectGradeSummary && projectGradeSummary.projectAverage !== null && (
                    <div className="project-average">
                      <h3>Your Project Average</h3>
                      <div className="project-average-value">
                        {projectGradeSummary.projectAverage.toFixed(2)}
                      </div>
                      <small>
                        {projectGradeSummary.deliverables.every(d => d.weight !== null) 
                          ? 'Weighted average based on deliverable percentages' 
                          : 'Average of all deliverables'}
                      </small>
                    </div>
                  )}
                </div>

                <div className="card">
                  <h2>Deliverables</h2>
                  {deliverables.length === 0 ? (
                    <div className="empty-state">
                      <p>No deliverables yet.</p>
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
                              <span className="info-label">Deadline:</span>
                              <span className="info-value">{new Date(deliv.deadline).toLocaleString()}</span>
                            </div>
                            <div className="info-row">
                              <span className="info-label">Weight:</span>
                              <span className="info-value">
                                {deliv.weight ? `${parseFloat(deliv.weight).toFixed(2)}%` : 'Not set'}
                              </span>
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
                    <button 
                      onClick={() => {
                        const { remaining } = calculateWeights();
                        setDeliverableForm({ ...deliverableForm, weight: remaining > 0 ? remaining.toFixed(2) : '' });
                        setShowCreateDeliverable(true);
                      }}
                      disabled={calculateWeights().remaining <= 0}
                    >
                      Add Deliverable
                    </button>
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
                      <div className="form-group">
                        <label>Weight (%) - Available: {calculateWeights().remaining.toFixed(2)}%</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          max={calculateWeights().remaining}
                          value={deliverableForm.weight}
                          onChange={(e) => setDeliverableForm({ ...deliverableForm, weight: e.target.value })}
                          placeholder={`Default: ${calculateWeights().remaining.toFixed(2)}%`}
                        />
                        <small style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                          Greater than 0%. Leave empty to use all remaining weight ({calculateWeights().remaining.toFixed(2)}%). Total must equal 100%.
                        </small>
                      </div>
                      <div className="actions">
                        <button type="submit">Create</button>
                        <button type="button" className="secondary" onClick={() => setShowCreateDeliverable(false)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                  {calculateWeights().remaining <= 0 && !showCreateDeliverable && (
                    <p style={{ color: '#dc3545', fontSize: '0.9rem', marginTop: '10px' }}>
                      Total weight is complete (100%). Edit existing deliverables to redistribute weight before adding more.
                    </p>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* Evaluate Projects Tab */}
        {activeTab === 'evaluate' && (
          <div className="card">
            <h2>Projects to Evaluate</h2>
            {assignedProjects.length === 0 ? (
              <div className="empty-state">
                <p>No projects assigned for evaluation yet.</p>
                <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '8px' }}>
                  You will be randomly selected to evaluate other students' projects.
                </p>
              </div>
            ) : (
              <ul className="list">
                {assignedProjects.map((proj) => {
                  const key = `${proj.projectId}-${proj.deliverableId}`;
                  const deadlinePassed = new Date(proj.deadline) < new Date();
                  const hasGrade = proj.existingGrade !== null;
                  const canEdit = hasGrade && !deadlinePassed;
                  
                  return (
                    <li key={key} className="list-item">
                      <h3>{proj.projectTitle}</h3>
                      <p>{proj.projectDescription}</p>
                      <div className="info-grid">
                        <div className="info-row">
                          <span className="info-label">Deliverable:</span>
                          <span className="info-value">{proj.deliverableName}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Deadline:</span>
                          <span className="info-value">
                            {new Date(proj.deadline).toLocaleString()}
                            {deadlinePassed && <span style={{ color: '#dc3545', marginLeft: '8px', fontWeight: '500' }}>(Expired)</span>}
                          </span>
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

                      {hasGrade ? (
                        <div style={{ marginTop: '15px' }}>
                          <div className="info-row" style={{ borderBottom: 'none', padding: '8px 0' }}>
                            <span className="info-label">Your Grade:</span>
                            <span className="info-value" style={{ fontSize: '18px', fontWeight: '600', color: '#28a745' }}>
                              {proj.existingGrade.value.toFixed(2)}
                            </span>
                          </div>
                          <div style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>
                            Submitted: {new Date(proj.existingGrade.submittedAt).toLocaleString()}
                          </div>
                          
                          {canEdit && (
                            <div style={{ marginTop: '12px' }}>
                              <label>Update Grade (before deadline):</label>
                              <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  step="0.01"
                                  className="grade-input"
                                  value={gradeInputs[key] || ''}
                                  onChange={(e) => handleGradeChange(proj.projectId, proj.deliverableId, e.target.value)}
                                  placeholder={proj.existingGrade.value.toFixed(2)}
                                />
                                <button 
                                  className="secondary"
                                  onClick={() => handleSubmitGrade(proj.projectId, proj.deliverableId, proj.existingGrade.id)}
                                >
                                  Update Grade
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ marginTop: '15px' }}>
                          {deadlinePassed ? (
                            <div style={{ color: '#dc3545', fontSize: '14px', fontWeight: '500' }}>
                              Deadline has passed - grading no longer available
                            </div>
                          ) : (
                            <>
                              <label>Grade (1.00 - 10.00):</label>
                              <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  step="0.01"
                                  className="grade-input"
                                  value={gradeInputs[key] || ''}
                                  onChange={(e) => handleGradeChange(proj.projectId, proj.deliverableId, e.target.value)}
                                  placeholder="e.g. 8.75"
                                />
                                <button onClick={() => handleSubmitGrade(proj.projectId, proj.deliverableId, null)}>
                                  Submit Grade
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default UnifiedStudentDashboard;
