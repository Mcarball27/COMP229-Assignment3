
import { API_BASE_URL } from './config';

// Contact information stored in MongoDB
export type ContactRecord = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  message?: string;
  preferredContactMethod?: 'email' | 'phone' | 'either';
  createdAt?: string;
};

// Information submitted through the public Contact Me form
export type ContactMessageInput = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
  preferredContactMethod: 'email' | 'phone' | 'either';
};

// Information entered by Admin when creating or editing a contact
export type ContactInput = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  message: string;
  preferredContactMethod: 'email' | 'phone' | 'either';
};

export type ContactMessageResponse = {
  message: string;
  id: string;
};

// PUBLIC — Submit a message without signing in
export async function submitContactMessage(
  data: ContactMessageInput
): Promise<ContactMessageResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/contact-messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || 'Unable to send your message.'
    );
  }

  return result;
}

// Helper for protected Admin requests
async function adminRequest<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: ContactInput
): Promise<T> {
  const token = sessionStorage.getItem('authToken');

  if (!token) {
    throw new Error('Please sign in as Admin.');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(data ? { 'Content-Type': 'application/json' } : {})
    },
    ...(data ? { body: JSON.stringify(data) } : {})
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || 'Unable to manage contacts.'
    );
  }

  return result as T;
}

// READ — Admin retrieves all contacts
export async function getContacts(): Promise<ContactRecord[]> {
  return adminRequest<ContactRecord[]>(
    '/api/contacts',
    'GET'
  );
}

// CREATE — Admin adds a contact
export async function createContact(
  data: ContactInput
): Promise<ContactRecord> {
  return adminRequest<ContactRecord>(
    '/api/contacts',
    'POST',
    data
  );
}

// UPDATE — Admin edits a contact
export async function updateContact(
  id: string,
  data: ContactInput
): Promise<ContactRecord> {
  return adminRequest<ContactRecord>(
    `/api/contacts/${encodeURIComponent(id)}`,
    'PUT',
    data
  );
}

// DELETE — Admin removes one contact
export async function deleteContact(id: string): Promise<void> {
  await adminRequest<{ message: string }>(
    `/api/contacts/${encodeURIComponent(id)}`,
    'DELETE'
  );
}
