import { z } from 'zod';

export const testRequestSchema = z.object({
    input: z.string().min(1, 'Input cannot be empty'),
});

export type TestRequest = z.infer<typeof testRequestSchema>;
