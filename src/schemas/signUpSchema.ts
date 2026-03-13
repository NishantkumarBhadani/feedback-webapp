import {email, z} from 'zod'

export const usernamevalidation=z
.string()
.min(2,"Username must be atleast of two characters")
.min(2,"Username can't be more than twenty characters")
.regex(/^[a-zA-Z0-9_]+$/,"Username must contain special characters")


export const signUpSchema=z.object({
    username:usernamevalidation,
    email:z.string().email({message:"Email is invalid"}),
    password:z.string().min(6,{message:"Password must be at least 6 character"})
})