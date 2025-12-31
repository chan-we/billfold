# Checklist: 用户登录态检查 - 综合需求质量审查

**Purpose**: 验证登录态检查功能的需求完整性、清晰度和一致性
**Created**: 2025-12-31
**Focus**: 综合审查 (安全、UX、API、边缘情况)
**Depth**: 标准 (Standard)
**Audience**: PR 审核 / 里程碑检查

---

## Requirement Completeness (需求完整性)

- [ ] CHK001 - 是否明确定义了所有需要登录保护的页面路径？ [Completeness, Spec §FR-001]
- [ ] CHK002 - 是否指定了登录页 URL 的配置方式和默认值？ [Completeness, Spec §Clarifications]
- [ ] CHK003 - 是否定义了 Cookie 名称 `CowboyHat` 的来源和格式？ [Completeness, Spec §Assumptions]
- [ ] CHK004 - 是否明确了 `CH-USER` Header 的数据类型和可能的值？ [Gap, Plan §Fence 网关集成]
- [ ] CHK005 - 是否定义了 redirect 参数的 URL 编码规则？ [Completeness, Spec §FR-003]

---

## Requirement Clarity (需求清晰度)

- [ ] CHK006 - "登录状态检查对已登录用户透明"是否有可测量的标准？ [Clarity, Spec §FR-007]
- [ ] CHK007 - SC-002 中 "100 毫秒" 性能目标的测量起点和终点是否明确？ [Clarity, Spec §SC-002]
- [ ] CHK008 - SC-004 中 "3 秒内" 的计时起点是否明确定义？ [Clarity, Spec §SC-004]
- [ ] CHK009 - "立即显示错误提示" 中 "立即" 是否有具体时间约束？ [Ambiguity, Spec §Edge Cases]
- [ ] CHK010 - "友好的错误提示" 是否有具体的文案或格式要求？ [Ambiguity, Spec §Edge Cases]

---

## Requirement Consistency (需求一致性)

- [ ] CHK011 - FR-005 (验证凭证有效性) 与 Fence 网关架构是否一致？ [Consistency, Spec §FR-005 vs §Assumptions]
- [ ] CHK012 - spec.md 和 plan.md 中对 Cookie 存储方式的描述是否一致？ [Consistency]
- [ ] CHK013 - tasks.md 中的文件路径与 plan.md 中 Project Structure 是否一致？ [Consistency]
- [ ] CHK014 - "所有页面需登录保护" 与 "没有公开可访问的页面" 是否有例外情况需要说明？ [Consistency, Spec §Assumptions]

---

## Acceptance Criteria Quality (验收标准质量)

- [ ] CHK015 - SC-001 "100% 未授权访问被拦截" 是否可通过自动化测试验证？ [Measurability, Spec §SC-001]
- [ ] CHK016 - SC-003 "95% 用户被重定向回原页面" 的统计方法是否定义？ [Measurability, Spec §SC-003]
- [ ] CHK017 - User Story 验收场景是否涵盖所有 FR 需求？ [Coverage, Spec §User Stories]
- [ ] CHK018 - 各 User Story 的 Independent Test 是否可独立执行？ [Testability, Spec §US1-4]

---

## Scenario Coverage (场景覆盖)

- [ ] CHK019 - 是否定义了首次访问（无任何 Cookie）的行为？ [Coverage, Primary Flow]
- [ ] CHK020 - 是否定义了 Token 即将过期但未过期时的行为？ [Coverage, Alternate Flow, Gap]
- [ ] CHK021 - 是否定义了用户主动登出后的状态清理？ [Coverage, Gap]
- [ ] CHK022 - 是否定义了后端服务不可用时前端的行为？ [Coverage, Exception Flow]
- [ ] CHK023 - 是否定义了 Fence 网关不可用时的降级策略？ [Coverage, Exception Flow, Gap]

---

## Edge Case Coverage (边缘情况覆盖)

- [ ] CHK024 - 多标签页同步场景是否有具体的实现约束？ [Edge Case, Spec §Edge Cases]
- [ ] CHK025 - 是否定义了 redirect URL 过长时的处理方式？ [Edge Case, Gap]
- [ ] CHK026 - 是否定义了 redirect URL 包含特殊字符时的编码规则？ [Edge Case, Spec §FR-003]
- [ ] CHK027 - 是否定义了浏览器禁用 Cookie 时的行为？ [Edge Case, Gap]
- [ ] CHK028 - 是否定义了 401 响应在请求重试期间的去重机制？ [Edge Case, Gap]

---

## Security Requirements (安全需求)

- [ ] CHK029 - HttpOnly Cookie 属性是否在需求中明确要求？ [Security, Spec §Assumptions]
- [ ] CHK030 - 是否定义了 CSRF 防护措施？ [Security, Gap]
- [ ] CHK031 - redirect 参数是否有防止开放重定向攻击的验证要求？ [Security, Gap]
- [ ] CHK032 - 是否定义了敏感信息（如用户 ID）在日志中的脱敏规则？ [Security, Gap]
- [ ] CHK033 - 是否明确了 JWT 签名密钥 `cowboy_hat` 的安全管理方式？ [Security, Plan §关键集成点]

---

## Integration & Dependencies (集成与依赖)

- [ ] CHK034 - Fence 网关的可用性 SLA 是否在依赖中说明？ [Dependency, Gap]
- [ ] CHK035 - 统一登录系统的 API 契约是否有文档引用？ [Dependency, Spec §Dependencies]
- [ ] CHK036 - CH-USER Header 缺失时后端的行为是否定义？ [Integration, Gap]
- [ ] CHK037 - 是否定义了 Fence 网关返回非 401 错误（如 500）时的处理？ [Integration, Gap]

---

## Non-Functional Requirements (非功能需求)

- [ ] CHK038 - 是否定义了登录重定向的最大次数限制？ [NFR, Gap]
- [ ] CHK039 - 是否定义了支持的浏览器版本范围？ [NFR, Gap]
- [ ] CHK040 - 是否定义了移动端浏览器的兼容性要求？ [NFR, Gap]

---

## Summary

| Category | Item Count | Coverage |
|----------|------------|----------|
| Requirement Completeness | 5 | 核心配置和数据格式 |
| Requirement Clarity | 5 | 模糊术语和度量标准 |
| Requirement Consistency | 4 | 跨文档一致性 |
| Acceptance Criteria Quality | 4 | 可测量性和覆盖度 |
| Scenario Coverage | 5 | 主要/备选/异常流程 |
| Edge Case Coverage | 5 | 边界条件和异常输入 |
| Security Requirements | 5 | 认证安全和攻击防护 |
| Integration & Dependencies | 4 | 外部系统集成 |
| Non-Functional Requirements | 3 | 兼容性和限制 |
| **Total** | **40** | |

---

## Notes

- `[Gap]` 标记表示需求中可能缺失的内容
- `[Ambiguity]` 标记表示需要进一步明确的模糊表述
- 建议在 PR 审核时重点关注 Security 和 Edge Case 类别
