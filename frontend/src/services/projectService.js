import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
} from "../api/api";

const BASE_URL = "/employees/api/v4/projects";

export const projectService = {
  getProjects: (params = "") =>
    apiGet(`${BASE_URL}/${params}`),

  getProject: (id) =>
    apiGet(`${BASE_URL}/${id}/`),

  createProject: (data) =>
    apiPost(`${BASE_URL}/`, data),

  updateProject: (id, data) =>
    apiPatch(`${BASE_URL}/${id}/`, data),

  deleteProject: (id) =>
    apiDelete(`${BASE_URL}/${id}/`),
};