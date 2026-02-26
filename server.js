require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Item = require("./models/Item");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors()); // Enable CORS for all origins
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✦ Connected to MongoDB Atlas"))
  .catch((err) => console.error("✕ MongoDB connection error:", err));

// GET all items
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// POST - add a new item
app.post("/api/items", async (req, res) => {
  const { text, tag, priority } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const newItem = new Item({ text, tag, priority });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to save item" });
  }
});

// PATCH - update a single item by id
app.patch("/api/items/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ error: "Item not found" });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

// DELETE a single item by id
app.delete("/api/items/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: "Item not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// DELETE all completed items
app.delete("/api/items/completed/all", async (req, res) => {
  try {
    const result = await Item.deleteMany({ completed: true });
    res.json({ success: true, removed: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear completed items" });
  }
});

app.listen(PORT, () => {
  console.log(`✦ Wishlist Pro running → http://localhost:${PORT}`);
});
