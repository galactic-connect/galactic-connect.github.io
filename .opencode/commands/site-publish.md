---
description: Commit and push website changes via the galactic-connect Docker container
agent: product-owner
---

# /site-publish

Commit and push changes for the **website repo** (this folder) by running git inside the Docker container `galactic-connect`.

## Arguments

- `message`: Commit message (required). Example: `"Add Windows MSIX tile"`.

## Constraints

- Run git commands only inside the `galactic-connect` container.
- Operate only in `/opt/site`.
- Never print secrets (tokens, credentials) in output.

## Workflow

1. Verify container is running:
   - `docker compose ps`
   - If it is not up: `docker compose up -d --build`

2. Pre-flight (inside container):
   - `docker exec -i galactic-connect bash -lc 'cd /opt/site && git branch --show-current && git status --porcelain'`
   - If there are no changes, stop and report "nothing to publish".

3. Stage + review:
   - `docker exec -i galactic-connect bash -lc 'cd /opt/site && git add -A && git diff --cached --stat'`

4. Commit:
   - `docker exec -i galactic-connect bash -lc 'cd /opt/site && git commit -m <message>'`

5. Push:
   - `docker exec -i galactic-connect bash -lc 'cd /opt/site && git push origin HEAD'`

6. Report:
   - `docker exec -i galactic-connect bash -lc 'cd /opt/site && git log --oneline -1'`
