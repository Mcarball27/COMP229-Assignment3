
import dotenv from "dotenv";

dotenv.config({
  path: new URL("./.env", import.meta.url)
});

import mongoose from "mongoose";

const { default: app } = await import("./server/express.js");
const { default: router } = await import("./server/assets-router.js");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// Existing application routes
app.use("/src", router);

app.use("/", function (req, res) {
  res.send("Welcome to My Portfolio application");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
