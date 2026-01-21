import { Link, FileText, User, Calendar, StickyNote } from 'lucide-react';
import type { ResourceType } from 'contracts';
import { Card, CardBody } from '../ui';

interface ResourceStatsProps {
  counts: Record<ResourceType, number>;
}

const STATS_CONFIG = {
  link: { icon: Link, color: 'var(--color-link)', label: 'Liens' },
  document: { icon: FileText, color: 'var(--color-document)', label: 'Documents' },
  contact: { icon: User, color: 'var(--color-contact)', label: 'Contacts' },
  event: { icon: Calendar, color: 'var(--color-event)', label: 'Événements' },
  note: { icon: StickyNote, color: 'var(--color-note)', label: 'Notes' },
} as const;

export function ResourceStats({ counts }: ResourceStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {(Object.entries(STATS_CONFIG) as [ResourceType, typeof STATS_CONFIG[ResourceType]][]).map(([type, config]) => {
        const Icon = config.icon;
        const count = counts[type] || 0;

        return (
          <Card key={type} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardBody className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-text-muted)]">{config.label}</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{count}</p>
              </div>
              <div 
                className="p-3 rounded-xl opacity-80"
                style={{ 
                  backgroundColor: `${config.color}20`, 
                  color: config.color 
                }}
              >
                <Icon size={24} />
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
