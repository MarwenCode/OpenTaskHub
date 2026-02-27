# OpenTaskHub

Application web de gestion collaborative de taches par workspace, avec separation des roles (`user` / `admin`), tableau de bord projet, vue personnelle des taches et systeme de commentaires.

## 1) Objectif du projet

OpenTaskHub a ete construit comme un projet full-stack pour demontrer:

- Une architecture frontend/backend claire et decouplee
- Une API REST securisee par JWT
- Une base PostgreSQL relationnelle (workspaces, taches, membres, commentaires)
- Une UI React moderne orientee productivite (kanban + vue "My Tasks")

Le but fonctionnel: centraliser les projets d'une equipe et suivre l'avancement des taches par statut.

## 2) Stack technique

### Frontend

- React 18 + TypeScript
- Vite
- Redux Toolkit + React Redux
- React Router
- Axios
- Sass
- React Icons

### Backend

- Node.js + Express 5
- PostgreSQL (`pg`)
- JWT (`jsonwebtoken`)
- Hash de mot de passe (`bcrypt`)
- CORS
- Dotenv
- Nodemon (dev)

### Infrastructure / Outils

- Docker Compose (service PostgreSQL)
- SQL scripts (`backend/database.sql`, `opentaskhub_backup.sql`)
- Collection Postman (`backend/OpenTaskHub_API.postman_collection.json`)

## 3) Architecture globale

### Vue d'ensemble

1. Le frontend React consomme l'API REST du backend.
2. Le backend valide le token JWT via middleware.
3. Les controllers executent les requetes SQL vers PostgreSQL.
4. Les donnees retournees alimentent les slices Redux et les composants UI.

### Organisation par couches (backend)

- `routes/`: declaration des endpoints
- `middelwares/`: auth JWT + controle admin
- `controllers/`: logique applicative
- `config/db.js`: connexion PostgreSQL locale/cloud
- `setupDatabase.js`: creation auto des tables `tasks` et `comments` au demarrage
- `database.sql`: schema complet recommande

### Organisation par couches (frontend)

- `pages/`: ecrans metier (dashboard, workspace, my tasks)
- `components/`: UI reutilisable + composants metier
- `redux/`: store et slices (auth, workspace, task)
- `styles/`: variables/mixins/reset/global Sass
- `lib/`: utilitaires (auth localStorage, instance axios)

## 4) Arborescence principale

```txt
OpenTaskHub/
|-- backend/
|   |-- src/
|   |   |-- app.js
|   |   |-- server.js
|   |   |-- config/db.js
|   |   |-- controllers/
|   |   |-- middelwares/
|   |   |-- routes/
|   |   |-- models/
|   |   `-- setupDatabase.js
|   |-- database.sql
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- App.tsx
|   |   |-- main.tsx
|   |   |-- pages/
|   |   |-- components/
|   |   |-- redux/
|   |   |-- styles/
|   |   `-- lib/
|   `-- package.json
|-- docker-compose.yml
`-- README.md
```

## 5) Fonctionnalites principales

