import React, { useEffect, useState } from "react";

function InventoryList() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/medical/inventory");
      const data = await res.json();

      console.log("API RESPONSE:", data);

      // ✅ HANDLE BOTH FORMATS
      if (Array.isArray(data)) {
        setInventory(data);
      } else if (Array.isArray(data.data)) {
        setInventory(data.data);
      } else {
        setInventory([]);
      }

    } catch (err) {
      console.error(err);
      setInventory([]);
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Inventory Status</h3>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Stock</th>
            <th>Min Threshold</th>
            <th>Expiry</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(inventory) &&
            inventory.map((inv) => (
              <tr key={inv._id}>
                <td>{inv.itemId?.itemName}</td>
                <td>{inv.stockQty}</td>
                <td>{inv.minThreshold}</td>
                <td>
                  {inv.itemId?.expiryDate
                    ? new Date(inv.itemId.expiryDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  {inv.stockQty <= inv.minThreshold ? (
                    <span style={{ color: "red" }}>Low Stock</span>
                  ) : (
                    <span style={{ color: "green" }}>OK</span>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryList;