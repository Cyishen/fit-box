import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";

// todo* RPC code (lib folder)
export const client =  hc<AppType>('http://localhost:3000')