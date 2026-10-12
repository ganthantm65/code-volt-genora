const BASE_URL = 'https://code-volt-round-2.onrender.com/api';

/**
 * Universal Native Fetch API client for Code-Volt
 * Automatically resolves token headers, parses JSON, and standardizes error responses.
 */
export async function apiRequest(endpoint, method = 'GET', body = null, tokenType = 'team') {
  const tokenKey = tokenType === 'admin' ? 'admin_token' : 'team_token';
  const token = localStorage.getItem(tokenKey);

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch (netErr) {
    throw new Error(`Network failure: Unable to reach the server. ${netErr.message}`);
  }

  let data = {};
  try {
    data = await response.json();
  } catch (_) {
    // If backend returns plain text or an empty body
    data = {};
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Clear token if rejected
      if (tokenType === 'admin') {
        localStorage.removeItem('admin_token');
      } else {
        localStorage.removeItem('team_token');
        localStorage.removeItem('team_info');
      }
    }
    const message = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export default apiRequest;