import { z } from 'zod';

// ============================================
// DTOs
// ============================================

export interface CreateUserDto {
    email: string;
    password: string;
    name: string;
}

export interface UpdateUserDto {
    email?: string;
    password?: string;
    name?: string;
}

// ============================================
// Schemas
// ============================================

export const CreateUserDtoSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const UpdateUserDtoSchema = z.object({
    email: z.string().email('Invalid email format').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

// Re-export UserProfile from auth responses
export { UserProfile, UserProfileSchema } from '../auth/responses.js';
