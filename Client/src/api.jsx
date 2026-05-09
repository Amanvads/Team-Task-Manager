import axios from "axios";

const api = axios.create({
  baseURL: "https://team-task-manager-production-c80b.up.railway.app/api",
  withCredentials: true
});

export default api;