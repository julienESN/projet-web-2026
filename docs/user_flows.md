# Définition du Parcours Utilisateur (User Flow)

## 1. Qu'est-ce qu'un User Flow ?

Un **User Flow** (ou parcours utilisateur) est une représentation visuelle du chemin qu'un utilisateur emprunte à travers une application pour accomplir une tâche spécifique. Il décrit la séquence d'écrans, d'actions et de décisions que l'utilisateur rencontre depuis un point d'entrée jusqu'à l'atteinte de son objectif.

### 1.1 Objectifs du User Flow

*   **Visualiser l'expérience utilisateur** : Comprendre le trajet d'un utilisateur.
*   **Identifier les points de friction** : Repérer où les utilisateurs pourraient abandonner ou se perdre.
*   **Optimiser la navigation** : Simplifier les étapes pour atteindre un objectif.
*   **Communiquer au sein de l'équipe** : Servir de référence pour les développeurs, designers et stakeholders.

### 1.2 Composants d'un User Flow

| Composant | Description |
|---|---|
| **Point d'entrée** | L'écran ou l'état initial de l'utilisateur (ex: page d'accueil, lien externe). |
| **Actions** | Les interactions de l'utilisateur (clics, saisies, scrolls). |
| **Décisions** | Les points où l'utilisateur ou le système fait un choix (ex: conditions). |
| **Écrans/Pages** | Les différentes vues de l'application. |
| **Point de sortie** | L'objectif final ou la tâche accomplie. |

---

## 2. User Flows pour Resource Manager

Voici les principaux parcours utilisateurs identifiés pour le MVP de l'application.

### 2.1 Flow 1 : Authentification (Inscription / Connexion)

Ce flow décrit le processus d'accès à l'application.

```mermaid
flowchart TD
    A[Page d'accueil] --> B{Utilisateur connecté ?}
    B -- Non --> C[Page de Connexion]
    C --> D{Compte existant ?}
    D -- Oui --> E[Saisir Email & Mot de passe]
    E --> F{Identifiants valides ?}
    F -- Oui --> G[Redirection vers Dashboard]
    F -- Non --> H[Afficher erreur] --> E
    D -- Non --> I[Aller vers Inscription]
    I --> J[Saisir Nom, Email, Mot de passe]
    J --> K{Données valides ?}
    K -- Oui --> L[Compte créé] --> G
    K -- Non --> M[Afficher erreurs de validation] --> J
    B -- Oui --> G
```

---

### 2.2 Flow 2 : Création d'une Ressource (Lien)

Ce flow décrit comment un utilisateur ajoute une nouvelle ressource de type "Lien".

```mermaid
flowchart TD
    A[Dashboard] --> B[Cliquer sur 'Ajouter Ressource']
    B --> C[Formulaire de création]
    C --> D[Sélectionner Type: Lien]
    D --> E[Remplir Titre & URL]
    E --> F[Optionnel: Ajouter Description]
    F --> G[Sélectionner ou Créer Catégorie]
    G --> H[Ajouter Tags via Autocomplete]
    H --> I[Cliquer sur 'Sauvegarder']
    I --> J{Validation OK ?}
    J -- Oui --> K[Ressource créée - Afficher succès]
    K --> L[Retour au Dashboard ou Détail]
    J -- Non --> M[Afficher erreurs] --> E
```

---

### 2.3 Flow 3 : Recherche et Filtrage

Ce flow décrit comment un utilisateur recherche et filtre ses ressources.

```mermaid
flowchart TD
    A[Dashboard - Liste des Ressources] --> B{Action ?}
    B -- Recherche --> C[Saisir mot-clé dans la barre de recherche]
    C --> D[Résultats filtrés par titre/description]
    B -- Filtrer par Type --> E[Sélectionner Type: Lien, Document, etc.]
    E --> D
    B -- Filtrer par Catégorie --> F[Sélectionner une Catégorie]
    F --> D
    B -- Filtrer par Tag --> G[Sélectionner un ou plusieurs Tags]
    G --> D
    D --> H{Ressource trouvée ?}
    H -- Oui --> I[Cliquer sur la ressource]
    I --> J[Vue détaillée de la ressource]
    H -- Non --> K[Afficher 'Aucun résultat']
    K --> L[Modifier les critères de recherche/filtre]
    L --> B
```

---

### 2.4 Flow 4 : Scénario Complet - Étudiant Organisant sa Recherche

Ce flow illustre le scénario d'utilisation décrit dans les spécifications (Section 6.1).

```mermaid
flowchart TD
    subgraph "Jour 1 : Sauvegarder un article"
        A1[Marc trouve un article sur l'IA] --> A2[Connexion à Resource Manager]
        A2 --> A3[Créer Ressource Type: Lien]
        A3 --> A4[Titre: 'Intro Réseaux de Neurones']
        A4 --> A5[Catégorie: 'Études']
        A5 --> A6[Tags: 'IA', 'Machine Learning', 'Cours']
        A6 --> A7[Sauvegarder]
    end

    subgraph "Plus tard : Ajouter un PDF"
        B1[Marc trouve un PDF sur le même sujet] --> B2[Créer Ressource Type: Document]
        B2 --> B3[Upload du fichier PDF]
        B3 --> B4[Réutiliser les mêmes Tags]
        B4 --> B5[Sauvegarder]
    end

    subgraph "Avant l'examen : Retrouver ses ressources"
        C1[Marc se prépare pour l'examen] --> C2[Aller au Dashboard]
        C2 --> C3[Filtrer par Tag: 'Machine Learning']
        C3 --> C4[Voir toutes les ressources liées]
        C4 --> C5[Réviser l'article et le PDF]
    end

    A7 --> B1
    B5 --> C1
```

---

## 3. Bonnes Pratiques pour les User Flows

1.  **Garder le flow simple** : Éviter de surcharger le diagramme avec trop de détails.
2.  **Se concentrer sur un seul objectif** : Un flow = une tâche à accomplir.
3.  **Inclure les cas d'erreur** : Prévoir les chemins alternatifs (échecs de validation, etc.).
4.  **Itérer** : Les flows évoluent avec le produit, les mettre à jour régulièrement.
