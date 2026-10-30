// -----------------------------------------------------------------------------
// ProjectDetails.tsx — individual project details page.
// Author: Maria Martina Carballo Diaz
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// ProjectDetails.tsx — individual project details page.
// Author: Maria Martina Carballo Diaz
// -----------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProjects, type ProjectRecord } from '../api/projects';
import { PROJECTS } from '../data/projects';

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();

  // Store the project retrieved from MongoDB
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Retrieve project information from the backend
  useEffect(() => {
    async function loadProject() {
      setLoading(true);
      setError('');
      setProject(null);

      try {
        const projects = await getProjects();

        // Find by readable slug or MongoDB ID
        const selected = projects.find(
          (entry) => entry.slug === id || entry._id === id
        );

        setProject(selected || null);
      } catch {
        setError('Unable to load project details.');
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id]);

  // Loading message
  if (loading) {
    return <p>Loading project details...</p>;
  }

  // Error message
  if (error) {
    return <p role="alert">{error}</p>;
  }

  // Show a fallback if the project does not exist
  if (!project) {
    return (
      <section className="max-w-3xl">
        <h1 className="section-title">Project not found</h1>

        <p className="lead">
          The project you tried to open doesn't exist or was renamed.
        </p>

        <p>
          <Link className="btn" to="/projects">
            ← Back to projects
          </Link>
        </p>
      </section>
    );
  }

  // Match MongoDB projects with your existing image imports
  const localProject = PROJECTS.find(
    (entry) => entry.id === project.slug
  );

  const image = localProject?.image;

  // Use MongoDB details or fall back to the shorter description
  const paragraphs =
    project.details && project.details.length > 0
      ? project.details
      : project.description
        ? [project.description]
        : [];

  const technologies = project.techStack || [];

  return (
    <article className="max-w-3xl">

      {/* Back navigation */}
      <p className="mb-4 text-sm">
        <Link
          to="/projects"
          className="text-muted no-underline hover:text-accent hover:underline"
        >
          ← Back to projects
        </Link>
      </p>

      {/* Project heading */}
      <header className="grid gap-1 mb-5">
        <h1 className="m-0 text-3xl leading-tight">
          {project.title}
        </h1>

        {(project.role || localProject?.role) && (
          <p className="m-0 text-accent font-semibold">
            {project.role || localProject?.role}
          </p>
        )}

        {(project.timeline || localProject?.timeline) && (
          <p className="m-0 text-muted text-sm">
            {project.timeline || localProject?.timeline}
          </p>
        )}
      </header>

      {/* Project image */}
      {image && (
        <div className="flex justify-center mb-5">
          <img
            src={image}
            alt={
              project.imageAlt ||
              localProject?.imageAlt ||
              project.title
            }
            className="max-w-full max-h-[280px] w-auto h-auto object-contain rounded-md bg-surface-2"
          />
        </div>
      )}

      {/* Project description */}
      <div className="grid gap-4 text-text leading-7 mb-6">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="m-0">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Technologies used */}
      {technologies.length > 0 && (
        <section className="mb-6">
          <h2 className="m-0 mb-2 text-base text-muted font-semibold uppercase tracking-wider">
            Tech Stack
          </h2>

          <ul className="list-none p-0 m-0 flex flex-wrap gap-1.5">
            {technologies.map((tech) => (
              <li key={tech} className="tag">
                {tech}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Optional project links */}
      {(project.liveUrl || project.repoUrl) && (
        <section className="flex flex-wrap gap-2.5">

          {project.liveUrl && (
            <a
              className="btn"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              Live Site ↗
            </a>
          )}

          {project.repoUrl && (
            <a
              className="btn btn-secondary"
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              Source Code ↗
            </a>
          )}

        </section>
      )}

    </article>
  );
}
