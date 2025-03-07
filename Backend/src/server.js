import express from "express";
import exitHook from "async-exit-hook";
import { env } from "./config/environment";
import { CONNECT_DB, CLOSE_DB, GET_DB } from "./config/mongodb.js";
import { APIs_V1 } from "./routes/v1";

const app = express();

const SERVER_START = () => {
  app.use("/api/v1", APIs_V1);

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
