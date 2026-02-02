# Component Design: Gestao Editais Module (SI.3.3)

## 1. Modularization Strategy
To resolve the complexity of the current `HomePage.vue` (monolithic component), we are applying a **Decomposition** pattern, splitting the page into functional components and extracting business logic into **Composables**.

## 2. Component Diagram

```mermaid
graph TD
    HomePage[HomePage.vue] --> Header[AccessibilityMenu.vue]
    HomePage --> FeatureCards[HomeFeatureCards.vue]
    HomePage --> EditalSection[EditalListingSection.vue]
    
    EditalSection --> SearchFilters[EditalFilters.vue]
    EditalSection --> List[EditalList.vue]
    EditalSection --> Pagination[EditalPagination.vue]
    
    EditalSection --> DetailModal[EditalDetailModal.vue]
    
    subgraph Logic "Composables"
    useEditais[useEditais.ts]
    useEditalActions[useEditalActions.ts]
    end
    
    EditalSection --> useEditais
    DetailModal --> useEditalActions
```

## 3. Modular Breakdown

### 3.1 Components
| Component | Responsibility |
| :--- | :--- |
| `HomePage.vue` | Main layout orchestrator. Handles top-level routing and structural layout. |
| `HomeFeatureCards.vue` | Display navigation cards for Management, Metrics, and History. |
| `EditalListingSection.vue` | Container for the listing page logic. |
| `EditalList.vue` | Renders the list of edital cards. |
| `EditalFilters.vue` | Handles search input and status dropdown. |
| `EditalDetailModal.vue` | Handles both View and Inline Edit modes for a specific edital. |

### 3.2 Composables (Logic Extraction)
| Composable | Responsibility |
| :--- | :--- |
| `useEditais.ts` | State for `editais`, `isLoading`, `searchQuery`, `statusFilter`, and Pagination logic. |
| `useEditalActions.ts` | Logic for `openModal`, `closeModal`, `saveEdital`, `deleteEdital`, and `refreshList`. |

## 4. Design Patterns Applied
- **Container/Presenter Pattern**: `HomePage` acts as a container, delegating rendering to smaller components.
- **Composition API Logic Extraction**: Decoupling Vue lifecycle and state from the template.
- **Single Responsibility Principle (SRP)**: Each new component handles one specific part of the UI.
