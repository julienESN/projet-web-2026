import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Link as LinkIcon,
  FileText,
  User,
  Calendar,
  StickyNote,
  ExternalLink,
  Clock,
  Folder,
  Download,
} from 'lucide-react';
import { Button, Badge, Card, CardBody } from '../components/ui';
import { api, ApiError } from '../lib/api';
import { ResourceResponseSchema } from 'contracts';
import type { ResourceResponse, ResourceType } from 'contracts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const RESOURCE_UI_CONFIG = {
  link: {
    icon: LinkIcon,
    label: 'Lien',
    color: 'var(--color-link)',
    bgColor: '#3B82F6', // Fallback for header bg
  },
  document: {
    icon: FileText,
    label: 'Document',
    color: 'var(--color-document)',
    bgColor: '#EF4444',
  },
  contact: {
    icon: User,
    label: 'Contact',
    color: 'var(--color-contact)',
    bgColor: '#F59E0B',
  },
  event: {
    icon: Calendar,
    label: 'Événement',
    color: 'var(--color-event)',
    bgColor: '#8B5CF6',
  },
  note: {
    icon: StickyNote,
    label: 'Note',
    color: 'var(--color-note)',
    bgColor: '#10B981',
  },
} as const;

import { useAuth } from '../contexts/AuthContext';

export function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [resource, setResource] = useState<ResourceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    async function fetchResource() {
      if (!id || !token) return;

      try {
        setIsLoading(true);
        // Using explicit casting or schema validation
        const data = await api.get(`/resources/${id}`, {
          schema: ResourceResponseSchema,
          token,
        });
        setResource(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Impossible de charger la ressource');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchResource();
  }, [id, token]);

  useEffect(() => {
    let objectUrl: string | null = null;
    let isActive = true;

    async function loadPreview() {
      const content = resource?.content as any;
      if (!resource || resource.type !== 'document' || !content?.fileId || !token) return;

      const mimeType = content.mimeType || '';
      // Support basic images and PDF
      if (!mimeType.startsWith('image/') && mimeType !== 'application/pdf') return;

      try {
        setIsPreviewLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/resources/files/${content.fileId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) throw new Error('Preview load failed');

        const blob = await response.blob();
        if (isActive) {
          objectUrl = window.URL.createObjectURL(blob);
          setPreviewUrl(objectUrl);
        }
      } catch (e) {
        console.error('Failed to load preview', e);
      } finally {
        if (isActive) setIsPreviewLoading(false);
      }
    }

    if (resource) {
      loadPreview();
    }

    return () => {
      isActive = false;
      if (objectUrl) window.URL.revokeObjectURL(objectUrl);
    };
  }, [resource, token]);

  const handleDelete = async () => {
    if (
      !resource ||
      !token ||
      !window.confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')
    )
      return;

    try {
      await api.delete(`/resources/${resource.id}`, { token });
      navigate('/dashboard');
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleDownload = async () => {
    const content = resource?.content as any;
    if (!content?.fileId && !content?.filePath) return;

    // Handle legacy mocks or external links
    if (content.filePath && !content.fileId) {
      window.open(content.filePath, '_blank');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/resources/files/${content.fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = content.fileName || 'document';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert('Erreur lors du téléchargement');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold text-[var(--color-error)] mb-4">
          {error || 'Ressource introuvable'}
        </h2>
        <Link to="/dashboard">
          <Button variant="secondary">Retour au tableau de bord</Button>
        </Link>
      </div>
    );
  }

  const uiConfig = RESOURCE_UI_CONFIG[resource.type as ResourceType] || RESOURCE_UI_CONFIG.link;
  const Icon = uiConfig.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:underline font-medium"
      >
        <ArrowLeft size={16} />
        Retour à la liste
      </Link>

      <Card className="overflow-hidden border-none shadow-lg">
        {/* Header */}
        <div
          className="p-8 text-white flex justify-between items-start"
          style={{ backgroundColor: uiConfig.bgColor }}
        >
          <div className="flex gap-6">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icon size={32} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                  {uiConfig.label}
                </span>
              </div>
              <h1 className="text-3xl font-bold">{resource.title}</h1>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-white/20 hover:bg-white/30 border-none text-white"
              onClick={() => navigate(`/resources/${resource.id}/edit`)}
            >
              <Edit2 size={18} />
            </Button>
            <Button
              size="sm"
              className="bg-white/20 hover:bg-white/30 border-none text-white"
              onClick={handleDelete}
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </div>

        {/* Body */}
        <CardBody className="p-8 space-y-8">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-[var(--color-border)]">
            {resource.category && (
              <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <Folder size={18} />
                <Badge
                  color={(resource.category.color as any) || undefined}
                  style={{
                    backgroundColor: `${resource.category.color}20`,
                    color: resource.category.color || undefined,
                  }}
                >
                  {resource.category.name}
                </Badge>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  className="bg-[var(--color-background)] text-[var(--color-primary)]"
                >
                  #{tag.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          {resource.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[var(--color-text)]">Description</h3>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                {resource.description}
              </p>
            </div>
          )}

          {/* Specific Content */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">
              {resource.type === 'link'
                ? 'Lien'
                : resource.type === 'note'
                  ? 'Note'
                  : resource.type === 'contact'
                    ? 'Informations de contact'
                    : resource.type === 'event'
                      ? "Détails de l'événement"
                      : 'Document'}
            </h3>

            <div className="bg-[var(--color-background)] p-4 rounded-lg border border-[var(--color-border)]">
              {resource.type === 'link' && 'url' in (resource.content as any) && (
                <a
                  href={(resource.content as any).url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[var(--color-primary)] hover:underline break-all"
                >
                  <ExternalLink size={18} />
                  {(resource.content as any).url as string}
                </a>
              )}

              {resource.type === 'note' && 'content' in (resource.content as any) && (
                <p className="whitespace-pre-wrap text-[var(--color-text)]">
                  {(resource.content as any).content}
                </p>
              )}

              {resource.type === 'document' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 p-2 bg-[var(--color-surface)] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg">
                        <FileText size={24} />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-text)]">
                          {(resource.content as any).fileName || 'Document'}
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {(resource.content as any).mimeType || 'Fichier'}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleDownload}
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <Download size={16} />
                      Télécharger
                    </Button>
                  </div>

                  {isPreviewLoading && (
                    <div className="flex justify-center p-8 bg-[var(--color-surface)] rounded-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
                    </div>
                  )}

                  {previewUrl && (resource.content as any).mimeType?.startsWith('image/') && (
                    <div className="rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] flex justify-center p-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-[600px] object-contain"
                      />
                    </div>
                  )}

                  {previewUrl && (resource.content as any).mimeType === 'application/pdf' && (
                    <div className="rounded-lg overflow-hidden border border-[var(--color-border)] aspect-[3/4] max-h-[800px]">
                      <iframe src={previewUrl} className="w-full h-full" title="PDF Preview" />
                    </div>
                  )}
                </div>
              )}

              {/* Add other types as needed */}
              {resource.type !== 'link' &&
                resource.type !== 'note' &&
                resource.type !== 'document' && (
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(resource.content, null, 2)}
                  </pre>
                )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-6 border-t border-[var(--color-border)] flex flex-wrap gap-8 text-sm text-[var(--color-text-muted)]">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>
                Créé le {format(new Date(resource.createdAt), 'd MMMM yyyy à H:mm', { locale: fr })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>
                Modifié le{' '}
                {format(new Date(resource.updatedAt), 'd MMMM yyyy à H:mm', { locale: fr })}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
