import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";


const connectionUri = process.env.MONGODB_URI || "mongodb://localhost:27017/ideavault";

const client = new MongoClient(connectionUri);
const db = client.db("ideavault");

export const authHandler = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder_secret",
    },
  },
  plugins: [jwt()],
});