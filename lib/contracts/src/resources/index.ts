import { z } from 'zod';

// ============================================
// Resource Types
// ============================================

export const ResourceTypeSchema = z.enum([
  'link',
  'document',
  'contact',
  'event',
  'note',
]);

export type ResourceType = z.infer<typeof ResourceTypeSchema>;

// ============================================
// Content Schemas by Type
// ============================================

export const LinkContentSchema = z.object({
  url: z.string().url('Invalid URL format'),
});

export const DocumentContentSchema = z.object({
  filePath: z.string().optional(),
  fileId: z.string().uuid().optional(),
  fileName: z.string().optional(),
  mimeType: z.string().min(1, 'MIME type is required'),
});

export const ContactContentSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
});

export const EventContentSchema = z.object({
  eventDate: z.string().datetime('Invalid date format'),
  location: z.string().optional(),
});

export const NoteContentSchema = z.object({
  content: z.string().min(1, 'Note content is required'),
});

// ============================================
// DTOs
// ============================================

export interface CreateResourceDto {
  title: string;
  description?: string;
  type: ResourceType;
  content: Record<string, unknown>;
  categoryId?: string;
  tagIds?: string[];
}

export interface UpdateResourceDto {
  title?: string;
  description?: string | null;
  content?: Record<string, unknown>;
  categoryId?: string | null;
  tagIds?: string[];
  isFavorite?: boolean;
}

export interface ResourceQueryDto {
  type?: ResourceType;
  categoryId?: string;
  tagIds?: string;
  isFavorite?: boolean;
  search?: string;
  sortBy?: 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ResourceResponse {
  id: string;
  title: string;
  description: string | null;
  type: ResourceType;
  content: Record<string, unknown>;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    color: string | null;
  } | null;
  tags: Array<{
    id: string;
    name: string;
  }>;
}

export interface PaginatedResourceResponse {
  data: ResourceResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// Validation Schemas
// ============================================

export const CreateResourceDtoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: ResourceTypeSchema,
  content: z.record(z.string(), z.unknown()),
  categoryId: z.string().uuid().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
});

export const UpdateResourceDtoSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional().nullable(),
  content: z.record(z.string(), z.unknown()).optional(),
  categoryId: z.string().uuid().optional().nullable(),
  tagIds: z.array(z.string().uuid()).optional(),
  isFavorite: z.boolean().optional(),
});

export const ResourceQueryDtoSchema = z.object({
  type: ResourceTypeSchema.optional(),
  categoryId: z.string().uuid().optional(),
  tagIds: z.string().optional(), // Comma-separated UUIDs
  isFavorite: z.coerce.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'title']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export const ResourceResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  type: ResourceTypeSchema,
  content: z.record(z.string(), z.unknown()),
  isFavorite: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  category: z.object({
    id: z.string().uuid(),
    name: z.string(),
    color: z.string().nullable(),
  }).nullable(),
  tags: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
  })),
});

// Helper function to validate content based on type
export function validateResourceContent(type: ResourceType, content: Record<string, unknown>) {
  switch (type) {
    case 'link':
      return LinkContentSchema.parse(content);
    case 'document':
      return DocumentContentSchema.parse(content);
    case 'contact':
      return ContactContentSchema.parse(content);
    case 'event':
      return EventContentSchema.parse(content);
    case 'note':
      return NoteContentSchema.parse(content);
    default:
      throw new Error(`Unknown resource type: ${type}`);
  }
}
