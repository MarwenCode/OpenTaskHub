# Image Node legere pour executer l'API
FROM node:20-slim

# Dossier de travail dans le conteneur
WORKDIR /app

# Copie package.json + package-lock.json (si present)
# Cette etape est separee pour profiter du cache Docker
COPY package*.json ./
# Installe uniquement les dependances de production
RUN npm ci --omit=dev

# Copie le code source du backend
COPY . .

# Variable d'environnement par defaut dans le conteneur
ENV NODE_ENV=production
# Port interne ecoute par l'API
EXPOSE 5000

# Commande de demarrage du serveur Node
CMD ["npm", "start"]
