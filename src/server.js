import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(
        `🚀 Auth Service running on http://localhost:${env.port}`
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();