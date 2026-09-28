import {
  apiGet,
  apiPost,
  apiDelete,
} from "../api/api";

const PROJECT_ASSIGNMENT_URL =
  "/employees/api/v4/project-assignments";

const ASSET_ASSIGNMENT_URL =
  "/employees/api/v4/asset-assignments";

export const projectAssignmentService = {
  getAssignments: () =>
    apiGet(`${PROJECT_ASSIGNMENT_URL}/`),

  createAssignment: (data) =>
    apiPost(`${PROJECT_ASSIGNMENT_URL}/`, data),

  deleteAssignment: (id) =>
    apiDelete(`${PROJECT_ASSIGNMENT_URL}/${id}/`),
};

export const assetAssignmentService = {
  getAssignments: () =>
    apiGet(`${ASSET_ASSIGNMENT_URL}/`),

  createAssignment: (data) =>
    apiPost(`${ASSET_ASSIGNMENT_URL}/`, data),

  deleteAssignment: (id) =>
    apiDelete(`${ASSET_ASSIGNMENT_URL}/${id}/`),

returnAsset: (id) =>
  apiPost(`${ASSET_ASSIGNMENT_URL}/${id}/return/`),
};