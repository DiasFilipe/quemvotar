import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72)
});

export const loginSchema = signupSchema;

export const consentSchema = z.object({
  accepted: z.boolean(),
  type: z.enum(["POLITICAL_OPINION"]).default("POLITICAL_OPINION")
});
