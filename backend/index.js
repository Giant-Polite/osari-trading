import express from "express";
import fs from "fs/promises";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from parent directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Allow both local dev, Vercel, and custom domain
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://osari-trading.vercel.app",
      "https://osari-trading.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

const DATA_FILE = path.resolve(__dirname, "../src/data/products.json");

// Read JSON file
async function readProducts() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

// Write JSON file
async function writeProducts(products) {
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), "utf-8");
}

// GET all products (from JSON)
app.get("/api/products", async (req, res) => {
  const products = await readProducts();
  res.json(products);
});

// POST new product
app.post("/api/products", async (req, res) => {
  const product = req.body;
  if (!product.id || !product.name || !product.category) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const products = await readProducts();
  products.push(product);
  await writeProducts(products);
  res.status(201).json({ success: true, products });
});

// PUT update product
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const updated = req.body;
  const products = await readProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }
  products[index] = { ...products[index], ...updated };
  await writeProducts(products);
  res.json({ success: true, products });
});

// DELETE product
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const products = await readProducts();
  const filtered = products.filter((p) => p.id !== id);
  await writeProducts(filtered);
  res.json({ success: true, products: filtered });
});

// GET single product
app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const products = await readProducts();
  const product = products.find((p) => p.id === id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// Ping endpoint to keep Supabase active
app.get("/api/ping", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products") // Replace with your actual Supabase table name
      .select("id")
      .limit(1);
    if (error) {
      console.error("Ping error:", error);
      return res.status(500).json({ error: "Supabase query failed" });
    }
    res.json({ status: "pong", message: "Supabase active!", data });
  } catch (err) {
    console.error("Ping error:", err);
    res.status(500).json({ error: "Ping failed" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Express API running on http://localhost:${PORT}`)
);