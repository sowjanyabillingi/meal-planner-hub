const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// GET meals route
app.get("/getMeals", (req, res) => {
  try {
    if (fs.existsSync("meals.json")) {
      const data = fs.readFileSync("meals.json", "utf8");
      res.json(JSON.parse(data));
    } else {
      res.json({});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error loading meals"
    });
  }
});

// Save meals route
app.post("/saveMeals", (req, res) => {
  try {
    fs.writeFileSync(
      "meals.json",
      JSON.stringify(req.body, null, 2)
    );

    console.log("Meals saved:", req.body);

    res.json({
      success: true,
      message: "Meals saved!"
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Error saving meals"
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});