import { log } from "console";
import mongoose from "mongoose";
// import .env from "dotenv";

type ConnectObject = {
  isConnected?: number; // Renamed here to match the reference in dbConnect
};

const connection: ConnectObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already Connected to Database");
    return;
  }
  // Your database connection logic here

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

    connection.isConnected = db.connections[0].readyState;

    console.log("DB Connected Sucessfully : dbConnect.ts");
  } catch (err) {
    console.log("DB Connection Failed: dbConnect.ts", err);
    process.exit(1);
  }
}

export default dbConnect;
