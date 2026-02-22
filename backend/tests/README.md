# Backend Tests

## Librairies utilisees
- Unit et integration: Jest
- Integration HTTP (app Express): Supertest
- E2E backend HTTP reel: Jest (avec serveur lance dans le test)

## Arborescence
- `tests/unit`: tests unitaires backend (middlewares/controllers avec mocks)
- `tests/integration`: tests integration backend (routes via `app`)
- `tests/e2e`: tests end-to-end backend (serveur HTTP reel + requetes reelles)
