import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import type { ResourceType } from 'contracts';
import { Button } from '../components/ui';
import { ResourceFilters } from '../components/resources/ResourceFilters';
import { ResourceStats } from '../components/resources/ResourceStats';
import { ResourceList } from '../components/resources/ResourceList';
import { useResources } from '../hooks';

export function Dashboard() {
  const navigate = useNavigate();
  const { resources, isLoading, error, deleteResource } = useResources();
  const [filter, setFilter] = useState<ResourceType | 'all'>('all');

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
        <ResourceFilters 
          currentFilter={filter} 
          onFilterChange={setFilter} 
          counts={counts} 
        />
        
        <ResourceStats counts={counts} />
      </div>

      {/* List */}
      <ResourceList 
        resources={filteredResources} 
        onView={(id) => {
          const resource = resources.find(r => r.id === id);
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
  );
}
