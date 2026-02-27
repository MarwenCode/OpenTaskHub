# OpenTaskHub - Strategie de Tests et CI/CD

Ce document explique comment tester OpenTaskHub localement et automatiquement dans GitHub Actions.

## 1. Objectif

On couvre 3 niveaux de tests:
- Tests unitaires: verifier une fonction ou un controleur en isolation.
- Tests d'integration: verifier plusieurs couches ensemble (route Express + base PostgreSQL).
- Tests End-to-End (E2E): verifier le parcours utilisateur dans un vrai navigateur.

## 2. Structure des dossiers

```text
backend/
  tests/
    unit/
      controllers/
      utils/
    integration/
    scripts/
    e2e/

frontend/
  tests/
    unit/
    integration/
    e2e/
    setup/

.github/
  workflows/
    ci.yml
```

## 3. Backend - Tests unitaires

Exemples couverts:
- `tests/unit/utils/validators.test.js`: validation des donnees (`register`, `login`, `task`).
- `tests/unit/controllers/auth.controller.test.js`: controleur auth avec mocks DB/JWT/bcrypt.
- `tests/unit/controllers/task.controller.test.js`: creation de tache avec validation.

Commande:

```bash
cd backend
npm run test:unit
```

## 4. Backend - Tests d'integration

Exemple couvert:
- `tests/integration/auth-task.integration.test.js`
  - login via route `/api/auth/login/user`
  - verification du token JWT
  - creation de tache via `/api/tasks`
  - verification directe en base PostgreSQL

Preparation schema de test:

```bash
cd backend
npm run test:db:setup
npm run test:integration
```

Prerequis local:
- Une base PostgreSQL de test (ex: `opentaskhub_test`).
- Variables d'environnement DB (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`).

## 5. Frontend - Unitaires et integration

Exemples couverts:
- `tests/unit/lib/auth.test.ts`: fonctions utilitaires `saveUser/loadUser/clearUser`.
- Tests composants + routing deja presents.

Commandes:

```bash
cd frontend
npm run test:unit
npm run test:integration
```

## 6. Frontend - E2E avec Playwright

Scenario couvert:
- utilisateur se connecte
- cree une tache
- verifie qu'elle apparait
- supprime la tache

Fichier:
- `frontend/tests/e2e/task-lifecycle.spec.ts`

Commande:

```bash
cd frontend
npm run e2e
```

Note:
- Le test E2E mocke les appels API pour etre stable en CI.

## 7. CI/CD - GitHub Actions

Workflow:
- `.github/workflows/ci.yml`

Jobs executes:
1. Backend unit tests
2. Backend integration tests (avec service PostgreSQL)
3. Frontend unit + integration tests
4. Frontend Playwright E2E

## 8. Pourquoi c'est professionnel

- Separation claire des niveaux de tests.
- Pipeline CI reproductible.
- Tests d'integration verifies sur une vraie DB.
- E2E stable (moins de tests flaky).
- Rapports Playwright archives dans les artifacts GitHub Actions.
