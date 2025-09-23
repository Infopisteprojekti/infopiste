# Requirements

`Node` version 20 is used to build the frontend image. `npm` is also required.

# Backend technologies used

The backend of the application is built with Express. The backend of choice is MongoDB. `Mongoose` is used to interface with the database in the backend.

# Backend structure

The backend can be found at the `[backend/](../backend/) directory. 

It includes both development environment and production `Dockerfile`s. 

Mock room data is currently generated in [mockdata/generate-room-data.js](../backend/mockdata/generate-room-data.js).

The functionality is in [server.js](../backend/server.js).

`server.js` offers various endpoints to fetch relevant data. It also includes the `/health` endpoint for a health check.

`/api/rooms` returns all the rooms.

A `room` is an object containing an `id`, a `type` (office, classroom, or meeting room), `capacity`, and `reservations` in an array.

`/api/rooms/:id` returns a specific room with the given id.

`/api/rooms/:id/reservations` returns the reservations for a specific room with the given id.

# Running the backend

## Staging server

The backend is live in the staging server at https://infopiste-backend-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi/.

Whenever new content is pushed to the main branch, the backend image is rebuilt, and it takes a maximum of 15 minutes for the staging server to apply the new image.

The endpoints can be accessed by adding the wanted endpoint to the end of the url; for example,

`$ curl https://infopiste-backend-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi/health`

has the following output:

```
0.k8s.it.helsinki.fi/health
{"status":"ok"}
```

Please note that to run the application with Docker or locally, you need to create a `.env` file in the [backend](../backend/) directory. 

Ths environment file should include the values `PORT` (optional, as it's set to 1234 by default in `server.js`), and `MONGO_DB_URL`. 

Since the `docker-compose.yaml` maps MongoDB's internal port (`27017`), the value of `MONGO_DB_URL` depends on if the application is run locally or in Docker.

Locally:

`MONGO_DB_URL=mongodb://localhost:27017/db`

In Docker:

`MONGO_DB_URL=mongodb://mongo:27017/db`

## Docker

The backend can also be run with Docker. The [docker-compose.yaml](../docker-compose.yaml) present at the root of the project builds the frontend using the frontend's Dockerfile, and then maps it to port 1234. To run the file, execute the following command:

`$ docker compose up`

in the root of the project.

## Local development

Alternatively, the backend can be accessed by running

`$ npm run start`

in the [backend](../backend/) directory of the project. This is equivalent to running `NODE_ENV=production node server.js`.

The server will then be running on port 1234.

# Testing

The tests can be foudn in the [tests](../backend/tests) directory. 

[info_api_test.js](../backend/tests/info_api.test.js) tests the functionality of the endpoints.

Specifically, it tests the endpoints `/health`, `/api/rooms`, `/api/rooms/:id`, and `/api/rooms/:id/reservations`.

The tests, as well as lint, are included in the CI/CD pipeline. Whenever new content is pushed to the main branch, the tests are executed. 

The app can also be tested locally by running

`$ npm run test`.

ESLint is used for linting. The linting can be checked with

`$ npm run lint`

in the `backend/` directory.

This is equivalent to running `npx eslint .`
