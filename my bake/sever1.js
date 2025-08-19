const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize database
const db = new sqlite3.Database("./orders.db");

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    address TEXT,
    date TEXT,
    time TEXT,
    items TEXT,
    total INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// API: Save new order
app.post("/order", (req, res) => {
  const { name, phone, address, date, time, cart, total } = req.body;

  const stmt = db.prepare(
    "INSERT INTO orders (name, phone, address, date, time, items, total) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  stmt.run(name, phone, address, date, time, JSON.stringify(cart), total, function (err) {
    if (err) {
      return res.status(500).json({ error: "Failed to save order" });
    }
    res.json({ success: true, orderId: this.lastID });
  });
  stmt.finalize();
});

// API: Get all orders (for order history)
app.get("/orders", (req, res) => {
  db.all("SELECT * FROM orders ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch orders" });
    }
    res.json(rows);
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
