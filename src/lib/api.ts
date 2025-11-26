import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});

// --- Response Interceptor ---
api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  }
);
