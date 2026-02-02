---
name: Vue & API Security Expert
description: Specialized guidelines for secure Vue 3 development and robust API integration.
---

# Vue & API Security Specialized Skill

This skill provides mandatory guidelines for developing secure, high-performance Vue 3 applications and ensuring safe communication with backend APIs.

## 1. Vue 3 Development Standards

### Component-Based Architecture
- **Modularity**: Components MUST NOT exceed 300 lines. Break down complex views into reusable UI components (`/components`) and specialized layout pieces.
- **Composition API**: Use the `<script setup>` syntax for all new components.
- **Composables**: Extract business logic into composables (`/composables`) to ensure reusability and testability. Logic MUST be decoupled from the UI.
- **Props & Emits**: Follow strict "One-Way Data Flow". Use `:model-value` + `@update:model-value` instead of mutating props directly. Avoid `v-model` on props unless using a defined proxy.

### State Management
- Use **Pinia** for global state.
- Keep stores focused on specific domains (e.g., `auth`, `ui`, `edital`).
- Persist sensitive data (tokens) securely in `localStorage` or `sessionStorage` with appropriate security headers.

## 2. API Security Guidelines

### Authentication & Authorization
- **JWT Handling**: Store access tokens and refresh tokens securely. 
- **Token Injection**: Use Axios interceptors to automatically inject `Authorization: Token <token>` (or `Bearer`) headers.
- **Auto-Refresh**: Implement interceptors that handle `401 Unauthorized` responses by attempting a token refresh or redirecting to login.

### Data Protection
- **XSS Prevention**: Always use Vue's built-in escaping (`{{ }}`). Use `v-html` ONLY with sanitized content.
- **Sanitization**: Sanitize user inputs before sending them to the API, especially for rich text or metadata keys.
- **Sensitive Data**: Never log sensitive data like passwords or full tokens in console logs (especially in production).

### Error Handling
- **Graceful Failure**: Use global error handlers or UI-level catch blocks to show user-friendly messages instead of raw stack traces.
- **Status Mapping**: Map HTTP status codes (400, 401, 403, 404, 500) to specific UI states.

## 3. Best Practices for API Clients
- **Service Pattern**: Always use a dedicated service layer (`/services`) or a centralized API client (`apiClient`).
- **Swagger/OpenAPI Alignment**: Payloads MUST match the definitions in `swagger.json` contracts.
- **Mocking**: During development, use a fake server that respects the established API contracts.

## 4. UI/UX & Accessibility (WCAG)
- **Contrast**: Ensure text/background contrast ratios meet WCAG 2.1 AA (4.5:1 for normal text).
- **Semantics**: Use appropriate HTML tags (`<header>`, `<main>`, `<button>`, `<nav>`).
- **Interactivity**: Ensure all interactive elements are keyboard-accessible.
