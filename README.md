# Shift scheduler

## Docker deployment

Copy the environment template, then configure the server address, ports and secrets:

```bash
cp .env.example .env
docker compose up -d --build
```

Example for a server available at `203.0.113.10:8080`:

```dotenv
SERVER_IP=0.0.0.0
WEB_PORT=8080
API_PORT=3001
WEB_ORIGIN=http://203.0.113.10:8080
```

`SERVER_IP` is the interface Docker binds to. `WEB_ORIGIN` is the public URL opened in the browser. Keep `POSTGRES_BIND_IP=127.0.0.1` unless remote database access is explicitly required.

For HTTPS behind a reverse proxy, set `WEB_ORIGIN=https://your-domain.example` and `COOKIE_SECURE=true`. Change `JWT_SECRET`, `POSTGRES_PASSWORD` and `ADMIN_PASSWORD` before production startup.
