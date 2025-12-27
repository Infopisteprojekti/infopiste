# Infopiste

[![front](https://github.com/Infopisteprojekti/infopiste/actions/workflows/front.yaml/badge.svg)](https://github.com/Infopisteprojekti/infopiste/actions/workflows/front.yaml)
[![back](https://github.com/Infopisteprojekti/infopiste/actions/workflows/back.yaml/badge.svg)](https://github.com/Infopisteprojekti/infopiste/actions/workflows/back.yaml)

Application with the goal of showing useful information relevant to Exactum on an info screen.

Staging: <https://infopiste-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi/>

## Running locally

Clone the repository and install Docker as well as Node + npm to get started.

Create a `.env` file inside the project's root directory. In that file, copy the contents of the `.sample.env` and add the correct values for the variables.

> [!CAUTION]  
> Do not put API keys in `.sample.env`!

Start the full application in development mode:

```bash
$ npm run dev
```

The application in development mode can be accessed at `http://localhost:5173`.

The application can be shut down with the command:

```bash
$ docker compose down
# or
$ docker compose down -v # Also deletes MongoDB data
```

To run tests use the command:

```bash
$ npm test
```

To lint backend and frontend use the command:

```bash
$ npm run lint
# or
$ npm run lint:fix # Lint and auto-fix
```

You can also start the application in production mode with command:

```bash
$ npm start
# or
$ docker compose up
# or
$ npm run reset # Rebuild the production Docker images
```

The application in production mode can be accessed at `http://localhost:5173`.

## Configuring the application settings

The default settings for the application can be configured using optional URL parameters. The application uses these settings to set a reset target for resetting after inactivity (30 sec).

Default language can be set with `lang` parameter that has the options `fi` for Finnish, `sv` for Swedish and `en` for English.

For example default language can be set to English with URL:

`http://localhost:5713?lang=en`

"You are here marker" can be added to the floorplan using `marker` parameter. Marker requires three numerical values that are separated by commas. The first value sets the floor (options are 0, 1, 2, 3), second value sets the x coordinate (value from 0 to 100) and third value sets the y coordinate (value from 0 to 100).

For example a marker can be set to the middle of first floor with URL:

`http://localhost:5713?marker=1,50,50`

You can also set multiple parameters by separating them with an ampersand:

`http://localhost:5713?lang=en&marker=1,50,50`

## Documentation

### Application architecture

```mermaid
 architecture-beta
    group microsoft(cloud)[Microsoft]

    service db(database)[MongoDB]
    service redis(database)[Redis]
    service server(server)[Express]
    service react(internet)[React]

    service ms(internet)[Graph API] in microsoft
    service calendar(internet)[Outlook Calendar] in microsoft
    service forms(internet)[Forms (using Worksheets and Files)] in microsoft

    db:L -- R:server
    server:B -- T:redis
    server:L -- R:react
    server:T -- B:ms
    forms:R -- L:ms
    calendar:L -- R:ms
```

### Scrum process

The team follows the Scrum development framework.

The length of a sprint is two weeks.

The definition of done for the tasks is as follows:

- Feature's acceptance criteria are met
- Feature has been tested sufficiently, and the tests go through
- Feature has been documented appropriately
- Code follows the agreed upon style
- Code has been reviewed

### Topics

- [Current backlog](https://github.com/Infopisteprojekti/infopiste/projects?query=is%3Aopen)
- [Frontend documentation](documentation/frontend.md)
- [Backend documentation](documentation/backend.md)
- [CI/CD description](documentation/deployment.md)
