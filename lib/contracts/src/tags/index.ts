import { z } from 'zod';

// ============================================
// DTOs
// ============================================

export interface CreateTagDto {
    name: string;
}

export interface TagResponse {
    id: string;
    name: string;
    createdAt: Date;
    _count?: {
        resources: number;
    };
}

// ============================================
// Schemas
// ============================================

export const CreateTagDtoSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(30, 'Name must be at most 30 characters')
        .transform((s) => s.toLowerCase().trim()),
});

export const TagResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    createdAt: z.date(),
    _count: z
        .object({
            resources: z.number(),
        })
        .optional(),
});
