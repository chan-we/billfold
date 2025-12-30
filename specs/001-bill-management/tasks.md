# Tasks: 账单明细管理

**Input**: Design documents from `/specs/001-bill-management/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/openapi.yaml, research.md, quickstart.md

**Tests**: Not explicitly requested - test tasks are not included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Based on plan.md structure: frontend + backend separation

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for both frontend and backend

- [x] T001 Initialize monorepo with pnpm workspaces in package.json
- [x] T002 [P] Create NestJS backend project structure in backend/
- [x] T003 [P] Create React + Vite frontend project structure in frontend/
- [x] T004 [P] Configure TypeScript for backend in backend/tsconfig.json
- [x] T005 [P] Configure TypeScript for frontend in frontend/tsconfig.json
- [x] T006 [P] Configure ESLint and Prettier for backend in backend/.eslintrc.js
- [x] T007 [P] Configure ESLint and Prettier for frontend in frontend/.eslintrc.js
- [x] T008 [P] Create backend environment configuration in backend/.env.example
- [x] T009 [P] Create frontend environment configuration in frontend/.env.example

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Foundation

- [x] T010 Setup MySQL database connection with TypeORM in backend/src/config/database.config.ts
- [x] T011 Create Bill entity with all fields in backend/src/modules/bill/entities/bill.entity.ts
- [x] T012 Create BillType and BillCategory enums in backend/src/modules/shared/enums/bill-type.enum.ts
- [x] T013 [P] Create CurrencyCode enum and display config in backend/src/modules/shared/enums/currency.enum.ts
- [ ] T014 Create database migration for bill table in backend/src/migrations/
- [x] T015 [P] Setup global exception filter in backend/src/common/filters/http-exception.filter.ts
- [x] T016 [P] Setup response interceptor for unified response format in backend/src/common/interceptors/transform.interceptor.ts
- [x] T017 [P] Create validation pipe configuration in backend/src/common/pipes/validation.pipe.ts
- [x] T018 Setup Swagger/OpenAPI documentation in backend/src/main.ts
- [x] T019 Create mock auth guard for development in backend/src/common/guards/auth.guard.ts

### Frontend Foundation

- [x] T020 [P] Setup Axios instance with interceptors in frontend/src/services/api.ts
- [x] T021 [P] Create TypeScript types matching API contracts in frontend/src/types/bill.ts
- [x] T022 [P] Create TypeScript types for API responses in frontend/src/types/api.ts
- [x] T023 [P] Setup React Router configuration in frontend/src/App.tsx
- [x] T024 [P] Create responsive layout wrapper component in frontend/src/components/common/Layout/index.tsx
- [x] T025 [P] Create useResponsive hook for PC/H5 detection in frontend/src/hooks/useResponsive.ts
- [x] T026 [P] Setup Ant Design and Ant Design Mobile providers in frontend/src/main.tsx
- [x] T027 [P] Create currency formatting utility in frontend/src/utils/currency.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - 新增账单明细 (Priority: P1) 🎯 MVP

**Goal**: 用户能够快速记录一笔新的收入或支出

**Independent Test**: 创建一笔新账单并验证其出现在账单列表中

### Backend Implementation for User Story 1

- [x] T028 [US1] Create CreateBillDto with validation in backend/src/modules/bill/dto/create-bill.dto.ts
- [x] T029 [US1] Create BillService with create method in backend/src/modules/bill/bill.service.ts
- [x] T030 [US1] Create BillController with POST /bills endpoint in backend/src/modules/bill/bill.controller.ts
- [x] T031 [US1] Create BillModule and register in app in backend/src/modules/bill/bill.module.ts
- [x] T032 [US1] Implement amount validation (must be > 0) in CreateBillDto
- [x] T033 [US1] Implement billCategory validation (must match billType) in CreateBillDto

### Frontend Implementation for User Story 1

- [x] T034 [P] [US1] Create billService with createBill method in frontend/src/services/billService.ts
- [x] T035 [P] [US1] Create BillForm component for PC in frontend/src/components/BillForm/index.tsx
- [x] T036 [P] [US1] Create BillForm mobile version in frontend/src/components/BillForm/BillFormMobile.tsx
- [x] T037 [US1] Create BillTypePicker component for selecting bill type/category in frontend/src/components/BillForm/BillTypePicker.tsx
- [x] T038 [US1] Create CurrencyPicker component in frontend/src/components/BillForm/CurrencyPicker.tsx
- [x] T039 [US1] Create DatePicker wrapper with proper locale in frontend/src/components/BillForm/DatePicker.tsx
- [x] T040 [US1] Create AddBill page with form integration in frontend/src/pages/Bills/AddBill.tsx
- [x] T041 [US1] Add form validation with error messages in Chinese
- [x] T042 [US1] Add loading state and success feedback for form submission
- [x] T043 [US1] Add route for /bills/add to App.tsx

**Checkpoint**: User Story 1 complete - users can add bills on both PC and H5

---

## Phase 4: User Story 2 - 查看账单列表 (Priority: P1) 🎯 MVP

**Goal**: 用户能够查看、筛选自己的账单列表

**Independent Test**: 查看预置账单数据，验证列表展示和筛选功能

### Backend Implementation for User Story 2

- [x] T044 [US2] Create BillQueryDto for filtering parameters in backend/src/modules/bill/dto/bill-query.dto.ts
- [x] T045 [US2] Create BillResponseDto in backend/src/modules/bill/dto/bill-response.dto.ts
- [x] T046 [US2] Add findAll method with pagination and filtering to BillService in backend/src/modules/bill/bill.service.ts
- [x] T047 [US2] Add GET /bills endpoint with query parameters to BillController
- [x] T048 [P] [US2] Create GET /bill-types endpoint for category list in backend/src/modules/bill/bill.controller.ts
- [x] T049 [P] [US2] Create GET /currencies endpoint for currency list in backend/src/modules/bill/bill.controller.ts

### Frontend Implementation for User Story 2

- [x] T050 [US2] Add getBills method to billService in frontend/src/services/billService.ts
- [x] T051 [P] [US2] Add getBillTypes and getCurrencies methods to billService
- [x] T052 [US2] Create BillList component for PC (table view) in frontend/src/components/BillList/index.tsx
- [x] T053 [US2] Create BillCard component for H5 (card view) in frontend/src/components/BillCard/index.tsx
- [x] T054 [US2] Create BillFilter component for date range and type filtering in frontend/src/components/BillFilter/index.tsx
- [x] T055 [US2] Create Bills list page with responsive layout in frontend/src/pages/Bills/index.tsx
- [x] T056 [US2] Implement pagination for bill list
- [x] T057 [US2] Add empty state component when no bills exist in frontend/src/components/common/EmptyState/index.tsx
- [x] T058 [US2] Add route for /bills (list page) to App.tsx

**Checkpoint**: User Stories 1 & 2 complete - full create and view functionality, MVP ready

---

## Phase 5: User Story 3 - 编辑账单明细 (Priority: P2)

**Goal**: 用户能够修改已记录的账单信息

**Independent Test**: 修改一条已有账单的金额，验证修改后数据正确保存

### Backend Implementation for User Story 3

- [x] T059 [US3] Create UpdateBillDto in backend/src/modules/bill/dto/update-bill.dto.ts
- [x] T060 [US3] Add findOne method to BillService
- [x] T061 [US3] Add update method to BillService
- [x] T062 [US3] Add GET /bills/:id endpoint to BillController
- [x] T063 [US3] Add PUT /bills/:id endpoint to BillController
- [x] T064 [US3] Ensure userId check for authorization in update operation

### Frontend Implementation for User Story 3

- [x] T065 [US3] Add getBillById and updateBill methods to billService in frontend/src/services/billService.ts
- [x] T066 [US3] Create EditBill page reusing BillForm component in frontend/src/pages/Bills/EditBill.tsx
- [x] T067 [US3] Add edit button to BillList and BillCard components
- [x] T068 [US3] Add route for /bills/:id/edit to App.tsx
- [x] T069 [US3] Pre-populate form with existing bill data

**Checkpoint**: User Story 3 complete - users can edit their bills

---

## Phase 6: User Story 4 - 删除账单明细 (Priority: P2)

**Goal**: 用户能够删除错误或不需要的账单记录

**Independent Test**: 删除一条账单，验证其从列表中消失

### Backend Implementation for User Story 4

- [x] T070 [US4] Add softDelete method to BillService in backend/src/modules/bill/bill.service.ts
- [x] T071 [US4] Add DELETE /bills/:id endpoint to BillController
- [x] T072 [US4] Ensure deletedAt filter in findAll query (exclude soft-deleted)

### Frontend Implementation for User Story 4

- [x] T073 [US4] Add deleteBill method to billService in frontend/src/services/billService.ts
- [x] T074 [US4] Create DeleteConfirmModal component in frontend/src/components/common/DeleteConfirmModal/index.tsx
- [x] T075 [US4] Add delete button with confirmation to BillList component
- [x] T076 [US4] Add delete button with confirmation to BillCard component
- [x] T077 [US4] Add success feedback after deletion and refresh list

**Checkpoint**: User Stories 3 & 4 complete - full CRUD functionality

---

## Phase 7: User Story 5 - 统计报表展示 (Priority: P3)

**Goal**: 用户能够通过可视化图表了解收支情况

**Independent Test**: 验证统计图表正确展示汇总数据

### Backend Implementation for User Story 5

- [x] T078 [US5] Create StatisticsModule in backend/src/modules/statistics/statistics.module.ts
- [x] T079 [US5] Create StatisticsService with summary calculation in backend/src/modules/statistics/statistics.service.ts
- [x] T080 [US5] Add category statistics aggregation to StatisticsService
- [x] T081 [US5] Add trend statistics aggregation to StatisticsService
- [x] T082 [US5] Create StatisticsController with GET /statistics/summary in backend/src/modules/statistics/statistics.controller.ts
- [x] T083 [US5] Add GET /statistics/category endpoint to StatisticsController
- [x] T084 [US5] Add GET /statistics/trend endpoint to StatisticsController
- [x] T085 [US5] Implement currency-based grouping for all statistics endpoints

### Frontend Implementation for User Story 5

- [x] T086 [US5] Create statisticsService with all stat methods in frontend/src/services/statisticsService.ts
- [x] T087 [P] [US5] Create SummaryCard component for total income/expense/balance in frontend/src/components/StatisticsChart/SummaryCard.tsx
- [x] T088 [P] [US5] Create CategoryPieChart component using ECharts in frontend/src/components/StatisticsChart/CategoryPieChart.tsx
- [x] T089 [P] [US5] Create TrendLineChart component using ECharts in frontend/src/components/StatisticsChart/TrendLineChart.tsx
- [x] T090 [US5] Create Statistics page with all chart components in frontend/src/pages/Statistics/index.tsx
- [x] T091 [US5] Add date range picker for statistics filtering
- [x] T092 [US5] Add currency switcher for multi-currency statistics
- [x] T093 [US5] Add responsive layout for charts (full-width on H5)
- [x] T094 [US5] Add route for /statistics to App.tsx

**Checkpoint**: User Story 5 complete - full feature set with statistics

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Navigation & UX

- [x] T095 Create bottom navigation bar for H5 in frontend/src/components/common/BottomNav/index.tsx
- [x] T096 Create sidebar navigation for PC in frontend/src/components/common/Sidebar/index.tsx
- [ ] T097 Add loading skeletons for all list views
- [ ] T098 Add pull-to-refresh for H5 list views

### Performance & Polish

- [ ] T099 [P] Add request debouncing for filter changes
- [ ] T100 [P] Add local caching for bill-types and currencies
- [ ] T101 Optimize bill list with virtual scrolling for large datasets
- [x] T102 Add error boundary for graceful error handling in frontend/src/components/common/ErrorBoundary/index.tsx

### Documentation & Validation

- [ ] T103 [P] Update quickstart.md with actual commands after setup
- [ ] T104 Run quickstart.md validation - verify development setup works
- [x] T105 Add Swagger decorators for complete API documentation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 and US2 are both P1, can run in parallel
  - US3 and US4 are both P2, can run in parallel after US1/US2
  - US5 (P3) can run after US1/US2 (needs data to display)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

| Story | Priority | Depends On | Can Start After |
|-------|----------|------------|-----------------|
| US1 - 新增账单 | P1 | Foundational | Phase 2 complete |
| US2 - 查看列表 | P1 | Foundational | Phase 2 complete |
| US3 - 编辑账单 | P2 | US1 (form reuse) | US1 complete |
| US4 - 删除账单 | P2 | US2 (list display) | US2 complete |
| US5 - 统计报表 | P3 | Foundational | Phase 2 complete |

### API Endpoint to User Story Mapping

| Endpoint | User Story |
|----------|------------|
| POST /bills | US1 |
| GET /bills | US2 |
| GET /bill-types | US2 |
| GET /currencies | US2 |
| GET /bills/:id | US3 |
| PUT /bills/:id | US3 |
| DELETE /bills/:id | US4 |
| GET /statistics/summary | US5 |
| GET /statistics/category | US5 |
| GET /statistics/trend | US5 |

### Parallel Opportunities

**Phase 1 (Setup)**:
```
T002, T003 (backend/frontend init)
T004, T005 (TypeScript config)
T006, T007 (ESLint config)
T008, T009 (env config)
```

**Phase 2 (Foundational)**:
```
T012, T013 (enums)
T015, T016, T017 (common utilities)
T020-T027 (all frontend foundation)
```

**Phase 3 (US1)**:
```
T034, T035, T036 (service + form components)
```

**Phase 4 (US2)**:
```
T048, T049 (bill-types, currencies endpoints)
T050, T051 (frontend services)
```

**Phase 7 (US5)**:
```
T087, T088, T089 (chart components)
```

---

## Parallel Example: Foundational Phase

```bash
# Backend team:
Task: "Create BillType and BillCategory enums in backend/src/modules/shared/enums/bill-type.enum.ts"
Task: "Create CurrencyCode enum in backend/src/modules/shared/enums/currency.enum.ts"

