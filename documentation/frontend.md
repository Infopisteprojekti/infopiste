# Requirements

`Node` version 20 is used to build the frontend image. `npm` is also required.

# Frontend technologies used

The frontend of the application is built with React. Styling is done with base CSS, which can be found in the [css](../frontend/src/css/) directory under [src/](../frontend/src/).

The application is a single-page app.

# Frontend structure

The frontend has various necessary configuration files in the root directory, [frontend/](../frontend/). 

It also includes both development environment and production `Dockerfile`s.

The actual functionality can be found in [src/](../frontend/src/).

[assets/](../frontend/src/assets/) contains the SVG files of the floorplans for each floor, and the rest of the directory contains the functionality of the application.

[Floorplan.jsx](../frontend/src/Floorplan.jsx) contains all the logic for fetching rooms and the data related to them, while [App.jsx](../frontend/src/App.jsx) wraps the `Floorplan` component using a style, and [main.jsx](../frontend/src/main.jsx) wraps the `App` component with `StrictMode`.

`main.jsx` is then used in [index.html](../frontend/index.html) to render the components.

# Running the frontend

## Staging server

The frontend is live in the staging server at https://infopiste-frontend-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi/.

Whenever new content is pushed to the `main` branch, the frontend image is rebuilt, and it takes a maximum of 15 minutes for the staging server to apply the new image.

## Docker

The frontend can also be run with Docker. The [docker-compose.yaml](../docker-compose.yaml) present at the root of the project builds the frontend using the frontend's `Dockerfile`, and then maps it to port 3000. To run the file, execute the following command:

```console
$ docker compose up
```

in the root of the project.

## Local development

Alternatively, the frontend can be accessed by running

```console
$ npm run dev
```

in the [frontend](../frontend/) directory of the project. This is equivalent to running `npx vite --host`.

The application will then be available at `localhost:5173`.

Note that before attempting to start the frontend, dependencies should be installed with

```console
$ npm install
```

and an `.env` file created in the root directory with the following contents:

```env
VITE_API_BASE_URL=http://localhost:1234
```

This assumes the [backend](./backend) is running locally on the default port 1234. 

# Testing

The tests can be found in the [tests](../frontend/tests/) directory. 

[testSetup.js](../frontend/tests/testSetup.js) simply ensures that each test starts with a clean slate. 

[Floorplan.test.jsx](../frontend/tests/Floorplan.test.jsx) tests the functionality of the `Floorplan` component. These tests use mocks in place of using the actual component, due to the complexity of creating unit tests for a component that fetches data from the backend.

The tests, as well as linting are included in the CI/CD pipeline. Whenever new content is pushed to the `main` branch, the tests are executed. 

The app can also be tested locally by running 

```console
$ npm run test
```

This is equivalent to running `npx vitest run`. 

ESLint is used for linting. The linting can be checked with

```console
$ npm run lint
```

in the `frontend/` directory.

This is equivalent to running `npx eslint .`
