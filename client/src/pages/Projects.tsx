// // -----------------------------------------------------------------------------
// Projects.tsx — Projects page.
// Author: Maria Martina Carballo Diaz
// -----------------------------------------------------------------------------


import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  type ProjectRecord,
  type ProjectInput
} from '../api/projects';

import { getCurrentUser } from '../api/authStorage';
import { PROJECTS } from '../data/projects';
import ProjectForm from '../components/ProjectForm';

export default function Projects() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] =
    useState<ProjectRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  // Retrieve all projects from MongoDB.
  async function loadProjects() {
    try {
      setError('');
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load projects.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  // Open the form to create a project.
  function handleAdd() {
    setEditingProject(null);
    setMessage('');
    setShowForm(true);
  }

  // Open the form with an existing project's information.
  function handleEdit(project: ProjectRecord) {
    setEditingProject(project);
    setMessage('');
    setShowForm(true);
  }

  // Save a new project or update an existing project.
  async function handleSave(data: ProjectInput) {
    if (editingProject) {
      await updateProject(editingProject._id, data);
      setMessage('Project updated successfully.');
    } else {
      await createProject(data);
      setMessage('Project created successfully.');
    }

    setShowForm(false);
    setEditingProject(null);
    await loadProjects();
  }

  // Delete a project after confirmation.
  async function handleDelete(project: ProjectRecord) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(project._id);
    setError('');
    setMessage('');

    try {
      await deleteProject(project._id);
      setMessage('Project deleted successfully.');
      await loadProjects();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to delete project.'
      );
    } finally {
      setDeletingId(null);
    }
  }

  // Close the project form.
  function handleCancel() {
    setShowForm(false);
    setEditingProject(null);
  }

  return (
    <section>
      <h1 className="section-title">Projects</h1>

      <p className="lead">
        A selection of projects I've completed or contributed to through
        my studies and hands-on experience. Each project highlights my
        role, the technologies involved, and what I learned from the
        process.
      </p>

      {/* Admin-only Add button */}
      {isAdmin && !showForm && (
        <div className="mt-6">
          <button
            type="button"
            onClick={handleAdd}
            className="btn"
          >
            + Add Project
          </button>
        </div>
      )}

      {/* Success and error messages */}
      {message && (
        <p role="status" className="mt-4 text-accent">
          {message}
        </p>
      )}

      {error && (
        <p role="alert" className="mt-4 text-red-400">
          {error}
        </p>
      )}

      {/* Form for Admin to add or edit projects */}
      {isAdmin && showForm && (
        <ProjectForm
          key={editingProject?._id || 'new'}
          project={editingProject}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {loading && <p className="mt-6">Loading projects...</p>}

      {!loading && !error && projects.length === 0 && (
        <p className="mt-6">No projects available yet.</p>
      )}

      {/* Existing project cards */}
      <div className="grid gap-5 mt-6 grid-cols-1 md:grid-cols-3">
        {projects.map((project) => {
          // Match existing local images with the database record.
          const localProject = PROJECTS.find(
            (entry) =>
              entry.id === project.imageKey ||
              entry.id === project.slug
          );

          const image = localProject?.image;
          const imageAlt =
            project.imageAlt ||
            localProject?.imageAlt ||
            project.title;

          return (
            <article
              key={project._id}
              className="card flex flex-col gap-2"
            >
              {/* Project image */}
              <div className="w-full h-40 flex items-center justify-center rounded-md bg-surface-2 overflow-hidden">
                {image && (
                  <img
                    src={image}
                    alt={imageAlt}
                    loading="lazy"
                    className="max-w-[85%] max-h-[85%] object-contain rounded-md"
                  />
                )}
              </div>

              {/* Project title */}
              <h3 className="mt-2 mb-0 text-text">
                <Link
                  to={`/projects/${project.slug || project._id}`}
                  className="text-inherit no-underline hover:text-accent hover:underline"
                >
                  {project.title}
                </Link>
              </h3>

              {/* Role */}
              {(project.role || localProject?.role) && (
                <p className="text-accent font-semibold text-[0.95rem] m-0">
                  {project.role || localProject?.role}
                </p>
              )}

              {/* Project summary */}
              <p className="mt-1 mb-0">
                {project.outcome ||
                  localProject?.outcome ||
                  project.description}
              </p>

              {/* Link to details */}
              <Link
                to={`/projects/${project.slug || project._id}`}
                aria-label={`Read more about ${project.title}`}
                className="self-start mt-1 text-accent font-semibold no-underline hover:underline"
              >
                Details →
              </Link>

              {/* Admin-only Edit and Delete buttons */}
              {isAdmin && (
                <div className="flex flex-wrap gap-2 mt-auto pt-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(project)}
                    className="btn btn-secondary"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(project)}
                    disabled={deletingId === project._id}
                    className="btn btn-secondary"
                  >
                    {deletingId === project._id
                      ? 'Deleting...'
                      : 'Delete'}
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
