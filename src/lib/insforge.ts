import { createClient } from "@insforge/sdk";

export const insforge = createClient({
  baseUrl:
    process.env.NEXT_PUBLIC_INSFORGE_URL ||
    "https://5xs4vbzv.us-east.insforge.app",
  anonKey:
    process.env.NEXT_PUBLIC_INSFORGE_KEY ||
    "ik_353ddb6e0431aef14578c5d66e897e98",
});
