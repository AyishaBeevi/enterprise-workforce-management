import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
} from "../api/api";

const BASE_URL = "/employees/api/v4/employees";

export const employeeService = {
  getEmployees: (params = "") =>
    apiGet(`${BASE_URL}/${params}`),

  getEmployeesPage: (url) =>
    apiGet(url),

  getEmployee: (id) =>
    apiGet(`${BASE_URL}/${id}/`),

  createEmployee: (data) =>
    apiPost(`${BASE_URL}/`, data),

  updateEmployee: (id, data) =>
    apiPatch(`${BASE_URL}/${id}/`, data),

  deleteEmployee: (id) =>
    apiDelete(`${BASE_URL}/${id}/`),
};