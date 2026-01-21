import { Button, Badge, Card, CardBody } from '../components/ui';

export function Home() {
  const resourceTypes = [
    { name: 'Liens', color: 'var(--color-link)' },
    { name: 'Documents', color: 'var(--color-document)' },
    { name: 'Contacts', color: 'var(--color-contact)' },
    { name: 'Événements', color: 'var(--color-event)' },
    { name: 'Notes', color: 'var(--color-note)' },
  ] as const;

  const features = [
    {
      title: 'Tout centraliser',
      description: 'Réunissez vos liens, documents, contacts, événements et notes dans un seul espace.',
    },
    {
      title: 'Organiser simplement',
      description: 'Catégories, tags et favoris pour retrouver vos ressources en un instant.',
    },
    {
      title: 'Accès rapide',
      description: 'Tableau de bord clair et filtres intelligents pour une navigation fluide.',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl md:text-6xl">
          Gestionnaire de
          <span className="text-[var(--color-primary)]"> Ressources</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-text-muted)]">
          Une application intuitive pour centraliser, organiser et gérer vos liens, contacts,
          documents, événements et notes.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {resourceTypes.map(({ name, color }) => (
            <Badge key={name} size="md" color={color}>
              {name}
            </Badge>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="lg">
            Commencer
          </Button>
          <Button variant="secondary" size="lg">
            En savoir plus
          </Button>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold text-[var(--color-text)] text-center mb-10">
          Pourquoi Resource Manager ?
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description }) => (
            <Card key={title}>
              <CardBody>
                <h3 className="font-semibold text-[var(--color-text)]">{title}</h3>
                <p className="mt-2 text-[var(--color-text-muted)]">{description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
