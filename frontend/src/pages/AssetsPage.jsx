import { useState } from "react";

import AssetForm from "../components/AssetForm";
import AssetList from "../components/AssetList";

function AssetsPage() {
  const [selectedAsset, setSelectedAsset] =
    useState(null);

  const [refresh, setRefresh] = useState(0);

  const handleSaved = () => {
    setSelectedAsset(null);

    setRefresh(
      (current) => current + 1
    );
  };

  return (
    <div>
      <div className="page-header">
        <h1>Assets</h1>

        <p>
          Manage company equipment and assets.
        </p>
      </div>

      <AssetForm
        asset={selectedAsset}
        onSaved={handleSaved}
        onCancel={() =>
          setSelectedAsset(null)
        }
      />

      <AssetList
        key={refresh}
        onEdit={setSelectedAsset}
      />
    </div>
  );
}

export default AssetsPage;