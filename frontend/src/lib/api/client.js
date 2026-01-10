import { getToken } from "../storage";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:8000";

async function request(method, path, body) {
  const headers = {};
  headers["Content-Type"] = "application/json";

  const token = getToken();
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const config = { method, headers };
  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(BASE_URL + path, config);

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!res.ok) {
    const msg = data && data.detail ? data.detail : "Request failed";
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export function apiGet(path) {
  return request("GET", path);
}
export function apiPost(path, body) {
  return request("POST", path, body);
}
export function apiPatch(path, body) {
  return request("PATCH", path, body);
}
export function apiDelete(path) {
  return request("DELETE", path);
}
