import { useState, type KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { Button, Input } from '../ui';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ajoutez un tag et appuyez sur Entrée"
          />
        </div>
        <Button 
          type="button" 
          onClick={addTag}
          className="gap-2 shrink-0"
          disabled={!inputValue.trim()}
        >
          <Plus size={18} />
          Ajouter
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-background)] rounded-full text-sm text-[var(--color-text)] border border-[var(--color-border)]"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-error)]"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
