FROM node:22-alpine AS base
WORKDIR /app

# ---- deps (backend + lib/contracts) ----
FROM base AS deps
WORKDIR /build

# Copier uniquement les manifests pour maximiser le cache Docker
COPY package/backend/package.json package/backend/package-lock.json ./package/backend/
COPY lib/contracts/package.json lib/contracts/package-lock.json ./lib/contracts/

RUN cd /build/lib/contracts && npm ci
RUN cd /build/package/backend && npm ci

# ---- build ----
FROM base AS build
WORKDIR /app

COPY . .

# Réutiliser les node_modules installés
COPY --from=deps /build/lib/contracts/node_modules ./lib/contracts/node_modules
COPY --from=deps /build/package/backend/node_modules ./package/backend/node_modules

WORKDIR /app/package/backend
RUN npm run build

# ---- prod ----
FROM node:22-alpine AS prod
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package/backend/package.json package/backend/package-lock.json ./
COPY --from=build /app/package/backend/dist ./dist
COPY --from=deps /build/package/backend/node_modules ./node_modules
COPY --from=build /app/package/backend/prisma ./prisma
COPY --from=build /app/package/backend/prisma.config.ts ./prisma.config.ts

EXPOSE 3000
CMD ["node", "dist/main.js"]

