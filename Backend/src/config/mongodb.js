import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "./environment";

let jobBoardDatabaseInstance = null;

const mongoClientInstance = new MongoClient(env.DATABASE_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect();
  jobBoardDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME);
};

export const GET_DB = () => {
  if (!jobBoardDatabaseInstance) throw new Error("Database not connected");
  return jobBoardDatabaseInstance;
};

export const CLOSE_DB = async () => {
  await mongoClientInstance.close();
};
