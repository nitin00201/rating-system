import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000", // adjust as needed
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
