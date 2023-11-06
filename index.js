const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`);
});
