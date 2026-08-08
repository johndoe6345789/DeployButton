# DeployButton
Auto git pull, build and deploy

[![CI](https://github.com/johndoe6345789/DeployButton/actions/workflows/ci.yml/badge.svg)](https://github.com/johndoe6345789/DeployButton/actions/workflows/ci.yml)

A self-hosted, one-click deploy dashboard that sits in front of [CapRover](https://caprover.com/)
on a home server. Define reusable deploy **workflows** (git pull, install, build, trigger a
CapRover webhook, etc.) in the admin panel, then trigger them with a click or a GitHub push webhook.

- **Backend**: C++ / [Drogon](https://github.com/drogonframework/drogon), SQLite, built with Conan + CMake.
- **Frontend**: Next.js (TypeScript, App Router), the workflow designer.
- **nginx**: reverse-proxies `/api/*` to the backend and everything else to the frontend, so
  the whole app is one origin/port.

No login is built in — this is meant to run behind Tailscale / a Cloudflare Tunnel, which is
the access boundary.

## Running it

```sh
docker compose up --build -d
```

This starts nginx plus the initial `backend-blue`/`frontend-blue` pair and exposes the app on
`http://localhost:8080`. SQLite data persists in the `deploybutton-backend-data` volume.

Two default workflow templates are seeded on first boot ("React App via CapRover" and
"Node/Docker Backend via CapRover") — open a project's assigned workflow in the **Workflows**
tab and fill in your real repo path and CapRover trigger-build webhook URL/token before using them.

The backend container mounts `/srv/repos` (where workflow steps `cd` into per-project repos) and
`/var/run/docker.sock` (for `docker_build` steps, and for the `blue_green_deploy` step below) from
the host — adjust the `/srv/repos` bind mount in `docker-compose.yml` and `docker-compose.app.yml`
if your repos live elsewhere.

## Self-deploying DeployButton

DeployButton can deploy itself: check this repo out to `/srv/repos/deploybutton` (or wherever you
pointed the `/srv/repos` mount) and give its project a workflow with a `git_pull` step followed by
a `blue_green_deploy` step (`cwd` set to that same path).

Running that workflow builds and starts whichever slot isn't currently live (`blue`/`green`)
*alongside* the one currently serving traffic, waits for its `/api/health` endpoint to respond,
then flips nginx over to it and tears down the old slot — all without nginx (or nginx's
connections) ever going down. If the new build fails, or never becomes healthy, the currently
running slot is left untouched and the deploy just fails. See
[docker-compose.app.yml](docker-compose.app.yml) and
[backend/engine/SelfDeployStep.cc](backend/engine/SelfDeployStep.cc) for how the two slots
coexist and hand off.

## CI / images

Every push and PR to `main` runs `.github/workflows/ci.yml`: frontend type-check/lint/build,
`docker compose config` validation, and a build of all three Docker images. On push to `main`,
the same images are also published to GHCR:

- `ghcr.io/johndoe6345789/deploybutton-backend`
- `ghcr.io/johndoe6345789/deploybutton-frontend`
- `ghcr.io/johndoe6345789/deploybutton-nginx`

tagged `latest` and with the commit SHA, so you can pull pre-built images on your home server
instead of building from source there.
