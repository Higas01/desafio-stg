# Etapa de build
FROM node:24.5.0-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NEXT_PUBLIC_SUPABASE_URL=https://qjsvgpcbzrtkrknosnju.supabase.co \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc3ZncGNienJ0a3Jrbm9zbmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDc0NzAsImV4cCI6MjA3MDE4MzQ3MH0.QAxHdt3MNXhfQel8fbc_gx3HOLthBiMnU-g2byY7a8Y \
    NEXT_PUBLIC_WHATSAPP_NUMBER=+55111111111

RUN npm run build

FROM node:24.5.0-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/next.config.js ./ 
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
