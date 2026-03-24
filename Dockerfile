# ---------- BUILD ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- PRODUÇÃO ----------
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# copia só o necessário
COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["node", "build/app.js"]