import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
} from "../api/api";

const BASE_URL = "/employees/api/v4/departments";

export const departmentService = {
  getDepartments: (params = "") =>
    apiGet(`${BASE_URL}/${params}`),

  getDepartment: (id) =>
    apiGet(`${BASE_URL}/${id}/`),

  createDepartment: (data) =>
    apiPost(`${BASE_URL}/`, data),

  updateDepartment: (id, data) =>
    apiPatch(`${BASE_URL}/${id}/`, data),

  deleteDepartment: (id) =>
    apiDelete(`${BASE_URL}/${id}/`),
};