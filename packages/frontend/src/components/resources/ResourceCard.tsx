import { Link, FileText, User, Calendar, StickyNote, Eye, Edit2, Trash2 } from 'lucide-react';
import type { ResourceResponse } from 'contracts';
import { Card, CardBody, Badge, Button } from '../ui';

interface ResourceCardProps {
  resource: ResourceResponse;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TYPE_CONFIG = {
  link: { icon: Link, color: 'var(--color-link)', label: 'Lien' },
  document: { icon: FileText, color: 'var(--color-document)', label: 'Document' },
  contact: { icon: User, color: 'var(--color-contact)', label: 'Contact' },
  event: { icon: Calendar, color: 'var(--color-event)', label: 'Événement' },
  note: { icon: StickyNote, color: 'var(--color-note)', label: 'Note' },
} as const;

export function ResourceCard({ resource, onView, onEdit, onDelete }: ResourceCardProps) {
  const { type, title, description, category, tags } = resource;
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardBody className="flex flex-col h-full gap-4">
        <div className="flex items-start justify-between gap-4">
          <div 
            className="p-2 rounded-lg bg-[var(--bg-opacity)]"
            style={{ 
              backgroundColor: `${config.color}15`, // 10% opacity
              color: config.color 
            }}
          >
            <Icon size={20} />
          </div>
          <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
            {config.label}
          </span>
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-lg text-[var(--color-text)] line-clamp-1">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">
              {description}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {(category || tags.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {category && (
                <Badge 
                  size="sm" 
                  style={{ 
                    backgroundColor: category.color ? `${category.color}20` : undefined,
                    color: category.color || undefined,
                    borderColor: category.color || undefined
                  }}
                >
                  {category.name}
                </Badge>
              )}
              {tags.map(tag => (
                <span key={tag.id} className="text-xs text-[var(--color-text-muted)]">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-border)]">
            <Button 
              variant="secondary" 
              size="sm" 
              className="flex-1 gap-2 text-[var(--color-primary)] bg-blue-50 hover:bg-blue-100 border-transparent"
              onClick={() => onView?.(resource.id)}
            >
              <Eye size={16} />
              Voir
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              onClick={() => onEdit?.(resource.id)}
            >
              <Edit2 size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-[var(--color-text-muted)] hover:text-[var(--color-error)]"
              onClick={() => onDelete?.(resource.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
