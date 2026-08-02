# DeployButton
Auto git pull, build and deploy

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
docker compose up --build
```

This starts three containers (`backend`, `frontend`, `nginx`) and exposes the app on
`http://localhost:8080`. SQLite data persists in the `backend-data` volume.

Two default workflow templates are seeded on first boot ("React App via CapRover" and
"Node/Docker Backend via CapRover") — open a project's assigned workflow in the **Workflows**
tab and fill in your real repo path and CapRover trigger-build webhook URL/token before using them.

The backend container mounts `/srv/repos` (where workflow steps `cd` into per-project repos) and
`/var/run/docker.sock` (for `docker_build` steps) from the host — adjust the `/srv/repos` bind
mount in `docker-compose.yml` if your repos live elsewhere.
