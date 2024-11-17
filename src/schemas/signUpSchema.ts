import { z } from 'zod';

export const signupSchema = z.object({
    username : z.string().email({message : 'invalid email address'}),
    password : z.string()
})