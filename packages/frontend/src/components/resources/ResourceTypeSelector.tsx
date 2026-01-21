import type { ResourceType } from 'contracts';

interface ResourceTypeSelectorProps {
  value: ResourceType;
  onChange: (type: ResourceType) => void;
}

const TYPES: { id: ResourceType; label: string }[] = [
  { id: 'link', label: 'Lien' },
  { id: 'document', label: 'Document' },
  { id: 'contact', label: 'Contact' },
  { id: 'event', label: 'Événement' },
  { id: 'note', label: 'Note' },
];

export function ResourceTypeSelector({ value, onChange }: ResourceTypeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TYPES.map((type) => (
        <button
          key={type.id}
          type="button"
          onClick={() => onChange(type.id)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-colors border
            ${
              value === type.id
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'bg-[var(--color-background)] text-[var(--color-text)] border-transparent hover:bg-[var(--color-border)]'
            }
          `}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}
