import React, { useEffect, useState } from "react";

function InventoryList() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/medical/inventory"
      );
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading inventory...</p>;

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Inventory Status</h3>

      {inventory.length === 0 ? (
        <p>No inventory available.</p>
      ) : (
        <table border="1" cellPadding="8">
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
            {inventory.map((inv) => (
              <tr key={inv._id}>
                <td>{inv.itemId?.itemName}</td>
                <td>{inv.stockQty}</td>
                <td>{inv.minThreshold}</td>
                <td>
                  {new Date(inv.itemId?.expiryDate).toLocaleDateString()}
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
      )}
    </div>
  );
}

export default InventoryList;
