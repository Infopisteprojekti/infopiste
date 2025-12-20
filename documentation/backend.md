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
  - `graphHelper.js` - Sync functions that use `graphClient.js`
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

# Microsoft Graph API
The backend integrates with the Microsoft Graph API to synchronize room data, reservations and user-submitted forms stored in Microsoft services.

## Overview

The Microsoft API integration is implemented in two parts:
- Graph client (`graphClient.js`) – Authentication, requests and API-sepecific logic
- Graph helpers (`graphHelper.js`) – Syncronization logic

## Authentication & Configuration

The Graph client is initialized using the following credentials:
- `TENANT_ID`
- `CLIENT_ID`
- `CLIENT_SECRET`

## Forms (Excel) Syncronization

Form data is synchronized dynamically from Microsoft Graph. The sync process combines Excel form submissions, Drive file data and deletion requests.

`syncFormSubmissions()` api calls:
- `graphClient.getFormSubmissions()` - Fetches valid and active submissions from a Excel file
- `graphClient.getDriveItems()` - Fetches `downloadUrl` for uploaded files
- `graphClient.getDeletionRequests()` - Fetches deletion requests from a Excel file
- `graphClient.deleteDriveItem(<fileId>)` - Deletes a file

**High-level overview**
1. Fetch current data from Microsoft Graph:
   - Form submissions
   - Submitted files (`downloadUrl`)
   - Deletetion requests
2. Build loopup maps for files and deletion requests
3. Delete Drive files that are marked for removal
4. Filter submissions to only active and valid
5. Normalize submissions and enforce submission limits (`MAX_ACTIVE_PER_EMAIL`)
6. Return valid entries


# Testing

The tests are located in the [tests](../backend/tests) directory.

Test files:
- `forms_api.test.js`
- `rooms_api.test.js`
- `reservations_api.test.js`
- `graph_client.test.js` - Tests for Microsoft Graph API integration
- `test_helper.js` - Sets up test data and helpers

Tests and linting are executed as a part of the CI/CD pipeline, whenever changes are pushed to the `main` branch.

## Running Tests Locally
> [!NOTE]
> All of the commands below have to be run in in the backend directory.

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

