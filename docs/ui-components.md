# Organisation des Composants UI

> **Issue #26** - Jour 2 : Documentation de l'architecture frontend

Ce document définit l'organisation des composants UI pour l'application Resource Manager, basé sur la [maquette Figma](https://www.figma.com/make/nTzCyX3UGltdqcLnoHIrbv/Interface-Mes-Op%C3%A9rations---Dashboard-Gestionnaire-de-Flotte--Community-).

---

## Structure des Dossiers

```
src/
├── components/
│   ├── ui/                    # Composants réutilisables (Design System)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Tabs.tsx
│   │   └── index.ts
│   │
│   ├── layout/                # Composants de mise en page
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Layout.tsx
│   │   └── index.ts
│   │
│   └── resources/             # Composants métier (ressources)
│       ├── ResourceCard.tsx
│       ├── ResourceForm.tsx
│       ├── ResourceList.tsx
│       ├── ResourceFilters.tsx
│       ├── ResourceStats.tsx
│       └── index.ts
│
├── pages/                     # Pages de l'application
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ResourceDetail.tsx
│   └── NotFound.tsx
│
├── hooks/                     # Hooks personnalisés
│   ├── useAuth.ts
│   ├── useResources.ts
│   ├── useCategories.ts
│   └── useTags.ts
│
├── lib/                       # Utilitaires
│   ├── api.ts                 # Client API (fetch wrapper)
│   ├── utils.ts               # Fonctions utilitaires
│   └── constants.ts           # Constantes
│
├── types/                     # Types TypeScript
│   └── index.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## Composants UI (Design System)

Basé sur la maquette Figma, voici les composants du design system à créer :

### Button

| Variante | Usage |
|----------|-------|
| `primary` | Actions principales (Nouvelle Ressource, Sauvegarder) |
| `secondary` | Actions secondaires (Annuler) |
| `danger` | Actions destructives (Supprimer) |
| `ghost` | Actions subtiles (icônes) |

```tsx
<Button variant="primary" size="md">Nouvelle Ressource</Button>
```

### Card

Carte pour afficher une ressource avec :
- Header avec icône du type
- Titre et description
- Tags (badges)
- Actions (Voir, Modifier, Supprimer)

### Badge

Pour les tags et catégories :
- Couleurs personnalisables
- Tailles : `sm`, `md`

### Tabs

Filtres par type de ressource :
- Toutes, Liens, Documents, Contacts, Événements, Notes

### Modal

Pour la confirmation de suppression et les formulaires.

### Input

Champs de formulaire avec support :
- Label
- Placeholder
- Validation avec erreurs
- Types : text, email, password, textarea

---

## Composants Métier

### ResourceCard

Affiche une ressource sous forme de carte.

**Props :**
```tsx
interface ResourceCardProps {
  id: string;
  title: string;
  description?: string;
  type: 'link' | 'document' | 'contact' | 'event' | 'note';
  category?: { name: string; color: string };
  tags: { id: string; name: string }[];
  isFavorite: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}
```

### ResourceStats

Compteurs visuels par type de ressource (voir Dashboard).

**Props :**
```tsx
interface ResourceStatsProps {
  counts: {
    link: number;
    document: number;
    contact: number;
    event: number;
    note: number;
  };
}
```

### ResourceFilters

Barre de filtres avec :
- Tabs par type
- Recherche par texte
- Filtre par catégorie
- Filtre par tags

### ResourceForm

Formulaire dynamique pour créer/éditer une ressource.

---

## Design Tokens (Couleurs)

Basé sur la maquette Figma :

```css
:root {
  /* Primary */
  --color-primary: #3B82F6;        /* Bleu principal */
  --color-primary-hover: #2563EB;
  
  /* Types de ressources */
  --color-link: #3B82F6;           /* Bleu */
  --color-document: #EF4444;       /* Rouge */
  --color-contact: #F59E0B;        /* Orange */
  --color-event: #8B5CF6;          /* Violet */
  --color-note: #10B981;           /* Vert */
  
  /* Neutres */
  --color-background: #F9FAFB;
  --color-surface: #FFFFFF;
  --color-border: #E5E7EB;
  --color-text: #111827;
  --color-text-muted: #6B7280;
  
  /* Feedback */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
}
```

---

## Conventions de Nommage

| Type | Convention | Exemple |
|------|------------|---------|
| Composants | PascalCase | `ResourceCard.tsx` |
| Hooks | camelCase avec `use` | `useResources.ts` |
| Utils | camelCase | `formatDate.ts` |
| Types | PascalCase | `Resource`, `User` |
| CSS classes | kebab-case | `resource-card` |

---