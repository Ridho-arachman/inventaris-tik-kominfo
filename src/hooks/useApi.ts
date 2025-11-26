/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useSWR from "swr";
import { api } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export function useGet(url: string | null) {
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    data: data?.data,
    message: data?.message,
    success: data?.success,
    isLoading,
    error,
    mutate,
  };
}

export function usePost<T = any>(url: string) {
  async function post(body: any): Promise<T> {
    const res = await api.post(url, body); // bisa FormData atau JSON
    return res.data;
  }

  return { post };
}

export function usePut<T = any>(url: string) {
  async function put(body: any): Promise<T> {
    const res = await api.put(url, body);
    return res.data;
  }

  return { put };
}

export function useDelete<T = any>(url: string) {
  async function del(): Promise<T> {
    const res = await api.delete(url);
    return res.data;
  }

  return { del };
}