# Frontend team (parallel):
Task: "Setup Axios instance in frontend/src/services/api.ts"
Task: "Create TypeScript types in frontend/src/types/bill.ts"
Task: "Create useResponsive hook in frontend/src/hooks/useResponsive.ts"
Task: "Create currency formatting utility in frontend/src/utils/currency.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (全部)
2. Complete Phase 2: Foundational (全部) - **CRITICAL GATE**
3. Complete Phase 3: User Story 1 (新增账单)
4. Complete Phase 4: User Story 2 (查看列表)
5. **STOP and VALIDATE**: 用户可以记账并查看账单列表
6. Deploy/Demo MVP

### Incremental Delivery

1. MVP (US1 + US2) → 基础记账功能
2. Add US3 + US4 → 完整CRUD
3. Add US5 → 数据价值可视化
4. Add Polish → 优化体验

### Parallel Team Strategy

With 2 developers:
- **Developer A (Backend)**: T010-T019 → T028-T033 → T044-T049 → ...
- **Developer B (Frontend)**: T020-T027 → T034-T043 → T050-T058 → ...

---

## Summary

| Metric | Count |
|--------|-------|
| Total Tasks | 105 |
| Setup Phase | 9 |
| Foundational Phase | 18 |
| US1 Tasks | 16 |
| US2 Tasks | 15 |
| US3 Tasks | 11 |
| US4 Tasks | 8 |
| US5 Tasks | 17 |
| Polish Phase | 11 |
| Parallel Opportunities | ~40% of tasks |

**MVP Scope**: User Story 1 + User Story 2 (Phases 1-4, 58 tasks)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Backend and Frontend tasks can be parallelized by different developers
