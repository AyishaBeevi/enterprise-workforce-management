import {
  apiGet,
  apiPost,
} from "../api/api";

const BASE_URL = "/employees/api/v4/attendance";

export const attendanceService = {
  getAttendance: () =>
    apiGet(`${BASE_URL}/`),

  checkIn: () =>
    apiPost(`${BASE_URL}/check-in/`),

  checkOut: () =>
    apiPost(`${BASE_URL}/check-out/`),
};