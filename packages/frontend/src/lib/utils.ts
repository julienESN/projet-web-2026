// Utility functions for the Resource Manager application

import type { ResourceType } from '../types';

/**
 * Format a date string to a localized format
 */
export function formatDate(dateString: string, locale = 'fr-FR'): string {
    return new Date(dateString).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Format a relative time (e.g., "il y a 2 jours")
 */
export function formatRelativeTime(dateString: string, locale = 'fr-FR'): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (diffDays === 0) return rtf.format(0, 'day'); // "aujourd'hui"
    if (diffDays < 7) return rtf.format(-diffDays, 'day');
    if (diffDays < 30) return rtf.format(-Math.floor(diffDays / 7), 'week');
    return rtf.format(-Math.floor(diffDays / 30), 'month');
}

/**
 * Get the icon name for a resource type
 */
export function getResourceTypeIcon(type: ResourceType): string {
    const icons: Record<ResourceType, string> = {
        link: '🔗',
        document: '📄',
        contact: '👤',
        event: '📅',
        note: '📝',
    };
    return icons[type];
}

/**
 * Get the color for a resource type
 */
export function getResourceTypeColor(type: ResourceType): string {
    const colors: Record<ResourceType, string> = {
        link: '#3B82F6',
        document: '#EF4444',
        contact: '#F59E0B',
        event: '#8B5CF6',
        note: '#10B981',
    };
    return colors[type];
}

/**
 * Get the label for a resource type
 */
export function getResourceTypeLabel(type: ResourceType): string {
    const labels: Record<ResourceType, string> = {
        link: 'Lien',
        document: 'Document',
        contact: 'Contact',
        event: 'Événement',
        note: 'Note',
    };
    return labels[type];
}

/**
 * Truncate a string to a maximum length
 */
export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + '...';
}

/**
 * Classnames utility (like clsx/classnames)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}
