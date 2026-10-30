// -----------------------------------------------------------------------------
// Contact.tsx — Contact Me page and interactive form.
// Author: Maria Martina Carballo Diaz
// -----------------------------------------------------------------------------


/* -----------------------------------------------------------------------------
   Contact.tsx — Contact page with MongoDB form submission.
   Author: Maria Martina Carballo Diaz
----------------------------------------------------------------------------- */

import { useState } from 'react';
import type { ChangeEvent, FocusEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitContactMessage } from '../api/contacts';

type PreferredContactMethod = 'email' | 'phone' | 'either';

const CONTACT_METHOD_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'either', label: 'Either is fine' }
] as const;

type ContactFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
  preferredContactMethod: PreferredContactMethod;
};

type FieldName = keyof ContactFormValues;
type FormErrors = Partial<Record<FieldName, string>>;
type TouchedFields = Partial<Record<FieldName, boolean>>;

const EMPTY_FORM: ContactFormValues = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  message: '',
  preferredContactMethod: 'email'
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()\-\s]{7,20}$/;

const NAME_PATTERN =
  /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ'.\- ]{0,39}$/;

const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 500;

// Validate the contact form.
function validate(values: ContactFormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.firstName.trim()) {
    errors.firstName = 'First name is required.';
  } else if (!NAME_PATTERN.test(values.firstName.trim())) {
    errors.firstName =
      'Use letters, spaces, hyphens, or apostrophes only.';
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  } else if (!NAME_PATTERN.test(values.lastName.trim())) {
    errors.lastName =
      'Use letters, spaces, hyphens, or apostrophes only.';
  }

  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone =
      'Enter 7–20 characters — digits, spaces, +, -, ( or ).';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "That doesn't look like a valid email address.";
  }

  const trimmedMessage = values.message.trim();

  if (!trimmedMessage) {
    errors.message = 'Message is required.';
  } else if (trimmedMessage.length < MESSAGE_MIN_LENGTH) {
    errors.message =
      `Message must be at least ${MESSAGE_MIN_LENGTH} characters.`;
  } else if (trimmedMessage.length > MESSAGE_MAX_LENGTH) {
    errors.message =
      `Message must be ${MESSAGE_MAX_LENGTH} characters or fewer.`;
  }

  return errors;
}

const FIELD_LABEL = 'grid gap-1.5 text-sm text-muted';

const FIELD_CONTROL =
  'bg-surface-2 border border-border text-text rounded-md px-3.5 py-2.5 text-base font-sans focus:outline-2 focus:outline-accent focus:outline-offset-2 aria-invalid:border-danger';

