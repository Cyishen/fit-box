import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";

// todo* RPC code (lib folder)
export const client =  hc<AppType>(process.env.NEXT_PUBLIC_URL!)