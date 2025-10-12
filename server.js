import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = 5000; // You can change this

app.use(cors());
app.use(express.json());

// Path to your products.json
const PRODUCTS_FILE = path.join(process.cwd(), "src/data/products.json");

// Helper to read products.json
const readProducts = () => {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading products.json:", err);
    return [];
  }
};

// Helper to write products.json
const writeProducts = (products) => {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing products.json:", err);
  }
};

// GET all products
app.get("/products", (req, res) => {
  const products = readProducts();
  res.json(products);
});

// POST add a new product
app.post("/products", (req, res) => {
  const products = readProducts();
  const newProduct = { id: crypto.randomUUID(), ...req.body };
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

// PUT update a product
app.put("/products/:id", (req, res) => {
  const products = readProducts();
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });

  products[index] = { ...products[index], ...req.body };
  writeProducts(products);
  res.json(products[index]);
});

// DELETE a product
app.delete("/products/:id", (req, res) => {
  let products = readProducts();
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });

  const deleted = products.splice(index, 1)[0];
  writeProducts(products);
  res.json(deleted);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
