import { z } from 'zod';

export const signUpSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be at most 50 characters'),
    email: z.email('Invalid email address'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must be at most 100 characters'),
});

export type SignUpDto = z.infer<typeof signUpSchema>;
