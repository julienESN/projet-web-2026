# Spécifications du Projet : Resource Manager

**Projet 3 : Application de gestion de ressources personnelles (Version 2.0)**

## 1. Description Générale
Ce projet consiste à développer une application web de gestion de ressources personnelles et professionnelles permettant aux utilisateurs de centraliser, organiser et retrouver facilement tous types de ressources importantes : documents, liens web, contacts, événements, notes, et bien plus. L’application offrira un système flexible de catégorisation et de recherche pour améliorer la productivité au quotidien.

### 1.1 Contexte
À l’ère du numérique, nous accumulons une grande quantité d’informations dispersées : signets web, documents importants, contacts professionnels, notes diverses. Votre application permettra de centraliser toutes ces ressources dans un seul endroit organisé, facilitant leur gestion et leur récupération rapide.

## 2. Objectifs Pédagogiques
À travers ce projet, vous allez :
*   Concevoir une application web avec gestion de contenus hétérogènes.
*   Implémenter un système flexible de catégorisation (types, catégories, tags).
*   Gérer l’upload et le stockage de fichiers.
*   Créer un moteur de recherche et de filtrage efficace.
*   Développer une interface utilisateur intuitive et adaptative.
*   Travailler avec des relations many-to-many (tags).
*   Mettre en place Docker et CI/CD.
*   Utiliser Git et GitHub de manière professionnelle.

## 3. MVP - Fonctionnalités Minimales (Obligatoires)
Le MVP (Minimum Viable Product) représente les fonctionnalités essentielles qui doivent obligatoirement être implémentées.

### 3.1 Gestion des utilisateurs
*   **Inscription et connexion** : Authentification sécurisée.
*   **Profil utilisateur** : Affichage et modification des informations.

### 3.2 Gestion des ressources (CRUD complet)
*   **Créer une ressource** avec :
    *   **Type** : Lien, Document, Contact, Événement, Note.
    *   **Titre** (obligatoire).
    *   **Description/Contenu**.
    *   **URL** (pour les liens).
    *   **Date** (pour les événements).
    *   **Informations de contact** (pour les contacts).
    *   **Catégorie personnalisée**.
    *   **Tags multiples**.
*   **Lire/Afficher** :
    *   Liste de toutes les ressources.
    *   Vue détaillée d’une ressource.
    *   Groupement par type.
*   **Modifier** : Éditer toutes les informations d’une ressource.
*   **Supprimer** : Supprimer une ressource avec confirmation.

### 3.3 Système de catégorisation
*   **Types prédéfinis** : Lien, Document, Contact, Événement, Note.
*   **Catégories personnalisables** :
    *   Créer ses propres catégories (ex : "Travail", "Personnel", "Formation").
    *   Assigner une catégorie à une ressource.
*   **Tags** :
    *   Créer des tags.
    *   Assigner plusieurs tags à une ressource.
    *   Autocomplete lors de l’ajout de tags.

### 3.4 Recherche et filtrage
*   **Recherche simple** : Par titre ou description.
*   **Filtres** :
    *   Par type de ressource.
    *   Par catégorie.
    *   Par tag (un ou plusieurs).
    *   Par date de création.
*   **Tri** :
    *   Par date de création (plus récent / plus ancien).
    *   Par titre (alphabétique).

### 3.5 Interface utilisateur
*   **Dashboard** : Vue d’ensemble des ressources.
*   **Navigation intuitive** : Accès facile aux différents types.
*   **Responsive** : Adapté mobile, tablette, desktop.
*   **Feedback visuel** : Messages de succès/erreur clairs.

## 4. Fonctionnalités Avancées (Optionnelles)
Ces fonctionnalités permettront d’obtenir une meilleure note. Implémentez-les après avoir terminé le MVP.

### 4.1 Niveau 1 - Fonctionnalités intermédiaires
*   **Upload de fichiers** :
    *   Téléverser des documents (PDF, images, etc.).
    *   Stocker les fichiers sur le serveur (limite 5 MB).
    *   Télécharger les fichiers.
*   **Favoris** : Marquer une ressource comme favori.
*   **Collections/Dossiers** : Regrouper des ressources.
*   **Vue Calendrier** : Afficher les événements.
*   **Statistiques de base**.

### 4.2 Niveau 2 - Fonctionnalités avancées
*   Partage de ressources.
*   Notifications et rappels (Email).
*   Export de données (JSON/CSV).
*   Recherche avancée (Plein texte, Date range).
*   Aperçu de liens (Open Graph).

### 4.3 Niveau 3 - Fonctionnalités expertes
*   Versionnage de fichiers.
*   PWA (Progressive Web App).
*   Import de données.
*   API publique.
*   Reconnaissance de contenu (OCR PDF).

## 5. User Stories

### 5.1 En tant qu’utilisateur
1.  Je veux sauvegarder des liens intéressants pour les retrouver facilement plus tard.
2.  Je veux organiser mes ressources par catégories (Travail, Personnel, Loisirs).
3.  Je veux ajouter des tags à mes ressources pour des classifications transversales.
4.  Je veux rechercher rapidement une ressource par mot-clé.
5.  Je veux filtrer mes ressources par type.
6.  Je veux sauvegarder des contacts professionnels.
7.  Je veux créer des événements avec dates.
8.  Je veux sauvegarder des documents de recherche.

## 7. Spécifications Techniques

### 7.1 Architecture Recommandée
*   **Backend** : Node.js + Express.js (Multer pour upload).
*   **Frontend** : React.js + Vite + Tailwind CSS.
*   **Base de données** : PostgreSQL (Relationnelle recommandée pour les tags).

### 7.2 Modèle de Données Suggéré

#### Table : Users
*   `id`: UUID (PK)
*   `email`: String (unique)
*   `password`: String (hashé)
*   `name`: String

#### Table : Resources
*   `id`: UUID (PK)
*   `title`: String (required)
*   `description`: Text
*   `type`: Enum ['link', 'document', 'contact', 'event', 'note']
*   `content`: JSON (structure flexible selon le type)
*   `category_id`: FK (Categories)
*   `user_id`: FK (Users)
*   `is_favorite`: Boolean
*   `created_at`: DateTime

**Structure JSON `content` par type :**
*   *Link*: `{ "url": "..." }`
*   *Document*: `{ "file_path": "...", "mime_type": "..." }`
*   *Contact*: `{ "email": "...", "phone": "...", "company": "..." }`
*   *Event*: `{ "event_date": "...", "location": "..." }`
*   *Note*: `{ "content": "..." }`

#### Table : Categories
*   `id`: UUID (PK)
*   `name`: String
*   `user_id`: FK (Users)

#### Table : Tags
*   `id`: UUID (PK)
*   `name`: String
*   `user_id`: FK (Users)

#### Table : ResourceTags (Liaison)
*   `resource_id`: FK (Resources)
*   `tag_id`: FK (Tags)

### 7.3 Routes API Suggérées

#### Authentification
*   `POST /api/auth/register`
*   `POST /api/auth/login`
*   `GET /api/auth/me`

#### Ressources
*   `GET /api/resources` (avec filtres query params)
*   `POST /api/resources`
*   `GET /api/resources/:id`
*   `PUT /api/resources/:id`
*   `DELETE /api/resources/:id`

#### Catégories & Tags
*   `GET /api/categories`
*   `POST /api/categories`
*   `GET /api/tags`
*   `POST /api/tags`

## 8. Contraintes et Exigences
*   Application conteneurisée avec **Docker**.
*   Pipeline CI/CD avec **GitHub Actions**.
*   Linting du code.
*   Authentification sécurisée.
*   Validation des uploads et entrées utilisateurs.
