# Requirements

`Node` version 24 is used to build the backend image. `npm` is also required.

The dependencies required by the application can be installed by running `npm install` in the [backend/](../backend) directory.

# Backend technologies used

The backend of the application is built with Express. The database of choice is MongoDB. `Mongoose` is used to interface with the database in the backend.

# Backend structure

The backend can be found at the [backend/](../backend/) directory.

It includes both development environment and production `Dockerfile`s.

The server is started in [server.js](../backend/server.js).

The express app is built in [app.js](../backend/app.js).

The connection to the database is formed in [dbConnection.js](../backend/utils/dbConnection.js). 

`app.js` offers an endpoint for health checks:

`/health` responds with status 200 and message `ok`.

Endpoints for fetching room data are defined in [controllers/rooms.js](../backend/controllers/rooms.js).

`/api/rooms` returns all the rooms.

`/api/rooms/:id/reservations` returns all reservations for the room with the given `id`.

A `room` is an object containing:

- `id`: the room's unique identifier
- `type`: the type of the room, which can be `meeting_room`, `office`, or `classroom`.
- `capacity`: the capacity of the room
- `reservations`: an array of `reservation` objects describing the reservations for the room.

A `reservation` is an object containing:

- `id`: the reservation's unique identifier
- `start`: start time for the reservation
- `end`: end time for the reservation
- `location`: the `displayName` and `locationType` of the `room` where the reservation takes place.

`/api/forms` returns all user-uploaded Forms.

 A `Form` is a mongoose model containing:
 
- `title`: title string
- `startDate`: the start time for the notice
- `endDate`: the end time for the notice
- `fileUrl`: URL for the uploaded PDF file.

## Staging server

Whenever new content is pushed to the main branch, the backend image is rebuilt, and it takes a maximum of 15 minutes for the staging server to apply the new image.

The endpoints can be accessed by adding the wanted endpoint to the end of the url; for example,

```bash
$ curl https://infopiste-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi/api/health
```

has the following output:

```
0.k8s.it.helsinki.fi/health
{"status":"ok"}
```

## Local development

> [!IMPORTANT]
> Remember to install the dependencies first by running `npm install`!

Alternatively, the backend can be accessed by running

```bash
$ npm run dev
```

in the [backend](../backend/) directory of the project. This is equivalent to running `NODE_ENV=production node server.js`.

The server will then be running on port 1234.

Note that MongoDB should be running locally for this to work. Otherwise, connecting to the database will fail, and the backend won't start.

# Testing

The tests can be found in the [tests](../backend/tests) directory.

[info_api_test.js](../backend/tests/info_api.test.js) tests the functionality of the endpoints.

Specifically, it tests the endpoints `/health`, `/api/rooms`, `/api/hello`, `/api/rooms/:id/reservations` and `/api/forms`.

`[rooms.test.js](../backend/tests/rooms.test.js) tests the functionality of the functions in [services/rooms.js](../backend/services/rooms.js).

The tests ensure that the data is in the correct shape.

The tests, as well as linting, are included in the CI/CD pipeline. Whenever new content is pushed to the main branch, the tests and lint are executed.

> [!NOTE]
> All of the below commands have to be run in in the backend directory.

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

This is equivalent to running `npx eslint .`