export default function Contact() {
  const navigate = useNavigate();

  const [formValues, setFormValues] =
    useState<ContactFormValues>(EMPTY_FORM);

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Update the form whenever a field changes.
  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const fieldName = name as FieldName;

    setFormValues((previousValues) => ({
      ...previousValues,
      [fieldName]: value
    }));

    if (errors[fieldName]) {
      setErrors((previousErrors) => {
        const next = { ...previousErrors };
        delete next[fieldName];
        return next;
      });
    }
  };

  // Validate a field after the user leaves it.
  const handleFieldBlur = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const fieldName = event.target.name as FieldName;

    setTouched((previous) => ({
      ...previous,
      [fieldName]: true
    }));

    setErrors(validate(formValues));
  };

  // Submit the form to MongoDB through the Express API.
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setSubmitError('');

    const nextErrors = validate(formValues);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);

      const allTouched: TouchedFields = {};

      (Object.keys(EMPTY_FORM) as FieldName[]).forEach((name) => {
        allTouched[name] = true;
      });

      setTouched(allTouched);
      return;
    }

    setSubmitting(true);

    try {
      // Save the message in MongoDB.
      await submitContactMessage({
        firstName: formValues.firstName.trim(),
        lastName: formValues.lastName.trim(),
        phone: formValues.phone.trim(),
        email: formValues.email.trim(),
        message: formValues.message.trim(),
        preferredContactMethod: formValues.preferredContactMethod
      });

      const submittedFirstName = formValues.firstName;
      const submittedLastName = formValues.lastName;

      setFormValues(EMPTY_FORM);
      setErrors({});
      setTouched({});

      // Redirect only after a successful API response.
      navigate('/', {
        state: {
          justSubmitted: true,
          firstName: submittedFirstName,
          lastName: submittedLastName
        }
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Unable to send your message.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const errorFor = (name: FieldName): string | undefined =>
    touched[name] ? errors[name] : undefined;

  return (
    <section>
      <h1 className="section-title">Contact Me</h1>

      <p className="lead">
        Have a question or want to connect? Feel free to send me a message
        using the form below.
      </p>

      <div className="grid gap-5 mt-6 items-start grid-cols-1 md:grid-cols-[1fr_1.4fr]">

        {/* Contact information */}
        <aside className="card">
          <h2 className="mt-0">Contact Information</h2>

          <dl className="m-0 grid gap-3">
            <div className="grid grid-cols-[90px_1fr] gap-2">
              <dt className="text-muted font-semibold">Email</dt>
              <dd className="m-0 text-text">
                <a href="mailto:martinacarballodiaz@icloud.com">
                  martinacarballodiaz@icloud.com
                </a>
              </dd>
            </div>

            <div className="grid grid-cols-[90px_1fr] gap-2">
              <dt className="text-muted font-semibold">Phone</dt>
              <dd className="m-0 text-text">
                <a href="tel:+12493598617">
                  +1 (249) 359-8617
                </a>
              </dd>
            </div>

            <div className="grid grid-cols-[90px_1fr] gap-2">
              <dt className="text-muted font-semibold">Location</dt>
              <dd className="m-0 text-text">
                Ontario, Canada
              </dd>
            </div>

            <div className="grid grid-cols-[90px_1fr] gap-2">
              <dt className="text-muted font-semibold">Availability</dt>
              <dd className="m-0 text-text">
                Open to remote opportunities
              </dd>
            </div>
          </dl>
        </aside>

        {/* Contact form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="card grid gap-4"
        >
          {/* First and last name */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <label className={FIELD_LABEL}>
              <span>First Name</span>

              <input
                type="text"
                name="firstName"
                autoComplete="given-name"
                maxLength={40}
                value={formValues.firstName}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                required
                aria-invalid={Boolean(errorFor('firstName'))}
                aria-describedby={
                  errorFor('firstName')
                    ? 'firstName-error'
                    : undefined
                }
                className={FIELD_CONTROL}
              />

              {errorFor('firstName') && (
                <p
                  id="firstName-error"
                  role="alert"
                  className="m-0 mt-0.5 text-danger text-[0.85rem] font-medium"
                >
                  {errorFor('firstName')}
                </p>
              )}
            </label>

            <label className={FIELD_LABEL}>
              <span>Last Name</span>

              <input
                type="text"
                name="lastName"
                autoComplete="family-name"
                maxLength={40}
                value={formValues.lastName}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                required
                aria-invalid={Boolean(errorFor('lastName'))}
                aria-describedby={
                  errorFor('lastName')
                    ? 'lastName-error'
                    : undefined
                }
                className={FIELD_CONTROL}
              />

              {errorFor('lastName') && (
                <p
                  id="lastName-error"
                  role="alert"
                  className="m-0 mt-0.5 text-danger text-[0.85rem] font-medium"
                >
                  {errorFor('lastName')}
                </p>
              )}
            </label>
          </div>

          {/* Phone and email */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <label className={FIELD_LABEL}>
              <span>Contact Number</span>

              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="+1 (555) 555-0123"
                value={formValues.phone}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                required
                aria-invalid={Boolean(errorFor('phone'))}
                aria-describedby={
                  errorFor('phone')
                    ? 'phone-error'
                    : undefined
                }
                className={FIELD_CONTROL}
              />

              {errorFor('phone') && (
                <p
                  id="phone-error"
                  role="alert"
                  className="m-0 mt-0.5 text-danger text-[0.85rem] font-medium"
                >
                  {errorFor('phone')}
                </p>
              )}
            </label>

            <label className={FIELD_LABEL}>
              <span>Email Address</span>

              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formValues.email}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                required
                aria-invalid={Boolean(errorFor('email'))}
                aria-describedby={
                  errorFor('email')
                    ? 'email-error'
                    : undefined
                }
                className={FIELD_CONTROL}
              />

              {errorFor('email') && (
                <p
                  id="email-error"
                  role="alert"
                  className="m-0 mt-0.5 text-danger text-[0.85rem] font-medium"
                >
                  {errorFor('email')}
                </p>
              )}
            </label>
          </div>

          {/* Preferred contact method */}
          <fieldset className="border-0 p-0 m-0 grid gap-2 text-sm text-muted">
            <legend className="p-0 mb-0.5">
              Preferred Contact Method
            </legend>

            <div className="flex flex-wrap gap-x-5 gap-y-3">
              {CONTACT_METHOD_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="inline-flex items-center gap-1.5 text-text cursor-pointer"
                >
                  <input
                    type="radio"
                    name="preferredContactMethod"
                    value={option.value}
                    checked={
                      formValues.preferredContactMethod === option.value
                    }
                    onChange={handleFieldChange}
                    className="focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                  />

                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Message */}
          <label className={FIELD_LABEL}>
            <span>Message</span>

            <textarea
              name="message"
              rows={5}
              minLength={MESSAGE_MIN_LENGTH}
              maxLength={MESSAGE_MAX_LENGTH}
              value={formValues.message}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              required
              aria-invalid={Boolean(errorFor('message'))}
              aria-describedby={
                errorFor('message')
                  ? 'message-error'
                  : undefined
              }
              className={`${FIELD_CONTROL} resize-y`}
            />

            <p className="m-0 mt-0.5 self-end text-right text-xs text-muted">
              {formValues.message.length}/{MESSAGE_MAX_LENGTH}
            </p>

            {errorFor('message') && (
              <p
                id="message-error"
                role="alert"
                className="m-0 mt-0.5 text-danger text-[0.85rem] font-medium"
              >
                {errorFor('message')}
              </p>
            )}
          </label>

          {/* API submission status */}
          {submitting && (
            <p role="status" className="m-0 text-muted">
              Sending your message...
            </p>
          )}

          {submitError && (
            <p role="alert" className="m-0 text-danger font-medium">
              {submitError}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="btn justify-self-start"
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
}
