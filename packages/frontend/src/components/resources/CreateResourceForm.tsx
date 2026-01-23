import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ResourceResponse, ResourceType } from 'contracts';
import { ResourceTypeSelector } from './ResourceTypeSelector';
import { TagInput } from './TagInput';
import { Button, Input, Card, CardBody } from '../ui';
import { useResources } from '../../hooks';

// Helper types for dynamic content
interface ContentFields {
  url?: string; // link
  filePath?: string; // document
  mimeType?: string; // document
  email?: string; // contact
  phone?: string; // contact
  company?: string; // contact
  eventDate?: string; // event
  location?: string; // event
  content?: string; // note
}

interface CreateResourceFormProps {
  initialData?: ResourceResponse;
  isEditing?: boolean;
}

export function CreateResourceForm({ initialData, isEditing = false }: CreateResourceFormProps) {
  const navigate = useNavigate();
  const { createResource, updateResource, uploadFile } = useResources();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State initialized from initialData or defaults
  const [type, setType] = useState<ResourceType>(initialData?.type || 'link');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category?.name || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags.map((t) => t.name) || []);

  // Dynamic Content State
  const [contentFields, setContentFields] = useState<ContentFields>(() => {
    if (!initialData) return {};
    const c = initialData.content as Record<string, string>;
    return {
      url: c.url,
      filePath: c.filePath,
      email: c.email,
      phone: c.phone,
      company: c.company,
      eventDate: c.eventDate,
      location: c.location,
      content: c.content,
    };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Build specific content payload based on type
      let contentPayload: Record<string, unknown> = {};

      switch (type) {
        case 'link':
          contentPayload = { url: contentFields.url };
          break;
        case 'note':
          contentPayload = { content: contentFields.content };
          break;
        case 'contact':
          contentPayload = {
            email: contentFields.email,
            phone: contentFields.phone,
            company: contentFields.company,
          };
          break;
        case 'event':
          contentPayload = {
            eventDate: contentFields.eventDate,
            location: contentFields.location,
          };
          break;
        case 'document':
          let docData: Record<string, unknown> = {
            filePath: contentFields.filePath,
            mimeType: contentFields.mimeType || 'application/octet-stream',
          };

          if (selectedFile) {
            const uploaded = await uploadFile(selectedFile);
            docData = {
              fileId: uploaded.id,
              fileName: uploaded.filename,
              mimeType: uploaded.mimeType,
              filePath: uploaded.url,
            };
          } else if (!isEditing) {
            // Force file selection for new resources if we don't allow manual path
            if (!contentFields.filePath) {
              throw new Error('Veuillez sélectionner un fichier');
            }
            // Fallback for manual entry test
            docData.mimeType = 'application/pdf';
          } else {
            // Editing without new file - preserve existing data
            const c = initialData?.content as any;
            if (c) {
              docData = {
                ...docData,
                mimeType: c.mimeType,
                fileId: c.fileId,
                fileName: c.fileName,
              };
            }
          }

          contentPayload = docData;
          break;
      }

      const payload = {
        title,
        description: description || undefined,
        content: contentPayload,
        // Mock category/tags logic for update/create consistency
      };

      if (isEditing && initialData) {
        await updateResource(initialData.id, payload);
      } else {
        await createResource({
          ...payload,
          type,
        });
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de l'enregistrement. Vérifiez les champs obligatoires.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardBody className="p-8">
        <h2 className="text-xl font-bold mb-6 text-[var(--color-text)]">
          {isEditing ? 'Modifier la ressource' : 'Nouvelle ressource'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] mb-4">
              {error}
            </div>
          )}

          {/* Type Selector - Disabled if editing (usually type doesn't change) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-text)]">
              Type de ressource <span className="text-[var(--color-error)]">*</span>
            </label>
            {isEditing ? (
              <div className="px-4 py-2 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-muted)] capitalize">
                {type}
              </div>
            ) : (
              <ResourceTypeSelector value={type} onChange={setType} />
            )}
          </div>

          {/* Common Fields */}
          <Input
            label="Titre"
            required
            placeholder="Entrez un titre pour votre ressource"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--color-text)]">Description</label>
            <textarea
              className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              placeholder="Ajoutez une description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Dynamic Content Fields */}
          <div className="p-4 bg-[var(--color-background)] rounded-lg space-y-4 border border-[var(--color-border)]">
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              Détails {type === 'link' ? 'du lien' : type === 'event' ? "de l'événement" : type}
            </h3>

            {type === 'link' && (
              <Input
                label="URL"
                required
                placeholder="https://exemple.com"
                value={contentFields.url || ''}
                onChange={(e) => setContentFields({ ...contentFields, url: e.target.value })}
              />
            )}

            {type === 'note' && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]">
                  Contenu <span className="text-[var(--color-error)]">*</span>
                </label>
                <textarea
                  required
                  className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] min-h-[150px] resize-y focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  placeholder="Contenu de votre note..."
                  value={contentFields.content || ''}
                  onChange={(e) => setContentFields({ ...contentFields, content: e.target.value })}
                />
              </div>
            )}

            {type === 'contact' && (
              <>
                <Input
                  label="Email"
                  type="email"
                  placeholder="contact@exemple.com"
                  value={contentFields.email || ''}
                  onChange={(e) => setContentFields({ ...contentFields, email: e.target.value })}
                />
                <Input
                  label="Téléphone"
                  placeholder="+33 6..."
                  value={contentFields.phone || ''}
                  onChange={(e) => setContentFields({ ...contentFields, phone: e.target.value })}
                />
                <Input
                  label="Entreprise"
                  placeholder="Nom de l'entreprise"
                  value={contentFields.company || ''}
                  onChange={(e) => setContentFields({ ...contentFields, company: e.target.value })}
                />
              </>
            )}

            {type === 'event' && (
              <>
                <Input
                  label="Date"
                  type="datetime-local"
                  required
                  value={contentFields.eventDate || ''}
                  onChange={(e) =>
                    setContentFields({ ...contentFields, eventDate: e.target.value })
                  }
                />
                <Input
                  label="Lieu"
                  placeholder="Adresse ou lien visio"
                  value={contentFields.location || ''}
                  onChange={(e) => setContentFields({ ...contentFields, location: e.target.value })}
                />
              </>
            )}

            {type === 'document' && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]">
                  Fichier{' '}
                  {!isEditing && !contentFields.filePath && (
                    <span className="text-[var(--color-error)]">*</span>
                  )}
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    className="block w-full text-sm text-[var(--color-text)]
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-[var(--color-primary)] file:text-white
                      hover:file:bg-[var(--color-primary-dark)]
                      cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        setContentFields({
                          ...contentFields,
                          filePath: file.name,
                        });
                      }
                    }}
                  />
                  {contentFields.filePath && (
                    <div className="text-sm text-[var(--color-text-muted)]">
                      {selectedFile ? (
                        <span>Sélectionné: {selectedFile.name}</span>
                      ) : (
                        <span>Fichier actuel: {contentFields.filePath}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tags & Category */}
          <Input
            label="Catégorie"
            placeholder="Ex: Professionnel, Personnel, Urgent..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-text)]">Tags</label>
            <TagInput tags={tags} onChange={setTags} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-border)]">
            <Button type="submit" variant="primary" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer la ressource'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="px-8"
              onClick={() => navigate('/dashboard')}
              disabled={isLoading}
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
