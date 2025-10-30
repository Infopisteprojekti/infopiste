# Requirements

`Node` version 20 is used to build the frontend image. `npm` is also required.

# Frontend technologies used

The frontend of the application is built with React. Styling is done with base CSS, which can be found in the [css](../frontend/src/css/) directory under [src/](../frontend/src/).

The application is a single-page app.

# Frontend structure

The frontend has various necessary configuration files in the root directory, [frontend/](../frontend/).

It also includes both development environment and production `Dockerfile`s.

The actual functionality can be found in [src/](../frontend/src/).

[assets/](../frontend/src/assets/) contains the SVG files of the floorplans for each floor, and the QR code for uploading forms.

[components/](../frontend/src/components/) contains the following React components:

`BulletinBoard` contains the logic for letting users upload notices, and viewing uploaded notices as a grid, or in an expanded view for the selected notice.

`PDFDisplay` contains the logic for displaying a notice, either as a preview or in an expanded view.

`QRCode` is used to display the QR code to upload files in the relevant components.

`FloorDisplay` iterates through all rooms in the given floor, and assigns the correct data (reservation status and click handler, as well as polling) to each room.

`Floorplan` is used to specify which floor to display, and includes the logic and buttons for zooming and switching rooms. 

`App` implements a navigation bar at the bottom of the page. The application is a single-page application using React Router.

`main.jsx` is used in [index.html](../frontend/index.html) to render the components.

The styling for each component is defined in [css/](../frontend/src/css/).

# Running the frontend

## Staging server

The frontend is live in the staging server at https://infopiste-frontend-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi/.

Whenever new content is pushed to the `main` branch, the frontend image is rebuilt, and it takes a maximum of 15 minutes for the staging server to apply the new image.

## Docker

The frontend can also be run with Docker. The [docker-compose.yaml](../docker-compose.yaml) present at the root of the project builds the frontend using the frontend's `Dockerfile`, and then maps it to port 3000. To run the file, execute the following command:

```bash
$ docker compose up
```

in the root of the project.

## Local development

> [!IMPORTANT]
> Remember to install the dependencies first by running `npm install`!

Alternatively, the frontend can be accessed by running

```bash
$ npm run dev
```

in the [frontend](../frontend/) directory of the project. This is equivalent to running `npx vite --host 0.0.0.0 --port 5173`.

The application will then be available at `localhost:5173`.

# Testing

The unit tests can be found in the [tests](../frontend/tests/) directory.

[testSetup.js](../frontend/tests/testSetup.js) simply ensures that each test starts with a clean slate.

[Floorplan.test.jsx](../frontend/tests/Floorplan.test.jsx) tests the functionality of the `Floorplan` component. These tests use mocks in place of using the actual component, due to the complexity of creating unit tests for a component that fetches data from the backend.

The file also includes tests for the `BulletinBoard` component.

End-to-end tests can be found in the [e2e](../frontend/e2e/) directory.

These tests are used to test the end-to-end functionality of the application, which includes the communication between the frontend and backend.

The tests, as well as linting are included in the CI/CD pipeline. Whenever new content is pushed to the `main` branch, the tests are executed.

> [!NOTE]
> All of the below commands have to be run in in the backend directory.

The unit tests can be run locally with

```bash
$ npm run test
```

This is equivalent to running `npx vitest run tests`.

Coverage can be viewed with

```bash
$ npm run coverage
```

This is equivalent to running `npx vitest run tests --coverage`.

The end-to-end tests can be run locally with

```bash
$ npm run e2e
```

This is equivalent to running `npx playwright test`.

Note that to run either the unit tests or end-to-end tests, the application must be running locally. See [Docker](#docker) or [Local development](#local-development).

ESLint is used for linting. The linting can be checked with

```bash
$ npm run lint
```

This is equivalent to running `npx eslint .`
