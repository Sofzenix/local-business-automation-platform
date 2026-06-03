import mongoose from "mongoose";
import ProductMenu from "../models/ProductMenu.js";
import Business from "../models/Business.js";

async function seedMedicalProducts() {

  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/messaging-system");

  const business = await Business.findOne({ businessType: "medical" });

  if (!business) {
    console.log("Medical business not found");
    return;
  }

  const medicines = [

    {
      itemId: "MED001-01",
      businessId: "MED001",
      itemName: "Paracetamol 500mg",
      category: "Fever",
      price: 20,
      stock:20,
      expiryDate: new Date("2026-03-14"),
      isAvailable: true
    },

    {
      itemId: "MED001-02",
      businessId: "MED001",
      itemName: "Azithromycin 250mg",
      category: "Antibiotic",
      price: 85,
      stock:20,
      expiryDate: new Date("2026-03-28"),
      isAvailable: true
    },

    {
      itemId: "MED001-03",
      businessId: "MED001",
      itemName: "Cetirizine 10mg",
      category: "Allergy",
      price: 15,
      stock:20,
      expiryDate: new Date("2026-03-30"),
      isAvailable: true
    },

    {
      itemId: "MED001-04",
      businessId: "MED001",
      itemName: "Ibuprofen 400mg",
      category: "Pain Relief",
      price: 25,
      stock:20,
      expiryDate: new Date("2026-04-15"),
      isAvailable: true
    },

    {
      itemId: "MED001-05",
      businessId: "MED001",
      itemName: "ORS Sachet",
      category: "Hydration",
      price: 10,
      stock:20,
      expiryDate: new Date("2026-06-01"),
      isAvailable: true
    }

  ];

  await ProductMenu.insertMany(medicines);

  console.log("Medical products seeded successfully");

  process.exit();
}

seedMedicalProducts();