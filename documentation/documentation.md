# Infopiste application

Application in development with the goal of showing useful information relevant to Exactum on an info screen.

This file describes how to run the application, the structure of it, and the methods used in development.

## Running the application

The application can be run with Docker.

First, the repository should be cloned to the user's local machine:

`git clone https://github.com/Infopisteprojekti/infopiste.git`

Then, in the root of the project, run

`docker compose up`.

The frontend can then be accessed at `http://localhost:3000`.

The backend address is `http://localhost:1234`.
It currently offers the test endpoint `/api/hello`.

The application is also running on the staging server at https://infopiste-frontend-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi/.

Whenever new content is pushed to the `main` branch, it takes a maximum of 15 minutes for the staging server to be updated.

## Running the application in development mode

Development mode allows the application to be developed while running the containers.

Run the application in development mode with command:

`docker compose -f docker-compose.dev.yaml up -d`

The frontend can then be accessed at `http://localhost:5173`.

Shut down the application with command:

`docker compose down`

Delete volumes with command:

`docker compose down -v`

## Structure and technologies used

The frontend and backend are separated into different directories, `root/frontend/` and `root/backend/`. Additionally, the backend includes the `database` directory.

The frontend is built with React. The backend is built with Express, and the database of choice is Mongo. Mongoose is used to connect to the database through the backend `server.js` file.

Docker is used to build the frontend, backend, and database images. Dockerfiles exist for the frontend and backend, and the database is built in `docker-compose.yaml` by using the official `mongo` image.

## Scrum process

The team follows the Scrum development framework.

The backlog can be viewed [here](https://github.com/Infopisteprojekti/infopiste/projects?query=is%3Aopen).

The definition of done for the tasks is as follows:

- Feature's acceptance criteria are met
- Feature has been tested sufficiently, and the tests go through
- Code follows the agreed upon style
- Code has been reviewed
