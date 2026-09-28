import { apiGet } from "../api/api";

const BASE_URL = "/employees/api/v4/dashboard";

export const dashboardService = {
  getDashboard: () => apiGet(`${BASE_URL}/`),
};