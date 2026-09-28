import {
  apiGet,
  apiPost,
} from "../api/api";

const BASE_URL = "/employees/api/v4/leave";

export const leaveService = {
  requestLeave: (data) =>
    apiPost(`${BASE_URL}/request/`, data),

  getMyLeaves: () =>
    apiGet(`${BASE_URL}/`),

  getApprovals: () =>
    apiGet(`${BASE_URL}/approvals/`),

  reviewLeave: (id, action) =>
    apiPost(`${BASE_URL}/${id}/${action}/`),
};