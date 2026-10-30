
import { API_BASE_URL } from './config';

// Qualification structure returned from MongoDB
export type QualificationRecord = {
  _id: string;
  title?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  completion?: string;
  description?: string;
  qualification?: string;
  institution?: string;
  dates?: string;
  detail?: string;
  slug?: string;
};

// Fields used to create or update a qualification
export type QualificationInput = {
  qualification: string;
  institution: string;
  dates: string;
  detail: string;
  slug: string;
};

// GET all qualifications
export async function getQualifications(): Promise<QualificationRecord[]> {
  const response = await fetch(`${API_BASE_URL}/api/qualifications`);

  if (!response.ok) {
    throw new Error('Failed to load qualifications');
  }

  return response.json();
}

// Helper for Admin requests
async function adminRequest(
  path: string,
  method: 'POST' | 'PUT' | 'DELETE',
  data?: QualificationInput
): Promise<QualificationRecord | { message: string }> {
  const token = sessionStorage.getItem('authToken');

  if (!token) {
    throw new Error('Please sign in as Admin.');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    ...(data ? { body: JSON.stringify(data) } : {})
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Request failed');
  }

  return result;
}

// CREATE
export async function createQualification(
  data: QualificationInput
): Promise<QualificationRecord> {
  return adminRequest(
    '/api/qualifications',
    'POST',
    data
  ) as Promise<QualificationRecord>;
}

// UPDATE
export async function updateQualification(
  id: string,
  data: QualificationInput
): Promise<QualificationRecord> {
  return adminRequest(
    `/api/qualifications/${encodeURIComponent(id)}`,
    'PUT',
    data
  ) as Promise<QualificationRecord>;
}

// DELETE
export async function deleteQualification(id: string): Promise<void> {
  await adminRequest(
    `/api/qualifications/${encodeURIComponent(id)}`,
    'DELETE'
  );
}
