import {
  apiGet,
  apiPost,
} from "../api/api";

const BASE_URL =
  "/employees/api/v4/notifications";

export const notificationService = {
  getNotifications: () =>
    apiGet(`${BASE_URL}/`),

  markAsRead: (id) =>
    apiPost(`${BASE_URL}/${id}/read/`),
};