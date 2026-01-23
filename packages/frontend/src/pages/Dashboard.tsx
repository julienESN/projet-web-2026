import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ArrowUpDown } from 'lucide-react';
import type { ResourceType } from 'contracts';
import { Button } from '../components/ui';
import { ResourceFilters } from '../components/resources/ResourceFilters';
import { ResourceStats } from '../components/resources/ResourceStats';
import { ResourceList } from '../components/resources/ResourceList';
import { useResources } from '../hooks';

type SortOption = 'date-desc' | 'date-asc' | 'title-asc';

export function Dashboard() {
  const navigate = useNavigate();
  const { resources, isLoading, error, deleteResource } = useResources();
  const [filter, setFilter] = useState<ResourceType | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  const counts = useMemo(() => {
    const initialCounts = {
      all: 0,
      link: 0,
      document: 0,
      contact: 0,
      event: 0,
      note: 0,
    };

    return resources.reduce((acc, res) => {
      acc.all++;
      acc[res.type]++;
      return acc;
    }, initialCounts);
  }, [resources]);

  const filteredResources = useMemo(() => {
    if (filter === 'all') return resources;
    return resources.filter((r) => r.type === filter);
  }, [resources, filter]);

  const sortedResources = useMemo(() => {
    return [...filteredResources].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [filteredResources, sortBy]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) {
      await deleteResource(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">
            Gestionnaire de Ressources
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Organisez vos liens, contacts, documents et plus
          </p>
        </div>
        <Link to="/resources/new">
          <Button variant="primary" className="gap-2">
            <Plus size={20} />
            Nouvelle Ressource
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] border border-[var(--color-error)]/20">
          {error}
        </div>
      )}

      {/* Filters & Stats */}
      <div className="space-y-6">
        <ResourceFilters currentFilter={filter} onFilterChange={setFilter} counts={counts} />

        <ResourceStats counts={counts} />
      </div>

      {/* Sorting & List */}
      <div className="space-y-4">
        <div className="flex justify-end">
          <div className="relative inline-flex items-center">
            <ArrowUpDown
              size={16}
              className="absolute left-3 text-[var(--color-text-muted)] pointer-events-none"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block w-full pl-9 p-2.5 outline-none cursor-pointer"
            >
              <option value="date-desc">Plus récent</option>
              <option value="date-asc">Plus ancien</option>
              <option value="title-asc">Titre (A-Z)</option>
            </select>
          </div>
        </div>

        <ResourceList
          resources={sortedResources}
          onView={(id) => {
            const resource = resources.find((r) => r.id === id);
            if (resource?.type === 'link' && resource.content.url) {
              window.open(resource.content.url as string, '_blank');
            } else {
              // For other types, maybe alert or navigate to detail?
              // Mockup just says "Voir".
              alert(`Voir la ressource : ${resource?.title}`);
            }
          }}
          onEdit={(id) => navigate(`/resources/${id}/edit`)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
