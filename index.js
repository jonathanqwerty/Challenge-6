const express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  cors = require("cors"),
  router = require("./routes/upload");

require("dotenv").config();

app.use(express.json({ strick: false }));
app.use(cors());
app.use("/images", express.static("public/images"));
app.use("/api/v1", router);

// Handle 404 route
app.get("*", (req, res) => {
  return res.status(404).json({
    error: "End point is not registered",
  });
});

app.listen(port, () => {
  console.log(`Server is running at PORT ${port}`);
});
