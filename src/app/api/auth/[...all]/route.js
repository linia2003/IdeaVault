import { authHandler } from "@/lib/auth-handler";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(authHandler);