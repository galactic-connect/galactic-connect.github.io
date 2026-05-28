---
description: Common git operations for the website repo via the galactic-connect Docker container
agent: product-owner
---

# /site-git

Run common git operations for the **website repo** inside the Docker container `galactic-connect`.

## Constraints

- Run git commands only inside the `galactic-connect` container.
- Operate only in `/opt/site`.
- Never print secrets (tokens, credentials) in output.

## Commands

- Status: `docker exec -i galactic-connect bash -lc 'cd /opt/site && git status --porcelain'`
- Branch: `docker exec -i galactic-connect bash -lc 'cd /opt/site && git branch --show-current'`
- Diff: `docker exec -i galactic-connect bash -lc 'cd /opt/site && git diff'`
- Log: `docker exec -i galactic-connect bash -lc 'cd /opt/site && git log --oneline -10'`
- Fetch: `docker exec -i galactic-connect bash -lc 'cd /opt/site && git fetch --prune'`
- Pull (ff-only): `docker exec -i galactic-connect bash -lc 'cd /opt/site && git pull --ff-only'`

## Container lifecycle

- Check: `docker compose ps`
- Start: `docker compose up -d --build`
