#  Gestionnaire de Ressources

> Une application intuitive pour centraliser, organiser et gérer vos liens, contacts, documents, événements et notes.

## Maquette & Design

Le design de l'application a été réalisé sur Figma. Il met l'accent sur la lisibilité, la simplicité d'utilisation et une organisation visuelle par cartes.

Vous pouvez consulter le prototype interactif et les détails du design ici :

> **[\[🔗 Maquette Figma\]](https://www.figma.com/make/nTzCyX3UGltdqcLnoHIrbv/Interface-Mes-Op%C3%A9rations---Dashboard-Gestionnaire-de-Flotte--Community-?t=RvK9ZATWcBqc7cwb-20&fullscreen=1)**

---

## Fonctionnalités

L'application couvre l'ensemble du cycle de vie des ressources (CRUD) avec une interface utilisateur fluide.

### 1. Tableau de Bord (Dashboard)
Le hub central de l'application. Il permet d'avoir une vue d'ensemble immédiate.
* **Statistiques :** Compteurs visuels pour chaque type de ressource.
* **Filtrage intelligent :** Navigation rapide entre les types (Liens, Documents, Contacts, etc.).
* **Liste des cartes :** Aperçu des ressources avec leurs tags et catégories.


### 2. Ajouter une Ressource
Un formulaire dynamique pour la création de contenu.
* **Types multiples :** Support pour Lien, Document, Contact, Événement, Note.
* **Organisation :** Champs pour le titre, la description, la catégorie et un système de tags dynamiques.


### 3. Détails de la Ressource
Une vue dédiée pour consulter les informations complètes sans distraction.
* **Header coloré :** Identification rapide du type de ressource.
* **Actions :** Accès direct au lien externe (si applicable).
* **Métadonnées :** Affichage des dates de création et de modification.

### 4. Modification
Mise à jour facile des informations existantes.
* Les champs sont pré-remplis avec les données actuelles pour une édition rapide.

### 5. Suppression Sécurisée
Gestion de la suppression avec une confirmation pour éviter les erreurs.
* **Modal d'avertissement :** Demande de confirmation explicite avant toute suppression irréversible.