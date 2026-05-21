export async function apiFetch(path, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`/api${path}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred during the API request');
  }

  return data;
}

export default function useApi() {
  return { apiFetch };
}