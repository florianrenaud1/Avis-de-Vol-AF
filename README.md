# Avis de Vol - Air France

## Description du Projet

Bienvenue sur **Avis de Vol**, une application web dédiée aux retours d’expérience passagers sur les vols **Air France**.  
Elle est construite avec **Angular 19** pour le frontend et **Spring Boot 3.5.3** pour le backend.

L’objectif : permettre à chacun de **consulter, publier et modérer des avis de vol**, dans une interface fluide, sécurisée et multilingue.

Lien pour récupérer la vidéo de présentation du projet : https://1drv.ms/v/s!AoIIyp97mpwHhx42kMisGVejiOzZ?e=5IgJaK

---

## Fonctionnalités Principales

- Création d’avis avec note et commentaire
- Consultation d’avis avec filtres, tri et pagination
- Espace admin pour la modération (statuts, suppression…)
- Multilingue (Français 🇫🇷 / Anglais 🇬🇧)
- Responsive design avec Angular Material et Tailwind CSS
- Authentification JWT avec gestion des rôles (admin/utilisateur)

---

## Architecture Technique

### Structure du Projet

Avis-de-Vol-AF/
├── avisdevol-ss/ # Backend Spring Boot
│ ├── src/main/java/
│ │ ├── business/ # Logique métier
│ │ ├── dao/ # Accès aux données
│ │ ├── rest/ # Contrôleurs REST
│ │ └── config/ # Configuration
│ └── src/main/resources/
├── avisdevol-cs/ # Frontend Angular
│ ├── src/app/
│ │ ├── core/ # Services globaux
│ │ ├── features/ # Modules fonctionnels (auth, rating…)
│ │ └── shared/ # Composants & services réutilisables
│ └── e2e/ # Tests end-to-end
└── scripts/ # Scripts de BDD

---

---

## Modélisation des Données

### Entités principales

1. `RatingEntity` – Représente un avis
2. `AirlineEntity` – Compagnie aérienne
3. `AccountEntity` – Utilisateur ou administrateur

### Choix d’implémentation

- Identifiants via séquences PostgreSQL dédiées (ex: `SEQ_RATING`)
- Dates automatiques via `@CreationTimestamp` et `@UpdateTimestamp`
- Enum pour `status` (avec `EnumType.STRING` pour la lisibilité)
- Mots de passe hashés avec **Argon2** (pas de mot de passe en clair)

### Relations entre entités

- **Rating ↔ Airline** (`@ManyToOne`)
  - Un avis concerne une seule compagnie
  - Relation unidirectionnelle (`FetchType.LAZY`) pour éviter les surcharges
- **Rating ↔ AccountEntity**
    (je n'ai pas eu le temps d'implementer cet liaison mais j'aurais fait la meme implementation)
  - Même principe : un utilisateur peut poster plusieurs avis

---

## Pourquoi PostgreSQL ?

- Sécurité et fiabilité
- Excellente gestion des performances
- Support natif des types avancés (JSON, UUID…)
- Scalabilité pour forte volumétrie
- Base relationnelle open-source

---

## Architecture Backend

### Séparation des responsabilités

- **REST Controllers** (`.rest`)  
  Expose les APIs, valide les entrées, gère les réponses

- **Services Métier** (`.business`)  
  Contient la logique applicative, validation métier, conversion DTO ↔ Entity

- **DAO / Repository** (`.dao`)  
  Gère l’accès aux données avec JPA/Hibernate

### MapStruct pour le mapping

- Compilation rapide
- Facile à maintenir
- Intégration native avec Spring

---

## Sécurité & Authentification

### Authentification JWT

- Authentification stateless
- Signature HMAC SHA-256
- Token avec durée de vie configurable (ex : 1h)

### Stockage sécurisé des mots de passe

- Algorithme **Argon2**, recommandé par OWASP
- Jamais de mot de passe en clair

---

##  Frontend Angular

### Structure modulaire
```
src/app/
├── core/ # Composants globaux (header, footer)
│ ├── interceptors/ # Gestion des requêtes HTTP
│ ├── guards/ # Protection des routes
│ └── translate/ # i18n (NGX-Translate)
├── features/ # Modules fonctionnels (auth, rating…)
└── shared/ # Composants & services réutilisables
```

### Services Angular

- `AbstractHttpService<T, I>` pour factoriser le CRUD
- `RatingService` : recherche, filtres, pagination
- `AuthService` : stockage local du token, gestion des rôles
- `AirlineService` : récupération de compagnie aérienne

### Intercepteurs & Guards

- Centralisation des erreurs, indicateurs de chargement
- Guards d’authentification pour protéger les routes sensibles

### Gestion d’état avec NgRx

- Architecture Redux (Actions / Reducers / Effects)
- Fiable pour les données complexes et partagées

---

## UI & Design

### Stack CSS

- **Tailwind CSS** : rapide, responsive, cohérent
- **Angular Material** : composants accessibles, respect des guidelines Google

---

## Internationalisation (i18n)

- NGX-Translate
- Fichiers `.json` pour chaque langue
- Changement de langue dynamique

---

## Tests & Qualité

### Backend

- `JUnit 5` + `Mockito` : tests unitaires avec mocks
- `@DataJpaTest` : tests des repositories avec base H2

### Frontend

- `Jasmine/Karma` : tests unitaires
- `Playwright` : tests end-to-end + accessibilité

---

## Documentation

-  **Swagger / OpenAPI 3**
- Génération automatique de la documentation des endpoints
- Test direct depuis l’interface Swagger UI

---

## Performances

### Backend

- Chargement `LAZY` par défaut pour les entités liées
- Pagination native sur les listes d’avis

---

##  Responsive Design

L’interface est pensée pour s’adapter parfaitement à tous les supports : mobile, tablette, desktop.

---

##  Utilisation de l’Intelligence Artificielle
De l’intelligence artificielle a été utilisé sur ce projet, en complément de mon travail de développement, pour gagner en efficacité et en qualité :

- **Amélioration de l'accssibilité** de l’interface (recommandations, repasse de code)
- **Optimiser le design** et la hiérarchie visuelle (suggestions UI/UX, création de thème)
- **Structurer et générer des cas de test**
- **Aide a la Rédaction et organisation de ce README**
- **Corriger certains bugs**, en explorant des solutions suggérées par l’IA
- **Ajouts de données en base**



## Auteur

**Florian RENAUD**  
Développeur Full Stack Angular & Spring Boot

 florian.renaud@example.com  
 [LinkedIn](https://linkedin.com/in/florian-renaud)  
 [GitHub](https://github.com/florianrenaud1)