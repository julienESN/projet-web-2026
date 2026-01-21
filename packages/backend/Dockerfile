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

# Build lib/contracts (backend en dépend via file:../../lib/contracts)
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

WORKDIR /app/packages/backend
# Generate only Prisma client (skip ERD generator that requires Puppeteer)
RUN npx prisma generate --generator client
RUN npm run build

# ---- prod ----
FROM node:22-alpine AS prod
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY packages/backend/package.json ./
COPY --from=build /app/packages/backend/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/backend/prisma ./prisma
COPY --from=build /app/packages/backend/prisma.config.ts ./prisma.config.ts
# Copy the generated Prisma client
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma/client ./node_modules/@prisma/client
# contracts (file:../../lib/contracts) : nécessaire pour require('contracts')
COPY --from=build /app/lib/contracts/package.json ./lib/contracts/
COPY --from=build /app/lib/contracts/dist ./lib/contracts/dist

EXPOSE 3000
CMD ["node", "dist/src/main.js"]
