/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useSWR from "swr";
import { api } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import { useState } from "react";

export function useGet(url: string | null) {
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    data: data?.data || [],
    message: data?.message,
    success: data?.success,
    isLoading,
    error,
    mutate,
  };
}

// export function usePost<T = any>(url: string) {
//   async function post(body: any): Promise<T> {
//     const res = await api.post(url, body); // bisa FormData atau JSON
//     return res.data;
//   }

//   return { post };
// }

// export function usePut<T = any>(url: string) {
//   async function put(body: any): Promise<T> {
//     const res = await api.put(url, body);
//     return res.data;
//   }

//   return { put };
// }

// export function usePatch<T = any>(url: string) {
//   async function patch(body: any): Promise<T> {
//     const res = await api.patch(url, body);
//     return res.data;
//   }

//   return { patch };
// }

// export function useDelete<T = any>() {
//   async function del(url: string): Promise<T> {
//     const res = await api.delete(url);
//     return res.data;
//   }

//   return { del };
// }

// export function useDelete<T = any>(url: string) {
//   async function del(): Promise<T> {
//     const res = await api.delete(url);
//     return res.data;
//   }

//   return { del };
// }

export function usePost<T = any>(url: string) {
  const [loading, setLoading] = useState(false);

  async function post(body: any): Promise<T> {
    setLoading(true);
    try {
      const res = await api.post(url, body);
      return res.data;
    } finally {
      setLoading(false);
    }
  }

  return { post, loading };
}

export function usePut<T = any>(url: string) {
  const [loading, setLoading] = useState(false);

  async function put(body: any): Promise<T> {
    setLoading(true);
    try {
      const res = await api.put(url, body);
      return res.data;
    } finally {
      setLoading(false);
    }
  }

  return { put, loading };
}

export function usePatch<T = any>(url: string) {
  const [loading, setLoading] = useState(false);

  async function patch(body: any): Promise<T> {
    setLoading(true);
    try {
      const res = await api.patch(url, body);
      return res.data;
    } finally {
      setLoading(false);
    }
  }

  return { patch, loading };
}

export function useDelete<T = any>() {
  const [loading, setLoading] = useState(false);

  async function del(url: string): Promise<T> {
    setLoading(true);
    try {
      const res = await api.delete(url);
      return res.data;
    } finally {
      setLoading(false);
    }
  }

  return { del, loading };
}
