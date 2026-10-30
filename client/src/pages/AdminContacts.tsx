
// -----------------------------------------------------------------------------
// AdminContacts.tsx — Admin-only contact management page.
// Author: Maria Martina Carballo Diaz
// -----------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  type ContactRecord,
  type ContactInput
} from '../api/contacts';

import { getCurrentUser } from '../api/authStorage';
import ContactForm from '../components/ContactForm';

export default function AdminContacts() {
  const currentUser = getCurrentUser();

console.log('Current user:', currentUser);

const isAdmin = currentUser?.role === 'admin';

  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [loading, setLoading] = useState(isAdmin);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] =
    useState<ContactRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load contacts only for a signed-in Admin.
  useEffect(() => {
    if (!isAdmin) return;

    let active = true;

    async function loadContacts() {
      try {
        setLoading(true);
        const data = await getContacts();

        if (active) {
          setContacts(data);
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load contacts.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadContacts();

    return () => {
      active = false;
    };
  }, [isAdmin]);

  // Refresh the records after an Admin operation.
  async function refreshContacts() {
    const data = await getContacts();
    setContacts(data);
  }

  function handleAdd() {
    setEditingContact(null);
    setShowForm(true);
    setMessage('');
    setError('');
  }

  function handleEdit(contact: ContactRecord) {
    setEditingContact(contact);
    setShowForm(true);
    setMessage('');
    setError('');
  }

  async function handleSave(data: ContactInput) {
    if (editingContact) {
      await updateContact(editingContact._id, data);
      setMessage('Contact updated successfully.');
    } else {
      await createContact(data);
      setMessage('Contact created successfully.');
    }

    setShowForm(false);
    setEditingContact(null);

    try {
      await refreshContacts();
    } catch {
      setError('Contact saved, but the list could not be refreshed.');
    }
  }

  async function handleDelete(contact: ContactRecord) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the contact for ${contact.firstname} ${contact.lastname}?`
    );

    if (!confirmed) return;

    setDeletingId(contact._id);
    setError('');
    setMessage('');

    try {
      await deleteContact(contact._id);
      setMessage('Contact deleted successfully.');
      await refreshContacts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to delete contact.'
      );
    } finally {
      setDeletingId(null);
    }
  }

  function handleCancel() {
    setShowForm(false);
    setEditingContact(null);
  }

  // Prevent regular users and visitors from viewing contact data.
  if (!isAdmin) {
    return (
      <section className="max-w-3xl">
        <h1 className="section-title">Access Denied</h1>

        <p className="lead">
          Only Admin accounts can access contact management.
        </p>

        <Link to="/signin" className="btn">
          Sign In
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1 className="section-title">Contact Management</h1>

      <p className="lead">
        View and manage contact messages submitted through the portfolio.
        This information is available to Admin only.
      </p>

      {!showForm && (
        <div className="mt-6">
          <button
            type="button"
            onClick={handleAdd}
            className="btn"
          >
            + Add Contact
          </button>
        </div>
      )}

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

      {showForm && (
        <ContactForm
          key={editingContact?._id || 'new'}
          contact={editingContact}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {loading && <p className="mt-6">Loading contacts...</p>}

      {!loading && !error && contacts.length === 0 && (
        <p className="mt-6">No contacts available yet.</p>
      )}

      {/* Admin-only contact records */}
      <div className="grid gap-4 mt-6">
        {contacts.map((contact) => (
          <article key={contact._id} className="card grid gap-3">
            <div>
              <h3 className="mt-0 mb-2">
                {contact.firstname} {contact.lastname}
              </h3>

              <p className="mb-1">
                <strong>Email:</strong> {contact.email}
              </p>

              {contact.phone && (
                <p className="mb-1">
                  <strong>Phone:</strong> {contact.phone}
                </p>
              )}

              <p className="mb-1">
                <strong>Preferred Contact Method:</strong>{' '}
                {contact.preferredContactMethod || 'Not specified'}
              </p>

              {contact.message && (
                <p className="mb-1 whitespace-pre-wrap">
                  <strong>Message:</strong> {contact.message}
                </p>
              )}

              {contact.createdAt && (
                <p className="text-sm text-muted mb-0">
                  Received: {new Date(contact.createdAt).toLocaleString()}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleEdit(contact)}
                className="btn btn-secondary"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDelete(contact)}
                disabled={deletingId === contact._id}
                className="btn btn-secondary"
              >
                {deletingId === contact._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
