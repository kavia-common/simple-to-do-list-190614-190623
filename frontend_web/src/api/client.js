const DEFAULT_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// PUBLIC_INTERFACE
export const apiBaseUrl = DEFAULT_BASE_URL;

/**
 * PUBLIC_INTERFACE
 * Fetch tasks with pagination and optional search.
 * @param {Object} params
 * @param {number} params.page - Page number (1-based)
 * @param {number} params.pageSize - Items per page
 * @param {string} [params.search] - Search substring for title/description
 * @returns {Promise<{items: any[], total: number, page: number, page_size: number}>}
 */
export async function fetchTasks({ page = 1, pageSize = 10, search = '' } = {}) {
  const query = new URLSearchParams();
  query.set('page', String(page));
  query.set('page_size', String(pageSize));
  if (search) query.set('search', search);

  const res = await fetch(`${DEFAULT_BASE_URL}/tasks?${query.toString()}`, {
    headers: { 'Accept': 'application/json' }
  });
  if (!res.ok) throw await buildApiError(res);
  return res.json();
}

/**
 * PUBLIC_INTERFACE
 * Create a new task.
 * @param {{title: string, description: string}} data
 * @returns {Promise<any>}
 */
export async function createTask(data) {
  const res = await fetch(`${DEFAULT_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await buildApiError(res);
  return res.json();
}

/**
 * PUBLIC_INTERFACE
 * Update an existing task by id.
 * @param {number|string} id
 * @param {{title: string, description: string, status?: 'pending'|'completed'}} data
 * @returns {Promise<any>}
 */
export async function updateTask(id, data) {
  const res = await fetch(`${DEFAULT_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await buildApiError(res);
  return res.json();
}

/**
 * PUBLIC_INTERFACE
 * Delete a task by id.
 * @param {number|string} id
 * @returns {Promise<void>}
 */
export async function deleteTask(id) {
  const res = await fetch(`${DEFAULT_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw await buildApiError(res);
}

/**
 * PUBLIC_INTERFACE
 * Toggle task status between pending/completed.
 * Assumes backend provides PATCH /tasks/:id/toggle or similar.
 * If not available, fetch task, then update with flipped status.
 * @param {number|string} id
 * @param {'pending'|'completed'} currentStatus
 * @returns {Promise<any>}
 */
export async function toggleTask(id, currentStatus) {
  // Try PATCH endpoint first; if fails with 404 fallback to PUT update.
  try {
    const res = await fetch(`${DEFAULT_BASE_URL}/tasks/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) return res.json();
    if (res.status !== 404) throw await buildApiError(res);
    // else fallthrough to manual toggle
  } catch (e) {
    // fall through to manual toggle
  }
  const next = currentStatus === 'completed' ? 'pending' : 'completed';
  const res = await fetch(`${DEFAULT_BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ status: next }),
  });
  if (!res.ok) throw await buildApiError(res);
  return res.json();
}

/**
 * Utility to build a rich error from Response
 * @param {Response} res
 */
async function buildApiError(res) {
  let details = '';
  try {
    const data = await res.json();
    details = typeof data === 'string' ? data : JSON.stringify(data);
  } catch {
    details = await res.text();
  }
  const err = new Error(`API Error ${res.status}: ${res.statusText} ${details ? '- ' + details : ''}`);
  err.status = res.status;
  err.details = details;
  return err;
}
