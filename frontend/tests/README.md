# Frontend Tests

## Outils
- `Jest` + `React Testing Library` pour unitaires et integration.
- `Playwright` pour les scenarios end-to-end dans un vrai navigateur.

## Arborescence
- `tests/unit`: composants/fonctions utilitaires isoles.
- `tests/integration`: routing + store + comportement d'ecran.
- `tests/e2e`: parcours utilisateur complet (login, creation, suppression).
- `tests/setup`: initialisation Jest (`jest-dom`, mocks globaux).

## Commandes utiles
- `npm run test:unit`: lance les tests unitaires frontend.
- `npm run test:integration`: lance les tests d'integration frontend.
- `npm run e2e`: lance les tests Playwright.
- `npm test`: lance unitaires puis integration.
