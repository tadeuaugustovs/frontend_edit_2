# Frontend Architecture (SI.3.1)

## 1. Overview
This document details the architectural design of the Frontend application (`vue-edital-frontend`), built with **Vue 3**, **TypeScript**, and **Vite**. It follows a **Domain-Driven/Feature-Based Modular Architecture** to ensure scalability and separation of concerns.

## 2. Technology Stack
*   **Framework**: Vue 3 (Composition API)
*   **Build Tool**: Vite
*   **Language**: TypeScript
*   **State Management**: Pinia
*   **Routing**: Vue Router
*   **Styling**: Tailwind CSS (v3.4+)
*   **HTTP Client**: Axios (Custom Wrapper)
*   **Visualization**: ECharts / Chart.js

## 3. Architecture Diagrams (Mermaid)

### 3.1 High-Level Component Flow
This diagram illustrates how a user action traverses the frontend layers to reach the backend.

```mermaid
graph LR
    User((User)) --> View[View Component]
    View --> Store[Pinia Store]
    Store --> Service[Service Layer]
    Service --> API[API Client\n(src/common/api)]
    API --> Backend[(Django Backend)]
    API -.-> Mock[(Node.js Fake Backend\nPort 8001)]
    
    subgraph Frontend Scope
    View
    Store
    Service
    API
    end
```

### 3.2 Module Dependency Graph
The application is divided into independent feature modules that rely on a shared core.

```mermaid
graph TD
    subgraph Modules
    Auth[Module: Autenticacao]
    Editais[Module: Gestao Editais]
    Metricas[Module: Metricas]
    Historico[Module: Historico]
    end

    subgraph Core "src/common"
    Router[Global Router]
    API[API Client]
    Components[Global Components]
    Utils[Utils & Hosts]
    end

    Auth --> API
    Editais --> API
    Metricas --> API
    Historico --> API
    
    Router --> Auth
    Router --> Editais
    Router --> Metricas
    Router --> Historico
```

## 4. Directory Structure (`src/`)

### 4.1 `src/modules/` (Feature Definition)
Each folder here represents a distinct business domain.
*   **Structure**:
    *   `router.ts`: Route definitions specific to the module.
    *   `views/`: Page components (Smart Components).
    *   `components/`: Module-specific UI components (Dumb Components).
    *   `services/`: API calls relevant ONLY to this module.
    *   `store/`: Pinia stores for local module state.

### 4.2 `src/common/` (The Core)
Shared resources used across the entire application.
*   **`api/`**: 
    *   `client.ts`: The singleton Axios instance with Interceptors for JWT Injection and Token Refresh.
    *   `auth.service.ts`: Core authentication logic.
*   **`components/`**: Atomic UI components (Buttons, Inputs, Modals) used globally.
*   **`router/`**: The main entry point (`index.ts`) that aggregates all module routes and handles Navigation Guards.

## 5. Key Design Patterns

### 5.1 Service-Repository Pattern (Frontend Adaptation)
Logic is NOT written inside `.vue` files. 
*   **View**: Calls a Store action.
*   **Store**: Manages state and calls a Service.
*   **Service**: Makes the actual HTTP request using `api/client.ts`.

### 5.2 Interceptor-Based Auth
Authentication is handled transparently via `src/common/api/client.ts`.
*   **Request Interceptor**: Adds `Authorization: Token xyz`.
*   **Response Interceptor**: Catches `401 Unauthorized`, pauses requests, attempts to refresh token via `refresh_token`, and retries original requests.

## 6. Development Guidelines
1.  **New Feature**: Create a folder in `src/modules/<feature-name>`.
2.  **State**: If data is shared between pages of the module, use a Pinia store.
3.  **Styling**: Use utility classes (Tailwind) in template`. Avoid `<style>` blocks unless doing complex animations.

## 7. API Contracts (Swagger/OpenAPI)
The backend API contracts are maintained as modular Swagger files in the `contracts/` directory.
*   **Location**: `contracts/<module>/swagger.json`.
*   **Modules**:
    *   `contracts/edital/swagger.json`: Definitions for the Edital Management module.
    *   `contracts/core/swagger.json`: Definitions for Core entities and Authentication.
*   **Usage**: These files serve as the source of truth for API integration. Frontend services must strictly adhere to the schemas defined here.
