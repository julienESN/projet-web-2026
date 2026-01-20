// Application constants

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const RESOURCE_TYPES = ['link', 'document', 'contact', 'event', 'note'] as const;

export const RESOURCE_TYPE_LABELS: Record<string, string> = {
    link: 'Lien',
    document: 'Document',
    contact: 'Contact',
    event: 'Événement',
    note: 'Note',
};

export const RESOURCE_TYPE_COLORS: Record<string, string> = {
    link: '#3B82F6',
    document: '#EF4444',
    contact: '#F59E0B',
    event: '#8B5CF6',
    note: '#10B981',
};

export const PAGINATION_DEFAULTS = {
    page: 1,
    limit: 20,
};
