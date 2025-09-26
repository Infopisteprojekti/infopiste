# Deployment

Whenever new content is pushed or merged into the `main` branch, the files `back.yaml`, `front.yaml`, and `staging-deploy.yaml` are run through GitHub Actions. The purpose of the files is as follows:

`back.yaml` runs the backend tests located in [backend/tests](../backend/tests/). It also does linting.

`front.yaml` similarly runs the frontend tests located in [frontend/tests](../frontend/tests), and also does linting.

`staging-deploy.yaml` builds the frontend and backend Docker images, and pushes them to DockerHub. 

The configuration for the OpenShift staging server deployment can be found in [manifests](../manifests/). It includes the following:

- `Deployment`s for the frontend, backend, and database
- `Service`s to create permanent IP addresses for the frontend, backend, and database.
- `Route`s to expose the frontend and backend to the Internet
- `Imagestream`s for the frontend and backend deployments to poll DockerHub for new images

The `frontend-imagestream.yaml` and `backend-imagestream.yaml` files located in `[manifests](../manifests/) ensure that the OpenShift deployment uses the updated images. They poll DockerHub every 15 minutes.

The frontend can be accessed at https://infopiste-frontend-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi/.

The backend can be accessed at https://infopiste-backend-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi/.

# Scrum process

The team follows the Scrum development framework.

The length of a sprint is two weeks.

The backlog can be viewed [here](https://github.com/Infopisteprojekti/infopiste/projects?query=is%3Aopen).

The definition of done for the tasks is as follows:

- Feature's acceptance criteria are met
- Feature has been tested sufficiently, and the tests go through
- Code follows the agreed upon style
- Code has been reviewed
