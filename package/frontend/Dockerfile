FROM node:22-alpine AS base
WORKDIR /app

# ---- deps (frontend + lib/contracts) ----
FROM base AS deps
WORKDIR /build

COPY package/frontend/package.json package/frontend/package-lock.json ./package/frontend/
COPY lib/contracts/package.json lib/contracts/package-lock.json ./lib/contracts/

RUN cd /build/lib/contracts && npm ci
RUN cd /build/package/frontend && npm ci

# ---- build ----
FROM base AS build
WORKDIR /app

COPY . .

COPY --from=deps /build/lib/contracts/node_modules ./lib/contracts/node_modules
COPY --from=deps /build/package/frontend/node_modules ./package/frontend/node_modules

WORKDIR /app/package/frontend
RUN npm run build

# ---- prod (serve static) ----
FROM node:22-alpine AS prod
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/package/frontend/dist ./dist
RUN npm install -g serve

EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]

