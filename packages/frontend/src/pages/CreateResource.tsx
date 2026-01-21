import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CreateResourceForm } from '../components/resources/CreateResourceForm';

export function CreateResource() {
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
        {/* Mockup shows a preview/icon on the left but for simplicity we focus on the form first or hide it on mobile */}
        
        <div className="flex-1">
          <CreateResourceForm />
        </div>
      </div>
    </div>
  );
}
