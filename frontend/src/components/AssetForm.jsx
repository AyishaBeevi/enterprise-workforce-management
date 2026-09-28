import { useEffect, useState } from "react";
import { assetService } from "../services/assetService";

import Button from "./common/Button";
import ErrorMessage from "./common/ErrorMessage";

import { useAuth } from "../context/AuthContext";

function AssetForm({
  asset,
  onSaved,
  onCancel,
}) {

  const { hasPermission } = useAuth();

  const [form, setForm] = useState({
    asset_id: "",
    name: "",
    asset_type: "",
    purchase_date: "",
    is_active: true,
  });

  const [error, setError] = useState("");

  // ==========================================
  // RBAC
  // ==========================================

  const canAdd = hasPermission(
    "employees.add_asset"
  );

  const canEdit = hasPermission(
    "employees.change_asset"
  );

  // ==========================================
  // Load asset data
  // ==========================================

  useEffect(() => {
    if (asset) {
      setForm({
        asset_id: asset.asset_id,
        name: asset.name,
        asset_type: asset.asset_type,
        purchase_date:
          asset.purchase_date || "",
        is_active: asset.is_active,
      });
    } else {
      setForm({
        asset_id: "",
        name: "",
        asset_type: "",
        purchase_date: "",
        is_active: true,
      });
    }
  }, [asset]);

  // ==========================================
  // Permission check
  // ==========================================

  // Creating an asset requires add permission
  if (!asset && !canAdd) {
    return null;
  }

  // Editing an asset requires change permission
  if (asset && !canEdit) {
    return null;
  }

  // ==========================================
  // Handle input changes
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================
  // Submit
  // ==========================================
   const handleSubmit = async (event) => {
  event.preventDefault();
  setError("");

  try {
    let response;

    if (asset) {
      response = await assetService.updateAsset(
        asset.id,
        form
      );
    } else {
      response = await assetService.createAsset(form);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail ||
          data.asset_id?.[0] ||
          "Failed to save asset."
      );
    }

    onSaved();
  } catch (error) {
    setError(error.message);
  }
};
  

  // ==========================================
  // UI
  // ==========================================

  return (
    <section className="form-card">
      <div className="page-section-header">
        <h2>
          {asset
            ? "Edit Asset"
            : "Add Asset"}
        </h2>

        <p>
          {asset
            ? "Update asset information."
            : "Register a new company asset."}
        </p>
      </div>

      <ErrorMessage message={error} />

      <form
        className="asset-form"
        onSubmit={handleSubmit}
      >
        <div className="form-grid">

          <div className="form-field">
            <label>Asset ID</label>

            <input
              name="asset_id"
              value={form.asset_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Asset Name</label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Asset Type</label>

            <input
              name="asset_type"
              value={form.asset_type}
              onChange={handleChange}
              placeholder="Laptop, Monitor, Vehicle..."
              required
            />
          </div>

          <div className="form-field">
            <label>Purchase Date</label>

            <input
              type="date"
              name="purchase_date"
              value={form.purchase_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />

              Active asset
            </label>
          </div>

        </div>

        <div className="form-actions">
          <Button type="submit">
            {asset
              ? "Update Asset"
              : "Add Asset"}
          </Button>

          {asset && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}

export default AssetForm;