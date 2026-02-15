# Image Node legere pour executer le frontend
FROM node:20-slim

# Dossier de travail dans le conteneur
WORKDIR /app

# Copie package.json + package-lock.json (si present) pour installer les deps
COPY package*.json ./
# Installe toutes les dependances (dev incluses, necessaires pour Vite en dev)
RUN npm ci

# Copie le code source du frontend
COPY . .

# Le conteneur expose le port Vite
EXPOSE 5173

# Lance Vite en ecoutant sur toutes les interfaces du conteneur
# (obligatoire pour acceder depuis l'hote via localhost:5173)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
