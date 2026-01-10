import { apiPost } from "./client";

export function registerApi(payload) {
  return apiPost("/auth/register", payload);
}

export function loginApi(payload) {
  return apiPost("/auth/login", payload);
}

export function resetPasswordApi(payload) {

  return apiPost("/auth/reset-password", payload);
}
