import { z } from 'zod';

// ============================================
// DTOs
// ============================================

export interface CreateCategoryDto {
    name: string;
    color?: string;
}

export interface UpdateCategoryDto {
    name?: string;
    color?: string | null;
}

export interface CategoryResponse {
    id: string;
    name: string;
    color: string | null;
    createdAt: Date;
    _count?: {
        resources: number;
    };
}

// ============================================
// Schemas
// ============================================

export const CreateCategoryDtoSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name must be at most 50 characters'),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color (#RRGGBB)').optional(),
});

export const UpdateCategoryDtoSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name must be at most 50 characters').optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color (#RRGGBB)').optional().nullable(),
});

export const CategoryResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    color: z.string().nullable(),
    createdAt: z.date(),
    _count: z.object({
        resources: z.number(),
    }).optional(),
});
