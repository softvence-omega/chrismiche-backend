import { z } from "zod";

const createUserValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password must be at most 20 characters"),
    // confirmPassword: z
    //   .string({ required_error: "Confirm Password is required" })
    //   .min(6, "Confirm Password must be at least 6 characters")
    //   .max(20, "Confirm Password must be at most 20 characters"),
    fullName: z.string().optional(), 
    username: z.string().optional(),
    gender: z.string().optional(),
    image: z.string().optional(),
    phoneNumber: z.string().optional(),
    character: z.string().optional(),

    
    role: z.enum(["admin", "user"]).default("user"),
  }),
});

export const UserValidations = {
  createUserValidationSchema,
};
