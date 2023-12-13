import axios from "axios";

export const backend = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
});
