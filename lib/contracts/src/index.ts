import { z } from 'zod';

export const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().min(2),
    createdAt: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const PostSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    authorId: z.string(),
});

export type Post = z.infer<typeof PostSchema>;
