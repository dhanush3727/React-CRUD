// Create Server
const express = require("express");
const app = express();
const data = require("./sample.json");
const cors = require("cors");
const fs = require("fs");

// Using Middleware
app.use(express.json());
app.use(cors());

const PORT = 8000;
app.listen(PORT, (err) => {
  console.log(`App is running in ${PORT}`);
});

// Display all users
app.get("/data", (req, res) => {
  return res.json(data);
});

// Delete data
app.delete("/data/:id", (req, res) => {
  let id = Number(req.params.id);
  let filteredData = data.filter((user) => user.id !== id);
  fs.writeFile("./sample.json", JSON.stringify(filteredData), (err, data) => {
    return res.json(filteredData);
  });
});

// Add new data
app.post("/data", (req, res) => {
  let { name, age, city } = req.body;
  if (!name || !age || !city) {
    res.status(400).send({ message: "All fields required" });
  }
  let id = Date.now();
  data.push({ id, name, age, city });
  fs.writeFile("./sample.json", JSON.stringify(data), (err, data) => {
    return res.json({ message: "User detail added success" });
  });
});

// Edit data
app.patch("/data/:id", (req, res) => {
  let id = Number(req.params.id);
  let { name, age, city } = req.body;
  if (!name || !age || !city) {
    res.status(400).send({ message: "All fields required" });
  }
  let index = data.findIndex((user) => user.id === id);
  data.splice(index, 1, { ...req.body });
  fs.writeFile("./sample.json", JSON.stringify(data), (err, data) => {
    return res.json({ message: "User detail updated success" });
  });
});
