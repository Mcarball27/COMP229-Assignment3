
import { useState, type FormEvent } from 'react';
import type { ProjectInput, ProjectRecord } from '../api/projects';

type ProjectFormProps = {
  project?: ProjectRecord | null;
  onSave: (data: ProjectInput) => Promise<void>;
  onCancel: () => void;
};

export default function ProjectForm({
  project,
  onSave,
  onCancel
}: ProjectFormProps) {
  const [title, setTitle] = useState(project?.title || '');
  const [slug, setSlug] = useState(project?.slug || '');
  const [role, setRole] = useState(project?.role || '');
  const [outcome, setOutcome] = useState(project?.outcome || '');
  const [description, setDescription] = useState(
    project?.description || ''
  );
  const [details, setDetails] = useState(
    project?.details?.join('\n') || ''
  );
  const [techStack, setTechStack] = useState(
    project?.techStack?.join(', ') || ''
  );
  const [timeline, setTimeline] = useState(
    project?.timeline || ''
  );
  const [imageKey, setImageKey] = useState(
    project?.imageKey || ''
  );
  const [imageAlt, setImageAlt] = useState(
    project?.imageAlt || ''
  );
  const [liveUrl, setLiveUrl] = useState(
    project?.liveUrl || ''
  );
  const [repoUrl, setRepoUrl] = useState(
    project?.repoUrl || ''
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaving(true);

    const data: ProjectInput = {
      title: title.trim(),
      slug: slug.trim(),
      role: role.trim(),
      outcome: outcome.trim(),
      description: description.trim(),
      details: details
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      techStack: techStack
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      timeline: timeline.trim(),
      imageKey: imageKey.trim(),
      imageAlt: imageAlt.trim(),
      liveUrl: liveUrl.trim(),
      repoUrl: repoUrl.trim()
    };

    try {
      await onSave(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to save project.'
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    'w-full rounded-md border border-border bg-transparent p-3 text-text';

  return (
    <form onSubmit={handleSubmit} className="card grid gap-4 mt-6">
      <h2 className="text-xl font-semibold m-0">
        {project ? 'Edit Project' : 'Add New Project'}
      </h2>

      <div className="grid gap-2">
        <label htmlFor="project-title">Project Title *</label>
        <input
          id="project-title"
          className={inputClass}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="project-slug">Project Slug *</label>
        <input
          id="project-slug"
          className={inputClass}
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          placeholder="example-project"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          title="Use lowercase letters, numbers and hyphens."
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="project-role">Your Role</label>
        <input
          id="project-role"
          className={inputClass}
          value={role}
          onChange={(event) => setRole(event.target.value)}
          placeholder="Front-End Developer"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="project-outcome">Project Outcome</label>
        <textarea
          id="project-outcome"
          className={inputClass}
          rows={3}
          value={outcome}
          onChange={(event) => setOutcome(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="project-description">
          Short Description
        </label>
        <textarea
          id="project-description"
          className={inputClass}
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="project-details">
          Detailed Description
        </label>
        <textarea
          id="project-details"
          className={inputClass}
          rows={5}
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          placeholder="Enter one paragraph per line."
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="project-tech">Tech Stack</label>
        <input
          id="project-tech"
          className={inputClass}
          value={techStack}
          onChange={(event) => setTechStack(event.target.value)}
          placeholder="React, Node.js, MongoDB"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="project-timeline">Timeline</label>
        <input
          id="project-timeline"
          className={inputClass}
          value={timeline}
          onChange={(event) => setTimeline(event.target.value)}
          placeholder="2026"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="project-image">Image Key</label>
        <input
          id="project-image"
          className={inputClass}
          value={imageKey}
          onChange={(event) => setImageKey(event.target.value)}
          placeholder="student-grades"
        />
        <p className="text-sm text-muted m-0">
          Existing images: student-grades, flight-school-management,
          oliva-terra. Other values will not display an image yet.
        </p>
      </div>

      <div className="grid gap-2">
        <label htmlFor="project-image-alt">Image Description</label>
        <input
          id="project-image-alt"
          className={inputClass}
          value={imageAlt}
          onChange={(event) => setImageAlt(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="project-live">Live Website URL</label>
        <input
          id="project-live"
          type="url"
          className={inputClass}
          value={liveUrl}
          onChange={(event) => setLiveUrl(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="project-repo">GitHub Repository URL</label>
        <input
          id="project-repo"
          type="url"
          className={inputClass}
          value={repoUrl}
          onChange={(event) => setRepoUrl(event.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="btn"
        >
          {saving ? 'Saving...' : 'Save Project'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
