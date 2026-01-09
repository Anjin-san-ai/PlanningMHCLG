# MHCLG Planning Hub

A React-based web application for the Ministry of Housing, Communities & Local Government (MHCLG) Planning department. This application provides a unified interface for accessing various planning systems and AI-powered agents.

## Features

- **Login Authentication**: Secure session-based login
- **Dashboard**: Overview with statistics and quick access to planning systems
- **Planning Systems**: Integration points for PLANX, BOPS, IDOX, ARCUS, EXTRACT, and AWP
- **AI Agents**: Planning Agent and Summarise Agent powered by [Neuro SAN](https://github.com/cognizant-ai-lab/neuro-san-studio)
- **Responsive Design**: Works on desktop and mobile devices
- **Azure-Ready**: Docker containerised for easy Azure deployment

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- React Router (navigation)
- CSS Modules (styling)
- [Neuro SAN Studio](https://github.com/cognizant-ai-lab/neuro-san-studio) (AI agents)
- Docker + Nginx (deployment)

## Prerequisites

- Node.js 18+ 
- npm 9+
- Docker & Docker Compose (for full deployment with AI agents)
- OpenAI API Key (for Neuro SAN)

## Local Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Login Credentials

Use the following credentials to log in:

- **Username**: `planning_officer`
- **Password**: `planning_officer`

### Build for Production

```bash
npm run build
```

## AI Agents with Neuro SAN

This application integrates with [Cognizant's Neuro SAN Studio](https://github.com/cognizant-ai-lab/neuro-san-studio) for AI-powered planning assistance.

### Running with Neuro SAN (Full Stack)

1. Set your OpenAI API key:

```bash
export OPENAI_API_KEY="your-openai-api-key"
```

2. Start all services with Docker Compose:

```bash
docker-compose up --build
```

This will start:
- **Frontend**: http://localhost:3000 - The MHCLG Planning Hub UI
- **Neuro SAN Server**: http://localhost:30011 - AI Agent Server
- **NSFlow UI**: http://localhost:4173 - Neuro SAN Studio interface

### Agent Networks

The application includes two custom agent networks:

| Agent | Description | Use Case |
|-------|-------------|----------|
| **Planning Agent** | Expert in UK planning applications, regulations, and processes | Ask questions about planning permissions, required documents, timelines |
| **Summarise Agent** | Document analysis and summarisation specialist | Summarise planning documents, extract key requirements |

### Agent Configuration

Agent configurations are stored in `neuro-san/registries/`:

- `mhclg_planning_agent.hocon` - Planning expertise agent network
- `mhclg_summarise_agent.hocon` - Document summarisation agent network
- `registry.hocon` - Agent registry configuration

## Docker Deployment

### Frontend Only

```bash
docker build -t mhclg-planning:latest .
docker run -p 8080:80 mhclg-planning:latest
```

### Full Stack with AI Agents

```bash
# Set environment variables
export OPENAI_API_KEY="your-key"

# Build and run all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

## Azure Deployment

### Option 1: Azure Container Apps (Recommended)

1. Push the Docker image to Azure Container Registry:

```bash
# Login to Azure
az login

# Create a resource group (if needed)
az group create --name mhclg-planning-rg --location uksouth

# Create Azure Container Registry
az acr create --resource-group mhclg-planning-rg --name mhclgplanningacr --sku Basic

# Login to ACR
az acr login --name mhclgplanningacr

# Tag and push the image
docker tag mhclg-planning:latest mhclgplanningacr.azurecr.io/mhclg-planning:latest
docker push mhclgplanningacr.azurecr.io/mhclg-planning:latest
```

2. Deploy to Azure Container Apps:

```bash
# Create Container Apps environment
az containerapp env create \
  --name mhclg-planning-env \
  --resource-group mhclg-planning-rg \
  --location uksouth

# Create the container app
az containerapp create \
  --name mhclg-planning \
  --resource-group mhclg-planning-rg \
  --environment mhclg-planning-env \
  --image mhclgplanningacr.azurecr.io/mhclg-planning:latest \
  --target-port 80 \
  --ingress external \
  --registry-server mhclgplanningacr.azurecr.io
```

### Option 2: Azure App Service

1. Create an App Service Plan:

```bash
az appservice plan create \
  --name mhclg-planning-plan \
  --resource-group mhclg-planning-rg \
  --sku B1 \
  --is-linux
```

2. Create a Web App with Docker:

```bash
az webapp create \
  --resource-group mhclg-planning-rg \
  --plan mhclg-planning-plan \
  --name mhclg-planning-app \
  --deployment-container-image-name mhclgplanningacr.azurecr.io/mhclg-planning:latest
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── AgentChat/       # AI chat panel (Neuro SAN integration)
│   │   ├── Header/          # Top navigation bar
│   │   ├── Sidebar/         # Left sidebar with agent buttons
│   │   ├── WidgetCard/      # Planning system cards
│   │   └── ProtectedRoute.tsx
│   ├── context/
│   │   └── AuthContext.tsx  # Authentication state
│   ├── pages/
│   │   ├── LoginPage.tsx    # Login screen
│   │   └── Dashboard.tsx    # Main dashboard
│   ├── services/
│   │   └── neuroSanApi.ts   # Neuro SAN API client
│   ├── styles/
│   │   └── variables.css    # CSS custom properties
│   ├── App.tsx              # Main app with routing
│   └── main.tsx             # Entry point
├── neuro-san/
│   ├── registries/          # Agent network configurations
│   └── Dockerfile           # Neuro SAN container
├── public/
│   └── crown-logo.svg       # Crown logo
├── docker-compose.yml       # Multi-service orchestration
├── Dockerfile               # Frontend Docker build
├── nginx.conf               # Nginx configuration
└── package.json
```

## Planning Systems

| System | Description | Status |
|--------|-------------|--------|
| PLANX | Digital planning application system | Active |
| BOPS | Back Office Planning System | Active |
| IDOX | Document management and public access | Active |
| ARCUS | Environmental planning and sustainability | Beta |
| EXTRACT | Data extraction and analytics | Active |
| APD | Augmented Planning Decisions | Active |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for Neuro SAN | Required |
| `VITE_NEURO_SAN_URL` | Neuro SAN REST API URL | `http://localhost:30011` |
| `VITE_NEURO_SAN_WS_URL` | Neuro SAN WebSocket URL | `ws://localhost:30011` |

## License

Crown Copyright. All rights reserved.
