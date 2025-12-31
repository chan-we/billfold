# Tasks: 用户登录态检查

**Input**: Design documents from `/specs/002-login-guard/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

**Tests**: Not explicitly requested in specification. Test tasks are NOT included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

**Architecture Note**: 认证由 Fence API 网关统一处理，后端 AuthGuard 从 `CH-USER` Header 获取用户 ID，缺失时返回 401。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- File paths follow web app structure: `backend/src/`, `frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and auth configuration files

- [x] T001 [P] Create frontend auth config in frontend/src/config/auth.config.ts
- [x] T002 [P] Create auth utility functions in frontend/src/utils/auth.ts
- [x] T003 [P] Create backend CurrentUser decorator in backend/src/common/decorators/user.decorator.ts
- [x] T003a [P] Fix AuthGuard to read CH-USER header and return 401 when missing in backend/src/common/guards/auth.guard.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Setup Axios interceptor for 401 handling in frontend/src/services/api.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 & 2 - 登录态拦截与放行 (Priority: P1) 🎯 MVP

**Goal**: 未登录用户被重定向到登录页；已登录用户正常访问页面

**User Story 1**: 未登录用户访问受保护页面被拦截
**User Story 2**: 已登录用户正常访问页面

**Independent Test**:
- 清除 Cookie `CowboyHat` 后访问任意页面 → 验证重定向到登录页
- 使用有效 Cookie 访问页面 → 验证页面正常显示

### Implementation for User Stories 1 & 2

- [x] T005 [P] [US1] Create AuthGuard component in frontend/src/components/AuthGuard/index.tsx
- [x] T006 [US1] Implement redirectToLogin function in frontend/src/utils/auth.ts
- [x] T007 [US1] Update Axios interceptor to call redirectToLogin on 401 in frontend/src/services/api.ts
- [x] T008 [US1] Wrap all routes with AuthGuard in frontend/src/App.tsx
- [ ] T009 [US2] Verify backend receives CH-USER header from Fence gateway (manual test)

**Checkpoint**: Core authentication flow is complete. Unauthenticated users are redirected; authenticated users access pages normally.

---

## Phase 4: User Story 3 - 登录成功后返回原页面 (Priority: P2)

**Goal**: 用户从登录页登录成功后，自动返回最初尝试访问的页面

**Independent Test**: 未登录访问 `/bills/123`，完成登录后验证是否返回 `/bills/123`

### Implementation for User Story 3

- [x] T010 [US3] Update redirectToLogin to include current path as redirect parameter in frontend/src/utils/auth.ts
- [x] T011 [US3] Ensure redirect parameter is URL encoded properly in frontend/src/utils/auth.ts

**Checkpoint**: Login redirect preserves original destination. Users return to their intended page after login.

---

## Phase 5: User Story 4 - 登录状态过期处理 (Priority: P2)

**Goal**: 登录凭证失效时，系统检测到并引导用户重新登录

**Independent Test**: 使凭证失效后执行 API 操作 → 验证被引导到登录页

### Implementation for User Story 4

- [x] T012 [US4] Ensure Axios interceptor handles mid-session 401 correctly in frontend/src/services/api.ts
- [x] T013 [US4] Add user-friendly handling for session expiration (console warning added)

**Checkpoint**: Token expiration is handled gracefully. Users are redirected to login when session expires.

---

## Phase 6: Polish & Edge Cases

**Purpose**: Handle edge cases and cross-cutting concerns

- [x] T014 [P] Add error handling for network failures in frontend/src/services/api.ts (already handled)
- [ ] T015 [P] Add development mode bypass for local testing in backend (optional - skipped)
- [ ] T016 Run full end-to-end validation per quickstart.md checklist (manual)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories 1 & 2 (Phase 3)**: Depends on Foundational phase completion
- **User Story 3 (Phase 4)**: Depends on Phase 3 (builds on redirect flow)
- **User Story 4 (Phase 5)**: Can run in parallel with Phase 4 (independent)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

| Story | Depends On | Notes |
|-------|------------|-------|
| US1 (未登录拦截) | Foundational | Core MVP functionality |
| US2 (已登录放行) | Foundational | Tested alongside US1 |
| US3 (返回原页面) | US1 | Extends redirect flow |
| US4 (过期处理) | US1 | Extends 401 handling |

### Parallel Opportunities

**Phase 1** (all parallel):
```
T001: frontend auth config
T002: auth utility functions
T003: backend CurrentUser decorator
```

**Phase 4 & 5** (can run in parallel):
```
Phase 4: US3 (redirect preservation)
Phase 5: US4 (expiration handling)
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Stories 1 & 2
4. **STOP and VALIDATE**: Test authentication flow independently
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 & US2 → Test independently → Deploy (MVP!)
3. Add US3 → Test independently → Deploy (Better UX)
4. Add US4 → Test independently → Deploy (Complete handling)
5. Polish → Final release

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 16 |
| Phase 1 (Setup) | 3 tasks |
| Phase 2 (Foundational) | 1 task |
| Phase 3 (US1 & US2) | 5 tasks |
| Phase 4 (US3) | 2 tasks |
| Phase 5 (US4) | 2 tasks |
| Phase 6 (Polish) | 3 tasks |
| Parallel Opportunities | 5 tasks marked [P] |

### Files to Create/Modify

| File | Action | Phase |
|------|--------|-------|
| frontend/src/config/auth.config.ts | CREATE | 1 |
| frontend/src/utils/auth.ts | CREATE | 1, 3, 4, 6 |
| backend/src/common/decorators/user.decorator.ts | CREATE | 1 |
| frontend/src/services/http.ts | MODIFY | 2, 3, 5 |
| frontend/src/components/AuthGuard/index.tsx | CREATE | 3 |
| frontend/src/App.tsx | MODIFY | 3 |

### Key Configuration Values (from fence-knowledge)

| 配置项 | 值 |
|--------|-----|
| Cookie 名称 | `CowboyHat` |
| 用户 ID Header | `CH-USER` |
| 重定向参数 | `redirectUrl` (完整 URL) |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- 后端不需要 AuthGuard - Fence 网关已处理认证
- 未认证请求不会到达后端 - 由网关直接返回 401
- Commit after each task or logical group
