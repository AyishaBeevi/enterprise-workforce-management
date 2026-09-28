import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
} from "../api/api";

const BASE_URL = "/employees/api/v4/assets";

export const assetService = {
  getAssets: (params = "") =>
    apiGet(`${BASE_URL}/${params}`),

  getAsset: (id) =>
    apiGet(`${BASE_URL}/${id}/`),

  createAsset: (data) =>
    apiPost(`${BASE_URL}/`, data),

  updateAsset: (id, data) =>
    apiPatch(`${BASE_URL}/${id}/`, data),

  deleteAsset: (id) =>
    apiDelete(`${BASE_URL}/${id}/`),
};