// const API_BASE_URL = "http://127.0.0.1:8000";
const API_BASE_URL = "";

function clearAuth() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

function redirectToLogin() {
  clearAuth();

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

export async function apiFetch(endpoint, options = {}) {
  let accessToken = localStorage.getItem("access_token");

  const makeRequest = (token) => {
    const headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  };

  let response = await makeRequest(accessToken);

  // Access token expired
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token");

    // No refresh token = session is over
    if (!refreshToken) {
      redirectToLogin();
      return response;
    }

    const refreshResponse = await fetch(
      `${API_BASE_URL}/api/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      }
    );

    // Refresh token also expired/invalid
    if (!refreshResponse.ok) {
      redirectToLogin();
      return response;
    }

    const refreshData = await refreshResponse.json();

    accessToken = refreshData.access;

    localStorage.setItem(
      "access_token",
      accessToken
    );

    // Retry original request
    response = await makeRequest(accessToken);
  }

  return response;
}

export function logout() {
  clearAuth();
  window.location.href = "/login";
}

export async function apiGet(endpoint) {
  return apiFetch(endpoint);
}

export async function apiPost(endpoint, data) {
  return apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiPatch(endpoint, data) {
  return apiFetch(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function apiPut(endpoint, data) {
  return apiFetch(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function apiDelete(endpoint) {
  return apiFetch(endpoint, {
    method: "DELETE",
  });
}