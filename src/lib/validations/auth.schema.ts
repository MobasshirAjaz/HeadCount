import * as z from "zod";

export const LoginSchema=z.object({
    email:z.email({error:(iss)=>(iss.input===undefined || iss.input==="")?"Email is required" : "Invalid Email address"}),
    password: z.string("Invalid password type").min(1,"Password Required")
})

export const SignUpSchema=z.object({
    email:z.email({error:(iss)=>(iss.input===undefined || iss.input==="")?"Email is required" : "Invalid Email address"}),
    password: z
    .string({error:(iss)=>(iss.input===undefined || iss.input==="")?"Password is required" : "Wrong password type"})
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    // Enforce at least one uppercase letter
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // Enforce at least one lowercase letter
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // Enforce at least one number
    .regex(/[0-9]/, "Password must contain at least one number")
    // Enforce at least one special character (anything that isn't a letter or number)
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
})