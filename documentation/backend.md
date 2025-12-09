# Requirements

`Node` version 24 is used to build the backend image. `npm` is also required.

The dependencies required by the application can be installed by running `npm install` in the [backend/](../backend) directory.

# Backend technologies used

The backend of the application is built with Express. The database of choice is MongoDB. `Mongoose` is used to interface with the database in the backend.

# Backend structure

The backend can be found at the [backend/](../backend/) directory.

It includes both development environment and production `Dockerfile`s.

Various connections and configurations are defined in the [backend/utils](../backend/utils/) directory.

The server is started in [server.js](../backend/server.js).

The express app is built in [app.js](../backend/app.js).

The connection to the database is formed in [dbConnection.js](../backend/utils/dbConnection.js). 

`app.js` offers an endpoint for health checks:

`/api/health` responds with status 200 and message `ok`.

The endpoint for fetching room data is defined in [controllers/rooms.js](../backend/controllers/rooms.js).

A `Room` is a [mongoose model](../backend/models/room.js) containing:

- `roomEmail`: the university email address associated with the room
- `displayId`: the room's display ID
- `displayName`: the room's display name
- `capacity`: the room's capacity as a number
- `floorNumber`: the floor the room is in
- `isWheelChairAccessible`: boolean that describes if the room is wheelchair accessible
- `tags`: an array of tags associated with the room.

The endpoint for fetching reservations is defined in [controllers/reservations.js](../backend/controllers/reservations.js).

A `Reservation` is a [mongoose model](../backend/models/reservation.js) containing:

- `room`: the room the reservation takes place in
- `start`: the start `Date` for the reservation
- `end`: the end `Date` for the reservation.

`/api/forms` returns all user-uploaded Forms. The forms live in an Excel sheet.

 A `Form` is a [mongoose model](../backend/models/form.js) containing:
 
- `title`: title string
- `startDate`: the start time for the notice
- `endDate`: the end time for the notice
- `fileUrl`: URL for the uploaded PDF file.

The endpoint for fetching Unicafe data is defined in [controllers/unicafe.js](../backend/controllers/unicafe.js).

The endpoint uses the data received in [services/unicafe.js](../backend/controllers/unicafe.js).

# Testing

The tests can be found in the [tests](../backend/tests) directory.

There are tests for all the API endpoints, with mock database and redis clients:

[forms_api.test.js](../backend/tests/forms_api.test.js)
[rooms_api.test.js](../backend/tests/rooms_api.test.js)
[reservations_api.test.js](../backend/tests/reservations_api.test.js)

Additionally, the Microsoft Graph API is tested in the [graph_client.test.js](../backend/tests/graph_client.test.js) file.

[test_helper.js](../backend/tests/test_helper.js) sets some initial data that the tests use.

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

# Mock data
> [!CAUTION]  
> Loading mock data will delete all items from the database.

Mock bulletin board submissions can be loaded by setting `LOAD_MOCK_DATA=true` in `.env`, while using the application in **development mode**.

