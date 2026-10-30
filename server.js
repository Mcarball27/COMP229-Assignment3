
import dotenv from "dotenv";

dotenv.config({
  path: new URL("./.env", import.meta.url)
});


import mongoose from "mongoose";

const { default: app } = await import("./server/express.js");
const { default: router } = await import("./server/assets-router.js");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

app.use("/src", router);

app.use("/", function (req, res) {
  res.send("Welcome to My Portfolio application");
});

app.listen(3000);

console.log("Server running at http://localhost:3000/");

export default app;
