# AI Constitution - Horizon ETL Project

This document defines the fundamental rules and standards that any AI Agent working on this project must follow.

## 1. Architectural Rules (Senior Designer)

### 1.1 Modularization & Refactoring (MANDATORY)
- **Monolith Prevention**: Avoid creating monolithic components or modules. A `.vue` or `.py` file should ideally not exceed **300 lines**. If it does, refactor immediately by extracting components or logic.
- **Separation of Concerns (SoC)**:
    - **UI Layer**: Only handles presentation and user interaction.
    - **Logic Layer (Composables/Hooks)**: Handles business logic and state management.
    - **Service Layer**: Handles API calls and data transformation.
- **Dry Principle**: Never duplicate logic. Use shared composables or utilities.

### 1.2 Design Patterns
- **Service-Repository Pattern (Frontend)**: Logic is NOT written inside `.vue` files. Pages call Stores, Stores call Services, and Services call the API Client.
- **Strategy Pattern (MANDATORY)**: Apply the Strategy Pattern when multiple algorithms or behaviors are required for a specific task.
- **Dependency Injection**: Always inject implementations and strategies via constructors or provide/inject mechanisms.

---

## 2. Testing Rules (Senior QA)

### 2.1 Test-Driven Development (TDD)
- **MANDATORY**: Implement test cases defined in the `implementation_plan.md` **BEFORE** the implementation code.
- **Coverage**: Every new feature, logic branch, or bugfix must have corresponding tests in the `tests/` directory.

### 2.2 Testing Framework & Patterns
- **Pytest**: Use `pytest` for all tests.
- **Mocking**: Use `unittest.mock` (MagicMock, patch) to isolate units.
- **No Side Effects**: Tests must NEVER reach out to real external services (Supabase, external APIs) or permanent storage. Mock all adapters/ports.
- **AAA Pattern**: Follow the Arrange-Act-Assert pattern for clarity.
- **Cleanup**: Ensure temporary test files or local states are deleted after test execution.

---

## 3. Process & Quality Standards (Senior PM)

### 3.1 Agile & Project Management
- **@agile-standards**: Follow the `.agent/workflows/agile-standards.md` workflow strictly.
- **Documentation First**: Update `PM` (Project Management) and `SI` (System Identification) documents in `docs/` before implementing any feature.
- **Issue Tracking**: Every task must be linked to a GitHub Issue (Epic -> User Story -> Task).

### 3.2 Code Quality
- **Type Hinting**: All Python functions must have full type annotations.
- **Docstrings**: Use Google-style docstrings for all modules, classes, and functions.
- **Linting**: Ensure code passes `black`, `flake8`, and `isort`.
- **Observability (MANDATORY)**: All critical actions and state changes MUST be logged (Info/Error) with appropriate context.

### 3.3 GitHub Interaction
- **MCP Usage**: Use `github-mcp-server` for all remote operations (PRs, Issues, Releases, Branches).
- **GitFlow**: Follow the `main` -> `developing` -> `feature/fix` branching strategy.

---

## 4. Proactiveness & Communication

- **Question Decisions**: If a requirement is ambiguous or if a design violates these rules, the AI must question the user.
- **Technical Proposals**: Always provide a technical plan in `implementation_plan.md` and wait for approval before coding.
- **Walkthroughs**: After completing a task, provide a `walkthrough.md` with proof of work, including test results and (if applicable) screenshots/recordings.
