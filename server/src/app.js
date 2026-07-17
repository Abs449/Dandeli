import express from "express";
import cors from "cors";
import damStatusroutes from "./routes/damStatusRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Dandeli API is running",
  });
});
app.use("/api/dam-status", damStatusroutes);
export default app;
