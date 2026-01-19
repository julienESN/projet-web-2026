# Projet 3 : Application de Gestion de Ressources Personnelles

Bienvenue sur le dépôt de notre projet web 2026. Cette application a pour but de centraliser, organiser et retrouver facilement tous types de ressources importantes : documents, liens web, contacts, événements et notes.

## 👥 L'Équipe

*   **Clément Suire** - [@cleluke](https://github.com/cleluke)
*   **Sofiane Fares** - [@FaresSofiane](https://github.com/FaresSofiane)
*   **Galaad Filâtre** - [@Ga1aad](https://github.com/Ga1aad)
*   **Julien Esnault** - [julienESN](https://github.com/julienESN)

## 🎯 Le Projet

**Resource Manager** est une application web flexible permettant d'améliorer la productivité en regroupant des informations hétérogènes.

### Fonctionnalités MVP (Minimum Viable Product)
*   **Authentification** : Inscription et connexion sécurisée.
*   **Gestion des Ressources** : Création, lecture, modification et suppression (CRUD) de Liens, Documents, Contacts, Événements et Notes.
*   **Catégorisation** : Organisation par catégories personnalisables et système de tags multiples.
*   **Recherche** : Filtrage par type, catégorie, tags et recherche textuelle.

### Fonctionnalités Avancées (Objectifs)
*   Upload de fichiers.
*   Gestion des favoris et collections.
*   Vue Calendrier pour les événements.
*   Partage de ressources.

## 🛠 Stack Technique (Recommandée)

*   **Frontend** : [React](https://react.dev/), [Vite](https://vitejs.dev/)
*   **Backend** : [Node.js](https://nodejs.org/),
*   **Base de Données** : [PostgreSQL](https://www.postgresql.org/)
*   **DevOps** : [Docker](https://www.docker.com/), [GitHub Actions](https://github.com/features/actions)

## 📅 Planning (5 Jours)

| Jour | Matin (9h10 - 12h40) | Après-midi (13h40 - 17h10) |
| :--- | :--- | :--- |
| **J1** | Formation des groupes, Setup Git, Choix du projet. | Planification, GitHub Projects, README, Premier commit. |
| **J2** | Conception (API, BDD, UI/UX). | Introduction à Docker, Dockerfile, docker-compose. |
| **J3** | Dev Backend (API init) & Frontend (Setup). | Dev fonctionnalités principales, Premières PRs. |
| **J4** | Fonctionnalités avancées, Tests unitaires. | Mise en place CI/CD (GitHub Actions), Linting. |
| **J5** | Tests finaux, Optimisation, Documentation. | Soutenance et Démonstration. |

## 🚀 Installation et Démarrage

### Pré-requis
*   Docker & Docker Compose
*   Node.js (pour le développement local hors conteneur)

### Lancer le projet

```bash
# Cloner le dépôt
git clone https://github.com/julienESN/projet-web-2026.git
cd projet-web-2026

# Lancer l'environnement avec Docker (à venir)
docker-compose up
```

## 🤝 Bonnes Pratiques de Collaboration

### Git Workflow
Nous utilisons le **Feature Branch Workflow**.
1.  Créez une branche pour chaque tâche : `git checkout -b feature/ma-tache`
2.  Commitez souvent : `git commit -m "feat: ajout de la navbar"`
3.  Poussez et ouvrez une Pull Request (PR).
4.  Attendez la validation d'un pair avant de merger.

### Conventions de Commit
Utilisez des messages clairs suivant la convention :
*   `feat:` Nouvelle fonctionnalité
*   `fix:` Correction de bug
*   `docs:` Documentation
*   `style:` Formatage, CSS
*   `refactor:` Nettoyage de code
*   `chore:` Maintenance, config

---
*Projet réalisé dans le cadre du cours de Projet Web 2026.*