import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

// Clean unified shard reference completely isolates lookups from DNS blocks
const directShardUri = "mongodb://munaUser:munaSecure2026@cluster0-shard-00-00.lazrpvl.mongodb.net:27017,cluster0-shard-00-01.lazrpvl.mongodb.net:27017,cluster0-shard-00-02.lazrpvl.mongodb.net:27017/ideavault?ssl=true&replicaSet=atlas-lazrpvl-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
const uri = process.env.MONGODB_URI || directShardUri;

const client = new MongoClient(uri);
const db = client.db("ideavault");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      // Stripped clean of hardcoded values to satisfy GitHub Push Protection rules
      clientId: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_SECRET,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
  plugins: [jwt()],
});