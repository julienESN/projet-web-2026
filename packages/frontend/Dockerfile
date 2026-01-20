FROM node:22-alpine AS base
WORKDIR /app

# ---- deps : lock à la racine, install, puis build lib/contracts ----
FROM base AS deps
WORKDIR /build

# Récupérer le lock à la racine + manifests des workspaces
COPY package.json package-lock.json ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/
COPY lib/contracts/ ./lib/contracts/

RUN npm ci

# Build lib/contracts (frontend en dépend via file:../../lib/contracts)
RUN cd lib/contracts && npm run build

# ---- build ----
FROM base AS build
WORKDIR /app

# Copier d’abord ce qui impacte npm ci (cache Docker)
COPY package.json package-lock.json ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/
COPY lib/contracts/ ./lib/contracts/

RUN npm ci

# Repo complet
COPY . .

# Réutiliser le build de lib/contracts fait en deps
COPY --from=deps /build/lib/contracts/dist ./lib/contracts/dist

WORKDIR /app/packages/frontend
RUN npm run build

# ---- prod (serve static) ----
FROM node:22-alpine AS prod
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/packages/frontend/dist ./dist
RUN npm install -g serve

EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
