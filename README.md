# JobFinder

Application de recherche d'emploi développée avec Angular 17, permettant aux chercheurs d'emploi de consulter des offres provenant de sources internationales, sauvegarder leurs favoris et suivre leurs candidatures.

## Fonctionnalités

- **Recherche d'emplois** — Recherche par mots-clés (titre) et localisation avec pagination, tri par date de publication
- **Gestion des favoris** — Sauvegarder, consulter et supprimer des offres favorites (NgRx)
- **Suivi des candidatures** — Suivre les candidatures avec statuts (En attente, Accepté, Refusé) et notes personnelles
- **Authentification** — Inscription, connexion avec "Remember me", gestion du profil et suppression de compte

## Stack technique

| Technologie | Usage |
|---|---|
| Angular 17 | Framework frontend (standalone components) |
| NgRx | Gestion d'état pour les favoris (Store, Effects, Selectors) |
| RxJS | Programmation réactive |
| JSON Server | Simulation d'API REST pour les données persistantes |
| Tailwind CSS | Styling et responsive design |
| TypeScript | Typage statique |

## Architecture

```
src/app/
├── core/               # Services, modèles, guards, intercepteurs, resolvers, store NgRx
│   ├── guards/         # AuthGuard pour les routes protégées
│   ├── interceptors/   # Intercepteur HTTP pour la gestion centralisée des erreurs
│   ├── models/         # Interfaces TypeScript (User, JobOffer, Favorite, Application)
│   ├── resolvers/      # Resolver pour le pré-chargement des favoris
│   ├── services/       # AuthService, JobService, FavoritesService, ApplicationService
│   └── store/          # NgRx (actions, effects, reducer, selectors)
├── features/           # Modules fonctionnels
│   ├── auth/           # Login, Register, Profile (avec composants enfants)
│   ├── applications/   # Suivi des candidatures (avec ApplicationItemComponent)
│   └── jobs/           # Recherche, liste, détail d'offre, favoris
└── shared/             # Composants et pipes réutilisables
    ├── components/     # AuthFormHeaderComponent
    └── pipes/          # RelativeTimePipe, StatusLabelPipe
```

## Concepts Angular utilisés

- **Standalone components** — Tous les composants sont standalone
- **Lazy loading** — Toutes les routes utilisent `loadComponent()`
- **NgRx** — Store, Effects, Actions, Selectors pour la gestion des favoris
- **Reactive Forms** — Login, inscription, profil
- **Guards** — `authGuard` pour protéger les routes `/favorites`, `/applications`, `/profile`
- **Resolvers** — `favoritesResolver` pour pré-charger les favoris
- **Intercepteurs** — Intercepteur HTTP centralisé pour la gestion des erreurs
- **Pipes** — `RelativeTimePipe`, `StatusLabelPipe`
- **Services** — Injection de dépendance avec `inject()`
- **Composition** — Chaque page contient au minimum 2 composants
- **Responsive design** — Menu mobile, grilles adaptatives

## API

L'application utilise l'API [Arbeitnow](https://www.arbeitnow.com/api/job-board-api) pour les offres d'emploi.

## Installation et lancement

### Prérequis
- Node.js (v18+)
- npm

### Installation

```bash
git clone <repo-url>
cd job-finder
npm install
```

### Lancement

Terminal 1 — JSON Server :
```bash
npm run server
```

Terminal 2 — Angular :
```bash
npm start
```

L'application est accessible sur `http://localhost:4200`
JSON Server tourne sur `http://localhost:3001`

### Données de test

Un utilisateur de test est disponible dans `db.json` :
- **Email** : john@test.com
- **Mot de passe** : 123456

## Stockage des données

| Donnée | Stockage |
|---|---|
| Profil utilisateur (auth) | `sessionStorage` ou `localStorage` (selon "Remember me") |
| Utilisateurs | JSON Server (`db.json` → table `users`) |
| Favoris | JSON Server (`db.json` → table `favoritesOffers`) |
| Candidatures | JSON Server (`db.json` → table `applications`) |

## Choix techniques

- **sessionStorage vs localStorage** : Le choix est fait par l'utilisateur via l'option "Remember me" à la connexion. `sessionStorage` pour une session temporaire, `localStorage` pour une session persistante.
- **NgRx pour les favoris** : Permet une gestion centralisée et réactive de l'état des favoris, avec synchronisation automatique entre les composants.
