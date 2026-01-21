import type { ResourceType } from 'contracts';

interface ResourceFiltersProps {
  currentFilter: ResourceType | 'all';
  onFilterChange: (filter: ResourceType | 'all') => void;
  counts: Record<ResourceType | 'all', number>;
}

const FILTERS: Array<{ id: ResourceType | 'all'; label: string }> = [
  { id: 'all', label: 'Toutes' },
  { id: 'link', label: 'Liens' },
  { id: 'document', label: 'Documents' },
  { id: 'contact', label: 'Contacts' },
  { id: 'event', label: 'Événements' },
  { id: 'note', label: 'Notes' },
];

export function ResourceFilters({ currentFilter, onFilterChange, counts }: ResourceFiltersProps) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 shadow-sm w-full">
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-[var(--color-text)]">Filtrer par type</h3>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const isActive = currentFilter === filter.id;
            const count = counts[filter.id] || 0;
            
            return (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={`
                  inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-[var(--color-primary)] text-white shadow-sm' 
                    : 'bg-[var(--color-background)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text)]'
                  }
                `}
              >
                {filter.label}
                <span 
                  className={`
                    px-1.5 py-0.5 rounded textxs font-semibold
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white text-[var(--color-text-muted)] border border-[var(--color-border)]'
                    }
                  `}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
