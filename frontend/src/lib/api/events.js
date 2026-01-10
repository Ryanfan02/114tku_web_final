import { apiGet, apiPost, apiPatch, apiDelete } from "./client";

export function listEventsApi(dateISO) {
  if (dateISO) {
    return apiGet("/events/?dateISO=" + encodeURIComponent(dateISO));
  }
  return apiGet("/events/");
}

export function createEventApi(payload) {
  return apiPost("/events/", payload);
}

export function updateEventApi(eventId, payload) {
  return apiPatch("/events/" + eventId, payload);
}

export function deleteEventApi(eventId) {
  return apiDelete("/events/" + eventId);
}
