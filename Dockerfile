# Estágio de build
FROM node:20-alpine as build-stage
WORKDIR /app
<<<<<<< HEAD
COPY package*.json ./
RUN npm ci
=======

# Copiar package files
COPY package*.json ./
RUN npm ci

# Copiar código fonte
>>>>>>> develop
COPY . .
RUN npm run build

<<<<<<< HEAD
# Estágio de produção
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
=======
# Definir variável de ambiente para build
ENV VITE_API_BASE_URL=http://localhost:8002

# Build da aplicação (sem verificação de tipos para Docker)
RUN npm run build:docker

# Estágio de produção
FROM nginx:stable-alpine as production-stage

# Copiar arquivos buildados
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx-simple.conf /etc/nginx/conf.d/default.conf

# Expor porta
EXPOSE 80

# Comando para iniciar nginx
>>>>>>> develop
CMD ["nginx", "-g", "daemon off;"]
