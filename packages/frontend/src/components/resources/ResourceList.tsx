import { Link, FileText, User, Calendar, StickyNote } from 'lucide-react';
import type { ResourceResponse, ResourceType } from 'contracts';
import { ResourceCard } from './ResourceCard';

interface ResourceListProps {
  resources: ResourceResponse[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const SECTION_CONFIG = {
  link: { icon: Link, label: 'Liens', color: 'var(--color-link)' },
  document: { icon: FileText, label: 'Documents', color: 'var(--color-document)' },
  contact: { icon: User, label: 'Contacts', color: 'var(--color-contact)' },
  event: { icon: Calendar, label: 'Événements', color: 'var(--color-event)' },
  note: { icon: StickyNote, label: 'Notes', color: 'var(--color-note)' },
} as const;

export function ResourceList({ resources, onView, onEdit, onDelete }: ResourceListProps) {
  // Group resources by type
  const grouped = resources.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = [];
    }
    acc[resource.type].push(resource);
    return acc;
  }, {} as Record<ResourceType, ResourceResponse[]>);

  // Order of types to display
  const order: ResourceType[] = ['link', 'document', 'contact', 'event', 'note'];

  return (
    <div className="space-y-8">
      {order.map((type) => {
        const typeResources = grouped[type];
        if (!typeResources?.length) return null;

        const config = SECTION_CONFIG[type];
        const Icon = config.icon;

        return (
          <section key={type} className="space-y-4">
            <div className="flex items-center gap-2">
              <div 
                className="p-1.5 rounded-md"
                style={{ backgroundColor: `${config.color}20`, color: config.color }}
              >
                <Icon size={18} />
              </div>
              <h2 className="font-semibold text-lg text-[var(--color-text)]">
                {config.label} <span className="text-[var(--color-text-muted)] text-sm ml-1">({typeResources.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {typeResources.map((resource) => (
                <ResourceCard 
                  key={resource.id} 
                  resource={resource} 
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </section>
        );
      })}

      {resources.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--color-text-muted)] text-lg">Aucune ressource trouvée.</p>
        </div>
      )}
    </div>
  );
}
