# proj-lab-bakery-example

React (TypeScript + Vite) frontend, FastAPI backend, PostgreSQL and Keycloak, run together with Docker Compose.

## Run

```sh
docker compose up -d --build
```

| Service  | URL                        | Notes                                  |
|----------|----------------------------|----------------------------------------|
| Web      | http://localhost:3000      | React app, proxies `/api` to the API   |
| API      | http://localhost:8000/docs | FastAPI; runs Alembic migrations on start |
| Keycloak | http://localhost:8080      | Admin console: `admin` / `admin`       |
| Postgres | `localhost:5432`           | `app` / `app`, database `app`          |

Sample users in the `example` realm (see `keycloak/realm-example.json`): `user1` and `user2`.
The API links a Keycloak user to a stored profile by verified email.

## Project layout

- `api/` – FastAPI app (`app/models`, `app/schemas`, `app/routers`) and Alembic migrations
- `web/` – React app (`src/components`, `src/pages`, `src/auth`)
- `keycloak/` – realm imported on Keycloak's first start
- `docker-compose.yml` – all services
