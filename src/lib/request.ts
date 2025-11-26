/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./api";

export async function getRequest<T>(url: string, params?: any) {
  return await api.get<T>(url, { params });
}

export async function postRequest<T>(url: string, body: any) {
  const isForm = body instanceof FormData;

  return await api.post<T>(url, body, {
    headers: isForm
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" },
  });
}

export async function putRequest<T>(url: string, body: any) {
  const isForm = body instanceof FormData;

  return await api.put<T>(url, body, {
    headers: isForm
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" },
  });
}

export async function deleteRequest<T>(url: string) {
  return await api.delete<T>(url);
}
