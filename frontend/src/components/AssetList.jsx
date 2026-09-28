import { useEffect, useState } from "react";
import { assetService } from "../services/assetService";

import DataTable from "./common/DataTable";
import Loading from "./common/Loading";
import ErrorMessage from "./common/ErrorMessage";
import Button from "./common/Button";

import { useAuth } from "../context/AuthContext";

function AssetList({ onEdit }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { hasPermission } = useAuth();

  const loadAssets = async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await assetService.getAssets();

        if (!response.ok) {
          throw new Error(
            "Failed to load assets."
          );
        }

        const data = await response.json();

        setAssets(data.results || data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this asset?")) {
      return;
    }

    try {
      const response =
        await assetService.deleteAsset(id);

      if (!response.ok) {
        throw new Error(
          "Failed to delete asset."
        );
      }

      setAssets((current) =>
        current.filter(
          (asset) => asset.id !== id
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const columns = [
    {
      key: "asset_id",
      label: "Asset ID",
    },

    {
      key: "name",
      label: "Name",
    },

    {
      key: "asset_type",
      label: "Type",
    },

    {
      key: "purchase_date",
      label: "Purchase Date",
      render: (asset) =>
        asset.purchase_date || "-",
    },

    {
      key: "is_active",
      label: "Status",
      render: (asset) => (
        <span
          className={
            asset.is_active
              ? "status-active"
              : "status-inactive"
          }
        >
          {asset.is_active
            ? "Active"
            : "Inactive"}
        </span>
      ),
    },
  ];

  const canEdit = hasPermission(
    "employees.change_asset"
  );

  const canDelete = hasPermission(
    "employees.delete_asset"
  );

  if (canEdit || canDelete) {
    columns.push({
      key: "actions",
      label: "Actions",
      render: (asset) => (
        <div className="table-actions">

          {canEdit && (
            <Button
              variant="secondary"
              onClick={() => onEdit(asset)}
            >
              Edit
            </Button>
          )}

          {canDelete && (
            <Button
              variant="danger"
              onClick={() =>
                handleDelete(asset.id)
              }
            >
              Delete
            </Button>
          )}

        </div>
      ),
    });
  }

  if (loading) {
    return (
      <Loading message="Loading assets..." />
    );
  }

  return (
    <section>
      <ErrorMessage message={error} />

      <DataTable
        columns={columns}
        data={assets}
        emptyMessage="No assets found."
      />
    </section>
  );
}

export default AssetList;