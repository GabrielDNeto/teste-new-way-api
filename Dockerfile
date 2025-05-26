# Stage 1: Build
FROM node:20-alpine as builder

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install --production=false

# Copia o restante do código
COPY . .

# Gera o Prisma Client (importante ser antes do build)
RUN npx prisma generate

# Compila o NestJS
RUN npm run build


# Stage 2: Production
FROM node:20-alpine as production

WORKDIR /app

# Copia apenas arquivos necessários para produção
COPY package*.json ./
RUN npm install --production

# Copia os arquivos construídos e Prisma Client gerado
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production

EXPOSE 3001

COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

CMD ["./entrypoint.sh"]