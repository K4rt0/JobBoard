import express from "express";
import { mapOrder } from "~/utils/sorts.js";
import exitHook from "async-exit-hook";
import { env } from "./config/environment";

const app = express();

const SERVER_START = () => {
  app.get("/", async (req, res) => {
    console.log(await GET_DB().listCollections().toArray());
    res.end("<h1>Hello World!</h1><hr>");
  });

  app.listen(env.SERVER_PORT, env.SERVER_HOST, () => {
    console.log(`Server is running at http://localhost:${env.SERVER_PORT}/`);
  });

  exitHook((done) => {
    console.log("Server is shutting down...");
    server.close(() => {
      CLOSE_DB();
      done();
      console.log("Server closed.");
    });
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
