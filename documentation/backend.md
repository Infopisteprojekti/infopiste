# Requirements

`Node` version 20 is used to build the backend image. `npm` is also required.

# Backend technologies used

The backend of the application is built with Express. The backend of choice is MongoDB. `Mongoose` is used to interface with the database in the backend.

# Backend structure

The backend can be found at the [backend/](../backend/) directory.

It includes both development environment and production `Dockerfile`s.

Mock room data is currently generated in [mockdata/generate-room-data.js](../backend/mockdata/generate-room-data.js).

The functionality is in [server.js](../backend/server.js).

`server.js` offers various endpoints to fetch relevant data. It also includes the `/health` endpoint for a health check.

`/api/rooms` returns all the rooms.

A `room` is an object containing:

- `id`: the room's unique identifier
- `reservations`: an array of `reservation` objects describing the reservations for the room.

A `reservation` is an object containing:

- `id`: the reservation's unique identifier
- `start`: start time for the reservation
- `end`: end time for the reservation
- `location`: the `displayName` and `locationType` of the `room` where the reservation takes place.

`/api/rooms/:id/reservations` returns the reservations for a specific room with the given id.

# Running the backend

## Staging server

The backend is live in the staging server at https://infopiste-backend-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi/.

Whenever new content is pushed to the main branch, the backend image is rebuilt, and it takes a maximum of 15 minutes for the staging server to apply the new image.

The endpoints can be accessed by adding the wanted endpoint to the end of the url; for example,

```bash
$ curl https://infopiste-backend-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi/health
```

has the following output:

```
0.k8s.it.helsinki.fi/health
{"status":"ok"}
```

Please note that to run the application with Docker or locally, you need to create a `.env` file in the [backend](../backend/) directory.

The environment file should include the values `PORT` (optional, as it's set to 1234 by default in `server.js`), and `MONGO_DB_URL`.

Since the `docker-compose.yaml` maps MongoDB's internal port (`27017`), the value of `MONGO_DB_URL` depends on if the application is run locally or in Docker.

Locally:

`MONGO_DB_URL=mongodb://localhost:27017/db`

In Docker:

`MONGO_DB_URL=mongodb://mongo:27017/db`

## Docker

The backend can also be run with Docker. The [docker-compose.yaml](../docker-compose.yaml) present at the root of the project builds the backend using the backend's Dockerfile, and then maps it to port 1234. To run the file, execute the following command:

```bash
$ docker compose up
```

in the root of the project.

The backend is then running on port 1234, and can be accessed as follows:

```bash
$ curl http://localhost:1234/health
```

## Local development

Alternatively, the backend can be accessed by running

```bash
$ npm run start
```

in the [backend](../backend/) directory of the project. This is equivalent to running `NODE_ENV=production node server.js`.

The server will then be running on port 1234.

Note that MongoDB should be running locally for this to work. Otherwise, connecting to the database will fail, and the backend won't start.

# Testing

The tests can be found in the [tests](../backend/tests) directory.

[info_api_test.js](../backend/tests/info_api.test.js) tests the functionality of the endpoints.

Specifically, it tests the endpoints `/health`, `/api/rooms`, `/api/hello`, and `/api/rooms/:id/reservations`.

`[rooms.test.js](../backend/tests/rooms.test.js) tests the functionality of the functions in [services/rooms.js](../backend/services/rooms.js).

The tests ensure that the data is in the correct shape.

The tests, as well as linting, are included in the CI/CD pipeline. Whenever new content is pushed to the main branch, the tests and lint are executed.

The app can also be tested locally by running

```bash
$ npm run test
```

This is equivalent to running `npx cross-env NODE_ENV=test TEST=true vitest run`.

Coverage in CLI can be viewed with

```bash
$ npm run coverage
```

This is equivalent to running `npx cross-env NODE_ENV=test TEST=true vitest run --coverage`.

ESLint is used for linting. The linting can be checked with

```bash
$ npm run lint
```

in the `backend/` directory.

This is equivalent to running `npx eslint .`