- Authentification avec portails `user` et `admin`
- Creation d'un workspace reservee aux admins
- Consultation des workspaces accessibles
- Gestion des taches par workspace (CRUD)
- Changement de statut (kanban + drag and drop)
- Vue "My Tasks" (taches assignees a l'utilisateur connecte)
- Commentaires sur les taches
- Assignation de taches a des utilisateurs

## 6) Routes API (resume)

Prefix global dans `backend/src/app.js`: `/api`

- Auth:
- `POST /api/auth/register/user`
- `POST /api/auth/register/admin`
- `POST /api/auth/login/user`
- `POST /api/auth/login/admin`
- Workspaces:
- `GET /api/workspaces`
- `POST /api/workspaces` (admin uniquement)
- `GET /api/workspaces/:workspaceId/members`
- Tasks:
- `GET /api/tasks/my-tasks`
- `GET /api/tasks/workspace/:workspaceId`
- `GET /api/tasks/workspace/:workspaceId/status/:status`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `POST /api/tasks/:id/comments`
- `GET /api/tasks/:id/comments`
- Users:
- `GET /api/users`
- Health:
- `GET /api/health`

## 7) Installation et lancement local

### Prerequis

- Node.js 18+
- PostgreSQL 16+ (ou Docker)

### A. Demarrer PostgreSQL avec Docker (option recommande)

Depuis la racine:

```bash
docker compose up -d
```

### B. Configurer la base

Option 1 (complete, recommandee):

- executer `backend/database.sql` dans la base `opentaskhub`

Option 2 (automatique partielle):

- lancer le backend, `setupDatabase.js` cree `tasks` et `comments` si absentes

### C. Backend

```bash
cd backend
npm install
npm run dev
```

Serveur: `http://localhost:5000` (par defaut)

### D. Frontend

```bash
cd frontend
npm install
npm run dev
```

Client Vite: `http://localhost:5173`

## 8) Variables d'environnement

### Backend (`backend/.env`)

```env
PORT=5000
JWT_SECRET=your_secret_key

# Local DB
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=opentaskhub

# Option cloud (Render/Supabase)
# DATABASE_URL=postgresql://...
# NODE_ENV=production
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

Important: les slices Redux utilisent `VITE_API_URL` directement.

## 9) Choix techniques expliques (pour revue)

- **React + TypeScript**: securiser les interfaces de donnees et fiabiliser l'evolution du front.
- **Redux Toolkit**: centraliser les etats metiers (auth, workspaces, tasks) et gerer les appels async via `createAsyncThunk`.
- **Express + controllers**: separation route / middleware / logique metier pour une API maintenable.
- **PostgreSQL**: modelisation relationnelle adaptee aux entites collaboratives (users, workspaces, tasks, comments).
- **JWT**: authentification stateless simple a deployer (local et cloud).
- **Sass modulaire**: structurer les styles (variables, mixins, styles de page/composant).

## 10) Points d'attention et axes d'amelioration

- Le projet contient des conventions heterogenes de nommage (`middelwares`, `worksapceSlice`) qui peuvent etre harmonisees.
- `backend/database.sql` et certaines insertions controller utilisent des noms differents (`owner_id` / `created_by`) a aligner.
- `backend/API_ENDPOINTS_LIST.md` n'est plus totalement aligne avec les routes `/api/...` actuelles.
- Le Dockerfile backend est vide: une image applicative complete peut etre ajoutee.
- Une strategie de tests complete est disponible (unitaires, integration, E2E) avec CI GitHub Actions.

## 11) Scripts utiles

### Backend

- `npm run dev`: demarrage en mode developpement (nodemon)
- `npm start`: demarrage production
- `npm run test:unit`: tests unitaires backend
- `npm run test:integration`: tests d'integration backend
- `npm run test:db:setup`: initialisation schema de test PostgreSQL

### Frontend

- `npm run dev`: serveur Vite
- `npm run build`: build production
- `npm run preview`: preview du build
- `npm run lint`: verification ESLint
- `npm run test:unit`: tests unitaires frontend
- `npm run test:integration`: tests d'integration frontend
- `npm run e2e`: tests E2E Playwright

## 12) Ce que je voulais demontrer avec ce projet

- Concevoir une application de gestion realiste de bout en bout
- Manipuler des roles et permissions dans une API REST
- Construire une UI de suivi des taches orientee usage quotidien
- Faire coexister environnement local et deploiement cloud (CORS + `DATABASE_URL`)

## 13) Guide tests + CI/CD

- Guide complet: `TESTING.md`
- Workflow CI: `.github/workflows/ci.yml`

---

Si vous etes recruteur ou reviewer technique:

1. Commencez par `frontend/src/App.tsx` pour le routing et les gardes d'acces.
2. Consultez `backend/src/app.js` puis `backend/src/routes/*` pour la surface API.
3. Regardez `frontend/src/redux/*` pour comprendre les flux de donnees.
4. Terminez par `backend/database.sql` pour la modelisation relationnelle.
