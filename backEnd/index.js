const express = require("express");
const ConnectDB = require("./config");
const authRoutes = require("./routes/auth.routes");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
ConnectDB();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api/v1/auth/", authRoutes);
app.use("*", (req, res) => {
  return res.status(404).json({ status: "error", message: "Page Not Found", code: 404 });
});
app.listen(process.env.PORT, () => {
  console.log(`Server Runing 😁 on Port ${process.env.PORT}`);
});
