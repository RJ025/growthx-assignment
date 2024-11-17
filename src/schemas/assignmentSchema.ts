import { z } from 'zod';


export const assignmentSchema = z.object({
    task : z.string(),
    admin : z.string().email({message : 'please enter right email'})
})