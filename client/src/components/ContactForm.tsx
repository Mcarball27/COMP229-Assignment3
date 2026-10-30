
import { useState, type FormEvent } from 'react';
import type { ContactInput, ContactRecord } from '../api/contacts';

type ContactFormProps = {
  contact?: ContactRecord | null;
  onSave: (data: ContactInput) => Promise<void>;
  onCancel: () => void;
};

export default function ContactForm({
  contact,
  onSave,
  onCancel
}: ContactFormProps) {
  const [firstname, setFirstname] = useState(contact?.firstname || '');
  const [lastname, setLastname] = useState(contact?.lastname || '');
  const [email, setEmail] = useState(contact?.email || '');
  const [phone, setPhone] = useState(contact?.phone || '');
  const [message, setMessage] = useState(contact?.message || '');

  const [preferredContactMethod, setPreferredContactMethod] =
    useState<'email' | 'phone' | 'either'>(
      contact?.preferredContactMethod || 'email'
    );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      await onSave({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        preferredContactMethod
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save contact.'
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
        {contact ? 'Edit Contact' : 'Add Contact'}
      </h2>

      <div className="grid gap-2">
        <label htmlFor="admin-contact-firstname">First Name *</label>
        <input
          id="admin-contact-firstname"
          className={inputClass}
          value={firstname}
          onChange={(event) => setFirstname(event.target.value)}
          required
          maxLength={40}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="admin-contact-lastname">Last Name *</label>
        <input
          id="admin-contact-lastname"
          className={inputClass}
          value={lastname}
          onChange={(event) => setLastname(event.target.value)}
          required
          maxLength={40}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="admin-contact-email">Email *</label>
        <input
          id="admin-contact-email"
          type="email"
          className={inputClass}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="admin-contact-phone">Phone</label>
        <input
          id="admin-contact-phone"
          type="tel"
          className={inputClass}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="admin-contact-message">Message</label>
        <textarea
          id="admin-contact-message"
          rows={4}
          className={inputClass}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="admin-contact-method">
          Preferred Contact Method
        </label>
        <select
          id="admin-contact-method"
          className={inputClass}
          value={preferredContactMethod}
          onChange={(event) =>
            setPreferredContactMethod(
              event.target.value as 'email' | 'phone' | 'either'
            )
          }
        >
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="either">Either</option>
        </select>
      </div>

      {error && (
        <p role="alert" className="text-red-400 m-0">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="btn"
        >
          {saving ? 'Saving...' : 'Save Contact'}
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
