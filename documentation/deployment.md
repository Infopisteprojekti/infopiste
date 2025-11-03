# Deployment

Whenever new content is pushed or merged into the `main` branch, the files `back.yaml`, `front.yaml`, and `staging-deploy.yaml` are run through GitHub Actions. The purpose of the files is as follows:

`back.yaml` runs the backend tests located in [backend/tests](../backend/tests/). It also does linting.

`front.yaml` similarly runs the frontend tests located in [frontend/tests](../frontend/tests), and also does linting.

Additionally, the end to end tests in [frontend/e2e](../frontend/e2e/) are run in `end-to-end.yaml`. The end to end tests are only run if the workflow or the contents of the frontend directory change.

`staging-deploy.yaml` builds the frontend and backend Docker images, and pushes them to DockerHub.

The configuration for the OpenShift staging server deployment can be found in [manifests](../manifests/). It includes the following:

- `Deployment`s for the frontend, backend, database, and Redis
- `Service`s to create permanent IP addresses for the frontend, backend, database, and Redis
- `Route` to expose the application to the Internet
- `Imagestream`s for the frontend and backend deployments to poll DockerHub for new images
- `PersistentVolumeClaim` for the database and cache

The `frontend-imagestream.yaml` and `backend-imagestream.yaml` files located in [manifests](../manifests/) ensure that the OpenShift deployment uses the updated images. They poll DockerHub every 15 minutes.

# Scrum process

The team follows the Scrum development framework.

The length of a sprint is two weeks.

The backlog can be viewed [here](https://github.com/Infopisteprojekti/infopiste/projects?query=is%3Aopen).

The definition of done for the tasks is as follows:

- Feature's acceptance criteria are met
- Feature has been tested sufficiently, and the tests go through
- Feature has been documented appropriately
- Code follows the agreed upon style
- Code has been reviewed
