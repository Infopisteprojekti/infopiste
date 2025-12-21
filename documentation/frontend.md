# Frontend

## Requirements

Node version 24 is used to build the frontend image. Npm is also required.

The dependencies required by the application can be installed by running `npm install` in the [frontend/](../frontend) directory.

## Technologies used

The frontend of the application is built with React. Styling is done with basic CSS. Other dependencies can be seen in `package.json` for the frontend.

The application is a single-page app.

## Structure

The frontend has various necessary configuration files in the root directory, [frontend/](../frontend/). This includes both development and production environment `Dockerfile`s.

The actual functionality can be found in [src/](../frontend/src/).

### The contents of `src/`

[assets/](../frontend/src/assets/) contains the SVG files of the floorplans for each floor, and the QR codes. The flags used in the language switcher are stored in [/assets/flags/](../frontend/src/assets/flags/).

[components/](../frontend/src/components/) contains the following React components:

* `BulletinBoard` contains the logic for letting users upload notices, and viewing uploaded notices as a grid, or in an expanded view for the selected notice.
* `Feedback` implements a popup with information on how to give feedback.
* `FloorDisplay` iterates through all rooms in the given floor, and assigns the correct data (reservation status and click handler, as well as polling) to each room.
* `Floorplan` is used to specify which floor to display, and includes the logic and buttons for zooming and switching rooms. 
* `LanguageSwitcher` implements a menu to switch the display language of the application.
* `Navbar` implements the navigation bar at the bottom of the application.
* `PDFDisplay` contains the logic for displaying a notice when one is clicked.
* `PDFImage` uses `react-pdf` to render a pdf as an image, either as a preview or with multiple pages in the expanded view.
* `QRCode` is used to display the QR code to upload files in the relevant components.
* `RoomPopup` implements a popup for when a room is clicked, displaying relevant information.
* `UnicafeMenu` uses data from Unicafe to display the meals in Exactum and Chemicum for the day.

[frontend/src/constants](../frontend/src/constants/) contains files that define constants used across the application.

[frontend/src/context](../frontend/src/context) contains the `AppSettingsContext.jsx` file, which defines some global behavior.

[frontend/src/hooks](../frontend/src/hooks) contains the `useAppSettings` hook which provides above mentioned functionality to components.

[frontend/src/services](../frontend/src/services/) contains the files for fetching data from the backend for the frontend to display.

[frontend/src/styles](../frontend/src/styles/) contains stylesheets (CSS) for components.

[frontend/src/utils](../frontend/src/utils/) defines translations for the application and contains some helpers.

[frontend/src/App.jsx](../frontend/src/App.jsx) and [frontend/src/main.jsx](../frontend/src/main.jsx) are wrapped around the components.

## Testing

The unit tests can be found in the [tests](../frontend/tests/) directory.

* [testSetup.js](../frontend/tests/testSetup.js) ensures that each test uses the English version of the frontend, and also ensures a clean slate for each test.
* The files ending in `unit.test.jsx` mostly test that the components are rendered correctly. `BulletinBoard.interactions.test.jsx` tests that the navigation and other buttons in the Bulletin Board view function correctly.
* End-to-end tests can be found in the [e2e](../frontend/e2e/) directory.
* [testUtils.js](../frontend/e2e/testUtils.js) defines mock data used in the end-to-end tests, and also mocks the relevant backend routes.

These tests are used to test the end-to-end functionality of the application, which includes the communication between the frontend and backend.

The tests, as well as linting are included in the CI/CD pipeline. Whenever new content is pushed to the `main` branch, the tests are executed. Also pull requests are tested.

> [!NOTE]
> All of the below commands have to be run in in the frontend directory.

The unit tests can be run locally with:

```bash
$ npm run test
```

This is equivalent to running `npx vitest run tests`.

Coverage can be viewed with:

```bash
$ npm run coverage
```

This is equivalent to running `npx vitest run tests --coverage`.

The end-to-end tests can be run locally with:

```bash
$ npm run e2e
```

This is equivalent to running `npx playwright test`.

ESLint is used for linting. The linting can be checked with:

```bash
$ npm run lint
```

This is equivalent to running `npx eslint .`.
