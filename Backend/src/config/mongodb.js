import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "./environment";

let job_board_database_instance = null;

const mongo_client_instance = new MongoClient(env.DATABASE_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const CONNECT_DB = async () => {
  await mongo_client_instance.connect();
  job_board_database_instance = mongo_client_instance.db(env.DATABASE_NAME);
};

export const GET_DB = () => {
  if (!job_board_database_instance) throw new Error("Database not connected");
  return job_board_database_instance;
};

export const CLOSE_DB = async () => {
  await mongo_client_instance.close();
};
