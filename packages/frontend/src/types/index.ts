// Types for the Resource Manager application
// Based on the Prisma schema and API contracts

export type ResourceType = 'link' | 'document' | 'contact' | 'event' | 'note';

export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    name: string;
    color?: string;
    createdAt: string;
}

export interface Tag {
    id: string;
    name: string;
    createdAt: string;
}

// Content types based on ResourceType
export interface LinkContent {
    url: string;
}

export interface DocumentContent {
    filePath: string;
    mimeType: string;
}

export interface ContactContent {
    email?: string;
    phone?: string;
    company?: string;
}

export interface EventContent {
    eventDate: string;
    location?: string;
}

export interface NoteContent {
    content: string;
}

export type ResourceContent =
    | LinkContent
    | DocumentContent
    | ContactContent
    | EventContent
    | NoteContent;

export interface Resource {
    id: string;
    title: string;
    description?: string;
    type: ResourceType;
    content: ResourceContent;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
    category?: Category;
    tags: Tag[];
}

// API Response types
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface AuthResponse {
    access_token: string;
}
