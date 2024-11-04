# Documentation technique de la plateforme Hackathon AI

## Table des matières
1. [Pile technologique](#technology-stack)
2. [Présentation de l'architecture](#architecture-overview)
3. [Fonctionnalités principales](#core-features)
4. [Intégration de l'IA](#ai-integration)
5. [Schéma de la base de données](#database-schema)
6. [Documentation de l'API](#api-documentation)
7. [Sécurité](#security)
8. [Guide de déploiement](#deployment-guide)

## Pile technologique

### Frontend
- **Framework** : Angular 18
- **Composants d'interface utilisateur** : composants personnalisés avec Tailwind CSS
- **Gestion de l'état** : RxJS avec services
- **Client HTTP** : Angular HttpClient
- **Authentification** : JWT avec token d'actualisation

### Backend
- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de données** : PostgreSQL avec Sequelize ORM
- **Authentification** : JWT (jetons Web JSON)
- **Documentation API** : OpenAPI/Swagger(future)

### Services d'IA
- **Moteur d'analyse** : service d'IA personnalisé pour l'évaluation de projets
- **Intégration** : points de terminaison d'API RESTful

## Présentation de l'architecture

### Architecture du système
```
├── Frontend (Angular SPA)
│   ├── Core
│   │   ├── Authentication
│   │   ├── Guards
│   └── Interceptors
│   ├── Feature
│   │   ├── Hackathons
│   │   ├── Teams
│   │   ├── Projects
│   │   ├── Mentoring
│   │   └── Evaluation
│   └── Shared Module
│
├── Backend (Node.js/Express)
│   ├── API Routes
│   ├── Controllers
│   ├── Models
│   ├── Services
│   │   └── AI Service
│   ├── Middleware
│   └── Utils

│
└── Database (MySQL)
    ├── Users
    ├── Hackathons
    ├── Teams
    ├── Projects
    └── Evaluations
```

### Modèles de conception
- **Architecture basée sur les composants** : interface modulaire avec composants autonomes
- **Modèle de référentiel** : accès à la base de données via des modèles Sequelize
- **Couche de service** : encapsulation de la logique métier
- **Modèle d'observateur** : RxJS pour la gestion réactive de l'état
- **Injection de dépendances** : système DI d'Angular

## Core Features

### 1. Gestion du hackathon
- Création et gestion d'événements de hackathon
- Inscription des participants et constitution des équipes
- Soumission et évaluation des projets(future)
- Analyses et statistiques en temps réel(future)

### 2. Collaboration d'équipe
- Création d'équipe et gestion des membres
- Autorisations basées sur les rôles
- Analyses d'équipe et suivi des progrès
- Planification des sessions de mentorat(future)

### 3. Gestion de projet
- Flux de travail de soumission de projet(future)
- Intégration du contrôle des versions(future)
- Système d'évaluation automatisé(future)
- Visualisé tout les projets selon le role

### 4. Système de mentorat (Not implemented)
- Mise en relation mentor-équipe
- Planification des sessions
- Communication en temps réel
- Suivi des progrès

## AI Integration

### Project Analysis
```typescript
interface ProjectAnalysis {
  score: number;
  feedback: string[];
  analysis: {
    innovation: number;
    feasibility: number;
    impact: number;
    technicalComplexity: number;
    marketPotential: number;
  };
  recommendations: string[];
  similarProjects: {
    id: number;
    name: string;
    similarity: number;
    technologies: string[];
  }[];
}
```

### Fonctionnalités de l'IA(Ongoing)
1. **Évaluation du projet**
- Évaluation de la faisabilité technique
- Notation de l'innovation
- Analyse du potentiel du marché
- Évaluation de la qualité du code

2. **Analyse d'équipe**
- Analyse des écarts de compétences
- Mesures de contribution
- Prédictions de performance
- Notation de la compatibilité de l'équipe

3. **Optimisation du mentorat**
- Algorithme de mise en relation mentor-équipe
- Analyse de l'efficacité de la session
- Suivi des progrès
- Moteur de recommandation


## API Documentation

### Authentication
```typescript
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh-token
POST /api/auth/logout
```

### Hackathons
```typescript
GET    /api/hackathons
POST   /api/hackathons
GET    /api/hackathons/:id
PUT    /api/hackathons/:id
DELETE /api/hackathons/:id
```

### Teams
```typescript
GET    /api/teams
POST   /api/teams
GET    /api/teams/:id
PUT    /api/teams/:id
DELETE /api/teams/:id
POST   /api/teams/:id/members
DELETE /api/teams/:id/members/:userId
```

### Projects
```typescript
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/analyze
POST   /api/projects/:id/evaluate
```

## Security

### Authentification et autorisation
- Authentification basée sur JWT
- Contrôle d'accès basé sur les rôles (RBAC)
- Mécanisme d'actualisation des jetons
- Gestion des sessions

### Protection des données
- Hachage de mot de passe avec bcrypt
- Cryptage HTTPS
- Validation des entrées
- Protection XSS
- Protection CSRF

### Sécurité des API
- Limitation du débit
- Validation des requêtes
- Gestion des erreurs
- Journalisation et surveillance

## Deployment Guide

### Prerequisites
- Node.js 18+
- Mysql 8.3.0
- Angular CLI
- pm2 (for production)

### Environment Variables
```bash
# Server
PORT=3000
NODE_ENV=production
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Database
DB_HOST=localhost
DB_NAME=hackathon_ai
DB_USER=root
DB_PASSWORD=

# AI Service
AI_SERVICE_URL=https://...
AI_SERVICE_KEY=your_api_key
```

### Deployment Steps

1. **Database Setup**
```bash
# Create database
createdb hackathon_ai

# Run migrations
npm run migrate
```

2. **Backend Deployment**
```bash
# Install dependencies
npm install --production

# Build the project
npm run build

# Start the server
pm2 start dist/server.js
```

3. **Frontend Deployment**
```bash
# Install dependencies
npm install

# Build for production
ng build --configuration=production

# Deploy to web server
cp -r dist/* /var/www/html/
```

4. **Nginx Configuration**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Surveillance et maintenance
- Utiliser PM2 pour la gestion des processus
- Configurer la journalisation avec Winston
- Configurer la surveillance avec Prometheus/Grafana
- Sauvegardes régulières de la base de données
- Pipeline de tests automatisé