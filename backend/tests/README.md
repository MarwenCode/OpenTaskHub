# Backend Tests

## Outils
- `Jest` pour les tests unitaires et integration.
- `Supertest` pour appeler les routes Express sans demarrer `server.js`.
- `pg` (via `src/config/db.js`) pour verifier les ecritures reelles en base.

## Arborescence
- `tests/unit`: tests unitaires (middlewares, controleurs, validateurs).
- `tests/integration`: tests integration route + base PostgreSQL.
- `tests/scripts`: scripts utilitaires de test (setup schema DB).
- `tests/e2e`: tests end-to-end backend existants.

## Commandes utiles
- `npm run test:unit`: lance uniquement les tests unitaires backend.
- `npm run test:db:setup`: cree le schema de test depuis `database.sql`.
- `npm run test:integration`: lance les tests integration backend.
- `npm test`: lance unitaires puis integration.
