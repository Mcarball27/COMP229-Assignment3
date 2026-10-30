// -----------------------------------------------------------------------------
// Education.tsx — Education page.
// Author: Maria Martina Carballo Diaz
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Education.tsx — education and qualifications page.
// Author: Maria Martina Carballo Diaz
// -----------------------------------------------------------------------------

import { useEffect, useState } from 'react';

import {
  getQualifications,
  createQualification,
  updateQualification,
  deleteQualification,
  type QualificationRecord,
  type QualificationInput
} from '../api/qualifications';

import { getCurrentUser } from '../api/authStorage';
import QualificationForm from '../components/QualificationForm';

export default function Education() {
  const [qualifications, setQualifications] = useState<QualificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingQualification, setEditingQualification] =
    useState<QualificationRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  // Retrieve qualifications from MongoDB
  async function loadQualifications() {
    try {
      setError('');
      const data = await getQualifications();
      setQualifications(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load qualifications.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadQualifications();
  }, []);

  // Open the Add form
  function handleAdd() {
    setEditingQualification(null);
    setMessage('');
    setShowForm(true);
  }

  // Open the Edit form
  function handleEdit(item: QualificationRecord) {
    setEditingQualification(item);
    setMessage('');
    setShowForm(true);
  }

  // Save a new or existing qualification
  async function handleSave(data: QualificationInput) {
    if (editingQualification) {
      await updateQualification(editingQualification._id, data);
      setMessage('Qualification updated successfully.');
    } else {
      await createQualification(data);
      setMessage('Qualification created successfully.');
    }

    setShowForm(false);
    setEditingQualification(null);
    await loadQualifications();
  }

  // Delete a qualification
  async function handleDelete(item: QualificationRecord) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.qualification}"?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(item._id);
    setError('');
    setMessage('');

    try {
      await deleteQualification(item._id);
      setMessage('Qualification deleted successfully.');
      await loadQualifications();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to delete qualification.'
      );
    } finally {
      setDeletingId(null);
    }
  }

  function handleCancel() {
    setShowForm(false);
    setEditingQualification(null);
  }

  return (
    <section>
      <h1 className="section-title">Education</h1>

      <p className="lead">
        My education, training, and professional qualifications.
      </p>

      {/* Admin-only Add button */}
      {isAdmin && !showForm && (
        <div className="mt-6">
          <button
            type="button"
            onClick={handleAdd}
            className="btn"
          >
            + Add Qualification
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

      {/* Admin-only Add/Edit form */}
      {isAdmin && showForm && (
        <QualificationForm
          key={editingQualification?._id || 'new'}
          qualification={editingQualification}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {loading && <p className="mt-6">Loading qualifications...</p>}

      {!loading && !error && qualifications.length === 0 && (
        <p className="mt-6">No qualifications available yet.</p>
      )}

      {/* Education timeline */}
      <ol className="list-none p-0 mt-6 grid gap-4">
        {qualifications.map((item) => (
          <li
            key={item._id}
            className="card grid gap-5 items-start grid-cols-1 sm:grid-cols-[160px_1fr]"
          >
            <div className="font-bold text-accent text-[1.05rem]">
              {item.dates || ''}
            </div>

            <div>
              <h3 className="mb-1">
                {item.qualification || item.title}
              </h3>

              <p className="text-text mb-1">
                {item.institution || ''}
              </p>

              <p className="mb-0">
                {item.detail || item.description || ''}
              </p>

              {/* Admin-only controls */}
              {isAdmin && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="btn btn-secondary"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={deletingId === item._id}
                    className="btn btn-secondary"
                  >
                    {deletingId === item._id
                      ? 'Deleting...'
                      : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
