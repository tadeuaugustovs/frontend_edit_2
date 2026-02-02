# SI.3 - Product Backlog

## Epics
### E1: Authentication & Identity
*   **Status**: Done

### E2: Edital Management
*   **Status**: In Progress
*   **Goal**: Full lifecycle management of public notices.

### E3: Analytics & Reporting
*   **Status**: Planned

### E4: Technical Foundation
*   **Status**: In Progress
*   **Goal**: Ensure robust development environment and API contracts.

## User Stories (Refined)

### TS-001: Modular Swagger Contracts
*   **Description**: Split monolithic contracts into per-module JSONs (Core, Edital).
*   **GitHub Issue**: [#Mock-1]
*   **Status**: Done

### TS-002: Fake Backend Server
*   **Description**: Node.js server to run frontend without Django, using Swagger contracts.
*   **GitHub Issue**: [#Mock-2]
*   **Status**: Done

### US-101: Create Edital
*   **As a** Manager, **I want** to publish a new Edital, **so that** applicants can see it.
*   **AC1**: Must allow PDF upload.
*   **AC2**: Title is mandatory.
*   **GitHub Issue**: [#2]
*   **Status**: Done

### US-103: List Editais
*   **As a** Manager, **I want** to see a list of all Editais, **so that** I can manage them.
*   **AC1**: Show Title, ID, Status and Description.
*   **AC2**: Support filtering by status and search by title/description.
*   **GitHub Issue**: [#1]
*   **Status**: In Progress

### TASK-101: Modularize HomePage.vue
*   **Objective**: Refactor the monolithic `HomePage.vue` into smaller, reusable components and composables.
*   **Pattern**: Component-Based Architecture + Composition API Composables.
*   **GitHub Issue**: [#3]
*   **Status**: In Progress
