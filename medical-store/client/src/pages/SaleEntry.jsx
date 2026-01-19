import React, { useEffect, useState } from "react";

function SaleEntry({ onSaleSuccess }) {
  const [inventory, setInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/medical/inventory");
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectedInventory = inventory.find(
    (inv) => inv.itemId?._id === selectedItem
  );

  const availableStock = selectedInventory?.stockQty || 0;

  const isQuantityInvalid =
    quantity &&
    (Number(quantity) <= 0 || Number(quantity) > availableStock);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!selectedItem || !quantity) {
      setError("Please select a medicine and enter quantity");
      return;
    }

    if (Number(quantity) > availableStock) {
      setError("Quantity exceeds available stock");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/medical/sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: "64f123abc456789012345678",
          itemId: selectedItem,
          quantity: Number(quantity),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Sale failed");
        return;
      }

      setMessage("✅ Sale recorded successfully");
      setQuantity("");
      setSelectedItem("");

      await fetchInventory();
      if (onSaleSuccess) onSaleSuccess();
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div style={{ marginTop: "30px", border: "1px solid #ccc", padding: "15px" }}>
      <h3>Sale Entry</h3>

      <form onSubmit={handleSubmit}>
        <select
          value={selectedItem}
          onChange={(e) => {
            setSelectedItem(e.target.value);
            setError("");
          }}
          required
        >
          <option value="">Select Medicine</option>
          {inventory.map((inv) => (
            <option key={inv._id} value={inv.itemId._id}>
              {inv.itemId.itemName} (Stock: {inv.stockQty})
            </option>
          ))}
        </select>

        <br /><br />

        <input
          type="number"
          placeholder="Quantity Sold"
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value);
            setError("");
          }}
          min="1"
          required
        />

        <br />

        {isQuantityInvalid && (
          <p style={{ color: "red" }}>
            ❌ Quantity must be between 1 and {availableStock}
          </p>
        )}

        <br />

        <button
          type="submit"
          disabled={!selectedItem || !quantity || isQuantityInvalid}
        >
          Submit Sale
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}

export default SaleEntry;
