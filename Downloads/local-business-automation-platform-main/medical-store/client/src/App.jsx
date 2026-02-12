import React from "react";
import AddMedicine from "./pages/AddMedicine.jsx";
import InventoryList from "./pages/InventoryList.jsx";
import SaleEntry from "./pages/SaleEntry.jsx";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Medical Store Automation</h2>

      <AddMedicine />

      <SaleEntry />

      <InventoryList />
    </div>
  );
}

export default App;
