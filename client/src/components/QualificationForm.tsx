
import { useState, type FormEvent } from 'react';
import type {
  QualificationInput,
  QualificationRecord
} from '../api/qualifications';

type QualificationFormProps = {
  qualification?: QualificationRecord | null;
  onSave: (data: QualificationInput) => Promise<void>;
  onCancel: () => void;
};

export default function QualificationForm({
  qualification,
  onSave,
  onCancel
}: QualificationFormProps) {
  const [name, setName] = useState(qualification?.qualification || '');
  const [institution, setInstitution] = useState(
    qualification?.institution || ''
  );
  const [dates, setDates] = useState(qualification?.dates || '');
  const [detail, setDetail] = useState(qualification?.detail || '');
  const [slug, setSlug] = useState(qualification?.slug || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');

    const data: QualificationInput = {
      qualification: name.trim(),
      institution: institution.trim(),
      dates: dates.trim(),
      detail: detail.trim(),
      slug: slug.trim()
    };

    try {
      await onSave(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save qualification.'
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
        {qualification ? 'Edit Qualification' : 'Add Qualification'}
      </h2>

      <div className="grid gap-2">
        <label htmlFor="qualification-name">Qualification *</label>
        <input
          id="qualification-name"
          className={inputClass}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Software Engineering Technician Diploma"
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="qualification-institution">Institution *</label>
        <input
          id="qualification-institution"
          className={inputClass}
          value={institution}
          onChange={(event) => setInstitution(event.target.value)}
          placeholder="Centennial College"
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="qualification-dates">Dates *</label>
        <input
          id="qualification-dates"
          className={inputClass}
          value={dates}
          onChange={(event) => setDates(event.target.value)}
          placeholder="2025 – Present"
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="qualification-detail">Details</label>
        <textarea
          id="qualification-detail"
          className={inputClass}
          rows={4}
          value={detail}
          onChange={(event) => setDetail(event.target.value)}
          placeholder="Brief description of the qualification"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="qualification-slug">Slug *</label>
        <input
          id="qualification-slug"
          className={inputClass}
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          placeholder="centennial"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          title="Use lowercase letters, numbers, and hyphens."
          required
        />
      </div>

      {error && (
        <p role="alert" className="text-red-400 m-0">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="btn">
          {saving ? 'Saving...' : 'Save Qualification'}
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
