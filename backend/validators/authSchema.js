import { z } from 'zod';

export const SignupSchema = z.object({
  name: z.string()
    .min(3, "Minimum three characters are required")
    .max(50, "Maximum 50 characters are allowed")
    .transform(val => val.trim()),

  phone: z.string()
    .min(10, "Phone number should be up to 10 digits")
    .max(10, "Phone number must be 10 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits 0-9")
    .transform(val => val.trim()),

  email: z.string()
  .email("Please enter the valid email format")
  .min(5, "Email must be atleat 5 characters")
  .max(254, "Email must be under 254 character")
  .transform(val=> val.trim()),

  password: z.string()
  .min(8, "Password should be atleast 8 cahracter long")
  .regex(/[a-z]/, "passowrd must contain atleast one lowercase letter")
  .regex(/[A-Z]/, "password should contain atleast one uppercase letter")
  .regex(/[0-9]/, "password should have atleast one digit 0 - 9")
  .regex(/[^a-zA-z0-9]/, "password must contain atleast one special character !@#$%")
});


export const loginSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone number format").optional(),
  password: z.string().min(1, "Password is required")
}).refine(data=> data.email || data.phone, {
  message: "Either email or phone number is required",
  path: ["email", "phone"]
})