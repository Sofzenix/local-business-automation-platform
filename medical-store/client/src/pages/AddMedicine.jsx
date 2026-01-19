import React,{ useState } from "react";

function AddMedicine() {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [stockQty, setStockQty] = useState("");
  const [minThreshold, setMinThreshold] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      businessId: "64f123abc456789012345678", // TEMP (later comes from login)
      itemName,
      price: Number(price),
      expiryDate,
      stockQty: Number(stockQty),
      minThreshold: Number(minThreshold),
    };

    try {
      const res = await fetch(
        "http://localhost:5000/api/medical/add-medicine",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        setMessage(result.message || "Error adding medicine");
        return;
      }

      setMessage("✅ Medicine added successfully");

      // clear form
      setItemName("");
      setPrice("");
      setExpiryDate("");
      setStockQty("");
      setMinThreshold("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Server error");
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "15px" }}>
      <h3>Add Medicine</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Medicine Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="number"
          placeholder="Stock Quantity"
          value={stockQty}
          onChange={(e) => setStockQty(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="number"
          placeholder="Min Stock Threshold"
          value={minThreshold}
          onChange={(e) => setMinThreshold(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Add Medicine</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddMedicine;
