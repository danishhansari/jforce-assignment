import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(1),
    contact: z.string(),
    password: z.string().min(4),
    confirmPassword: z.string().min(4),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password doesn't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});
