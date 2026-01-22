import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CreateResourceForm } from '../components/resources/CreateResourceForm';
import { useResources } from '../hooks';
import type { ResourceResponse } from 'contracts';

export function EditResource() {
  const { id } = useParams<{ id: string }>();
  const { resources, fetchResources, isLoading } = useResources();
  const [resource, setResource] = useState<ResourceResponse | null>(null);

  useEffect(() => {
    // If resources are already loaded, find logic. If not or direct access, logic might be safer.
    // useResources fetches on mount, so resources might be populated or loading.
    // Better way: if resources is empty, fetch.
    if (resources.length === 0) {
      fetchResources();
    }
  }, [fetchResources, resources.length]);

  useEffect(() => {
    if (id && resources.length > 0) {
      const found = resources.find((r) => r.id === id);
      if (found) {
        setResource(found);
      }
    }
  }, [id, resources]);

  if (isLoading && !resource) {
     return (
       <div className="flex items-center justify-center min-h-[60vh]">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
       </div>
     );
  }

  if (!resource && !isLoading && resources.length > 0) {
      return (
        <div className="mx-auto max-w-3xl px-4 py-8 text-center">
            <p className="text-red-500">Ressource introuvable.</p>
            <Link to="/dashboard" className="text-blue-500 hover:underline">Retour au tableau de bord</Link>
        </div>
      )
  }

  // Waiting for load
  if (!resource) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <Link 
        to="/dashboard" 
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:underline"
      >
        <ArrowLeft size={16} />
        Retour à la liste
      </Link>

      <div className="flex gap-8 items-start">
        <div className="flex-1">
          <CreateResourceForm initialData={resource} isEditing={true} />
        </div>
      </div>
    </div>
  );
}
