import { z } from 'zod';

/**
 * File Response Schema
 */
export const FileResponseSchema = z.object({
  id: z.string().uuid(),
  filename: z.string(),
  mimeType: z.string(),
  size: z.number(),
  hash: z.string(),
  url: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type FileResponse = z.infer<typeof FileResponseSchema>;

/**
 * File Upload Response Schema
 */
export const FileUploadResponseSchema = z.object({
  id: z.string().uuid(),
  filename: z.string(),
  mimeType: z.string(),
  size: z.number(),
  hash: z.string(),
  url: z.string(),
});

export type FileUploadResponse = z.infer<typeof FileUploadResponseSchema>;
