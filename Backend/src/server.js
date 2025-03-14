import express from "express";
import exitHook from "async-exit-hook";
import { env } from "./config/environment";
import { CONNECT_DB, CLOSE_DB } from "./config/mongodb.js";
import { APIs_V1 } from "./routes/v1";
import { error_handling_middleware } from "./middlewares/error-handling.middleware";
import cors from "cors";
import cors_options from "./config/cors";

const SERVER_START = () => {
  const app = express();

  app.use(cors(cors_options));

  app.use(express.json());

  app.use("/api/v1", APIs_V1);

  app.use(error_handling_middleware);

  app.listen(env.SERVER_PORT, env.SERVER_HOST, () => {
    console.log(`Server is running at http://localhost:${env.SERVER_PORT}/`);
  });

  exitHook(() => {
    console.log("Server is shutting down...");
    CLOSE_DB();
    console.log("Server closed.");
  });
};

(async () => {
  try {
    console.log("Server is connecting to Cloud Database...");
    await CONNECT_DB();
    console.log("Database is connected !!!");

    SERVER_START();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();
