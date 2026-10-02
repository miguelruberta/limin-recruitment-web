# syntax=docker/dockerfile:1

# ---------- Dependencies ----------
FROM node:22-alpine AS deps
WORKDIR /app

# Lockfile beserta seluruh package.json workspace wajib ikut agar `npm ci` sinkron.
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

RUN npm ci --omit=dev --workspace backend

# ---------- Runtime ----------
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=app:app package.json ./
COPY --chown=app:app backend ./backend

WORKDIR /app/backend
RUN mkdir -p uploads && chown -R app:app uploads

USER app
EXPOSE 3000

CMD ["node", "src/server.js"]
