import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required!" }),
    email: z.string().email({ message: "Email is required!" }),
    contact: z
      .string()
      .min(4, { message: "Contact is required! (Minimun of 4 character)." }),
    password: z
      .string()
      .min(4, { message: "Password is required! (Minimum of 4 characters)." }),
    confirmPassword: z.string().min(4, { message: "Confirm is required!" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email({ message: "Email is required!" }),
  password: z
    .string()
    .min(4, { message: "Password is required! (Minimum of 4 characters)." }),
});

export const updateProfileSchema = z.object({
  contact: z
    .string()
    .min(4, { message: "Contact is required! (Minimun of 4 character)." }),
  name: z.string().min(1, { message: "Name is required" }),
});

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(4, { message: "Password is required! (Minimum of 4 characters)." }),
    confirmPassword: z.string().min(4, { message: "Confirm is required!" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
