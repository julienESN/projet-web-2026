import { z } from 'zod';

export const LoginDtoSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
});

export const RegisterDtoSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
    email: z.string().email(),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;
export type RegisterDto = z.infer<typeof RegisterDtoSchema>;