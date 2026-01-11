import { environment } from "@/constants/environment";
import axios from "axios";

export const api = axios.create({
  baseURL: environment.VITE_API_URL,
  withCredentials: true,
});
