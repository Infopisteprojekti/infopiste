# Development

The full application can be run locally in development mode with command:

```bash
docker compose -f docker-compose.dev.yaml up
```

Docker compose builds and starts the backend, frontend and database services, sets up networking between them and mounts local volumes for hot-reloading changes.

The frontend can be accessed from `http://localhost:5173`.

The application can be shut down with command:

```bash
docker compose down
```

## Useful commands

Use the -d flag to start the application in the background:

```bash
docker compose -f docker-compose.dev.yaml up -d
```

If you change a `dev.Dockerfile` or update dependencies in `package.json` use the --build flag to rebuild the docker images:

```bash
docker compose -f docker-compose.dev.yaml up --build
```

Use the -v flag to stop the application and delete volumes (data in database will be lost permanently):

```bash
docker compose down -v
```