import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const dbUri = process.env.MONGODB_URI;
const authSecret = process.env.BETTER_AUTH_SECRET;

if (!dbUri) {
  throw new Error("Missing Critical Path: MONGODB_URI is undefined in the local execution context.");
}


const client = new MongoClient(dbUri, {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4
});

const db = client.db("ideavault");

export const auth = betterAuth({
 
  database: mongodbAdapter(db, {
    client: client
  }),
  secret: authSecret,
  emailAndPassword: {
    enabled: true,
    autoSignIn: false
  },
  socialProviders: {
    google: {
      
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60 
    }
  },
  plugins: [jwt()]
});