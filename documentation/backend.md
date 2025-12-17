# Backend Documentation
# Requirements

- `Node.js`: Version 24
- `npm`

The dependencies required by the application can be installed by running `npm install` in the [backend/](../backend) directory.

# Technologies Used

The backend is build with the following technologies:

- Express - HTTP server and routing
- MongoDB - Database
- Redis - Cache
- Docker - Containerization for development and production environments

# Structure

The backend code lives in the [backend/](../backend/) directory and includes separate development environment and production `Dockerfile`s.

Key files and directories:
- `server.js` - Application entrypoint
- `app.js` - Express application setup (routes, middleware)
- `controllers/`
- `utils/` - Various connections, configurations and helpers
  - `dbConnetion.js` - Mongo connection logic
  - `redisClient.js`
  - `graphClient.js` - Microsoft Graph API initialization and integrations
  - `graphHelper.js` - Helper functions for `graphClient.js`
- `models/` - Mongoose models

## Health Check
`/api/health` responds with status 200 and message ok.

## Rooms
- **Controller:** `controllers/rooms.js`
- **Model:** `models/rooms.js`

`Room` document contains:
- `roomEmail`: the university email address associated with the room
- `displayId`: the room's display ID
- `displayName`: the room's display name
- `capacity`: the room's capacity as a number
- `floorNumber`: the floor the room is in
- `isWheelChairAccessible`: boolean that describes if the room is wheelchair accessible
- `tags`: an array of tags associated with the room.


## Reservations
- **Controller:** `controllers/reservations.js`
- **Model:** `models/reservation.js`

`Reservation` document contains:
- `room`: the room the reservation takes place in
- `start`: the start `Date` for the reservation
- `end`: the end `Date` for the reservation.

## Forms
- **Controller:** `controllers/forms.js`
- **Model:** `models/form.js`

`/api/forms` returns all valid and active user-uploaded Forms.
`/api/forms/proxy-pdf` proxy address for PDF-files.

Submissions are synced by `syncFormSubmissions`-function which also handles the deletetion of submissions.

**Currently, forms are only stored in Redis, not in the database.**

`Form` document contains:
- `title`: title string
- `startDate`: the start time for the notice
- `endDate`: the end time for the notice
- `fileUrl`: Proxied URL for the uploaded PDF file

## Unicafe
- **Controller:** `controllers/unicafe.js`

`/api/unicafe/menus` returns Exactum's and Chemicum's menus for the current day. Accepts `lang` query parameter with a value of `fi`, `en` or `sv`, if no value was passed returns menus in all three languages.

The endpoint's fetching logic is located in `services/unicafe.js`.

# Testing

The tests are located in the [tests](../backend/tests) directory.

Test files:
- `forms_api.test.js`
- `rooms_api.test.js`
- `reservations_api.test.js`
- `graph_client.test.js` - Tests for Microsoft Graph API integration
- `test_helper.js` - Sets up test data and helpers

Tests and linting are executed as a part of the CI/CD pipeline, whenever changes are pushed to the `main` branch.

> [!NOTE]
> All of the below commands have to be run in in the backend directory.

## Running Tests Locally
```bash
$ npm run test
```

This is equivalent to running `npx cross-env NODE_ENV=test TEST=true vitest run`.


## Viewing Test Coverage
```bash
$ npm run coverage
```

This is equivalent to running `npx cross-env NODE_ENV=test TEST=true vitest run --coverage`.

## Linting
```bash
$ npm run lint
```

This is equivalent to running `npx eslint .`

# Mock data
> [!CAUTION]  
> Loading mock data will delete all items from the database.

Mock bulletin board submissions can be loaded by setting `LOAD_MOCK_DATA=true` in `.env`, while using the application in **development mode**.

