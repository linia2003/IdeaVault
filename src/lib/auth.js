import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { mongodbAdapter } from "better-auth/adapters/mongodb"; // Core architectural fix

const dbUri = process.env.MONGODB_URI;
const authSecret = process.env.BETTER_AUTH_SECRET;

if (!dbUri) {
  throw new Error("MONGODB_URI is missing from execution environmental frame.");
}

const client = new MongoClient(dbUri);
const db = client.db("ideavault");

export const auth = betterAuth({
  
  database: mongodbAdapter(db), 
  secret: authSecret,
  emailAndPassword: {
    enabled: true,
    autoSignIn: false
  },
  plugins: [jwt()],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }
  }
});