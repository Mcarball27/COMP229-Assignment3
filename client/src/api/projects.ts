
import { API_BASE_URL } from './config';

// Project structure returned from MongoDB
export type ProjectRecord = {
  _id: string;
  title: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  completion?: string;
  description?: string;
  slug?: string;
  imageKey?: string;
  imageAlt?: string;
  role?: string;
  outcome?: string;
  details?: string[];
  techStack?: string[];
  timeline?: string;
  liveUrl?: string;
  repoUrl?: string;
};

// Fields used when creating or updating a project
export type ProjectInput = {
  title: string;
  slug: string;
  imageKey: string;
  imageAlt: string;
  role: string;
  outcome: string;
  description: string;
  details: string[];
  techStack: string[];
  timeline: string;
  liveUrl: string;
  repoUrl: string;
};

// GET all projects
export async function getProjects(): Promise<ProjectRecord[]> {
  const response = await fetch(`${API_BASE_URL}/api/projects`);

  if (!response.ok) {
    throw new Error('Failed to load projects');
  }

  return response.json();
}

// GET one project by MongoDB ID
export async function getProjectById(
  id: string
): Promise<ProjectRecord> {
  const response = await fetch(
    `${API_BASE_URL}/api/projects/${encodeURIComponent(id)}`
  );

  if (!response.ok) {
    throw new Error('Failed to load project details');
  }

  return response.json();
}

// Helper for Admin API requests
async function adminRequest(
  path: string,
  method: 'POST' | 'PUT' | 'DELETE',
  data?: ProjectInput
): Promise<ProjectRecord | { message: string }> {
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
export async function createProject(
  data: ProjectInput
): Promise<ProjectRecord> {
  return adminRequest(
    '/api/projects',
    'POST',
    data
  ) as Promise<ProjectRecord>;
}

// UPDATE
export async function updateProject(
  id: string,
  data: ProjectInput
): Promise<ProjectRecord> {
  return adminRequest(
    `/api/projects/${encodeURIComponent(id)}`,
    'PUT',
    data
  ) as Promise<ProjectRecord>;
}

// DELETE
export async function deleteProject(id: string): Promise<void> {
  await adminRequest(
    `/api/projects/${encodeURIComponent(id)}`,
    'DELETE'
  );
}
