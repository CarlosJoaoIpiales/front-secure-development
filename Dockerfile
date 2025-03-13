# Usar una imagen de Node.js para construir la aplicación
FROM node:18 AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de la aplicación
COPY package*.json ./
RUN npm install
COPY . .

# Construir la aplicación Angular
RUN npm run build --prod

# Usar una imagen de Nginx para servir la aplicación
FROM nginx:alpine
COPY --from=build /app/dist/sakai-ng /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]