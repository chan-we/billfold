<!--
SYNC IMPACT REPORT
==================
Version change: N/A → 1.0.0 (Initial ratification)
Modified principles: N/A (Initial version)
Added sections:
  - Core Principles (5 principles)
  - Security Standards
  - Code Quality
  - Governance
Removed sections: N/A
Templates verified:
  - .specify/templates/plan-template.md ✅ Compatible (Constitution Check section present)
  - .specify/templates/spec-template.md ✅ Compatible (Requirements structure aligns)
  - .specify/templates/tasks-template.md ✅ Compatible (Phase structure supports principles)
Follow-up TODOs: None
-->

# Billfold Constitution

## Core Principles

### I. User-Centric Design

All features MUST prioritize the end-user experience for bill recording and statistics viewing.

- User interfaces MUST be intuitive and require minimal learning curve
- Bill entry workflows MUST be completable in under 30 seconds for typical transactions
- Statistics and reports MUST render within 2 seconds for datasets up to 1 year of records
- Error messages MUST be actionable and written in user-friendly language (no technical jargon)
- Offline capability SHOULD be considered for core bill recording functionality

**Rationale**: As a consumer-facing application, user experience directly determines adoption and retention.

### II. Data Integrity

Financial data MUST be accurate, consistent, and protected against loss.

- All monetary calculations MUST use appropriate decimal precision (no floating-point for currency)
- Database transactions MUST be atomic for multi-record operations
- Data validation MUST occur at both client and server boundaries
- Backup and recovery mechanisms MUST be documented and tested
- Historical data MUST be immutable once finalized (soft-delete only, audit trail required)

**Rationale**: Users trust this application with their financial records; data corruption or loss is unacceptable.

### III. Privacy First

User financial data MUST be treated as highly sensitive and protected accordingly.

- Personal financial data MUST be encrypted at rest and in transit
- No user data SHALL be shared with third parties without explicit consent
- Data retention policies MUST be clearly communicated to users
- Users MUST be able to export and delete their own data
- Logging MUST NOT include sensitive financial details (amounts, account numbers)

**Rationale**: Financial data is among the most sensitive personal information; privacy violations erode trust.

### IV. Incremental Delivery

Features MUST be deliverable in independently testable increments.

- Each user story SHOULD be independently deployable as an MVP increment
- New features MUST NOT break existing functionality
- Database migrations MUST be backward-compatible or include rollback procedures
- Feature flags SHOULD be used for gradual rollouts when appropriate
- Integration points MUST be versioned to support incremental updates

**Rationale**: Incremental delivery reduces risk, enables faster feedback, and maintains system stability.

### V. Simplicity

Prefer simple, maintainable solutions over complex architectures.

- Start with the simplest solution that meets requirements; refactor only when necessary
- Avoid premature optimization; measure before optimizing
- New abstractions require justification (document the problem they solve)
- External dependencies MUST be evaluated for necessity and maintenance burden
- Code SHOULD be self-documenting; comments explain "why" not "what"

**Rationale**: Complexity is the enemy of reliability; simple systems are easier to understand, test, and maintain.

## Security Standards

### Authentication & Authorization

- User authentication MUST use industry-standard protocols (OAuth 2.0, OpenID Connect, or equivalent)
- Session tokens MUST have appropriate expiration and refresh mechanisms
- Password storage MUST use strong hashing algorithms (bcrypt, Argon2, or equivalent)
- Authorization checks MUST be enforced at the API layer, not just UI

### Secrets Management

- Secrets (API keys, database credentials) MUST NOT be committed to version control
- Environment-specific secrets MUST be managed through secure configuration (environment variables, secrets managers)
- Secrets MUST be rotatable without code changes

### Vulnerability Management

- Dependencies MUST be regularly scanned for known vulnerabilities
- Security updates for critical vulnerabilities MUST be applied promptly
- User input MUST be validated and sanitized to prevent injection attacks (SQL, XSS, etc.)

## Code Quality

### Formatting & Linting

- Code formatting MUST be automated and consistent (via project-configured tooling)
- Linting rules MUST be enforced in CI pipeline
- No code SHOULD be merged with linting errors or warnings (unless explicitly suppressed with justification)

### Review Process

- All code changes MUST be reviewed by at least one other contributor before merging
- Pull request descriptions MUST explain the change and its rationale
- Breaking changes MUST be clearly labeled and documented

### Testing Guidelines

- Tests are encouraged but not mandated; testing approach is flexible per feature
- Critical paths (bill recording, calculations, data export) SHOULD have test coverage
- When tests exist, they MUST pass before merging
- Integration tests SHOULD cover user-facing workflows

## Governance

### Amendment Procedure

1. Proposed amendments MUST be documented with rationale
2. Amendments MUST be reviewed and approved by project maintainers
3. Approved amendments MUST include a migration plan for affected code/processes
4. Amendment history MUST be tracked via version increments

### Versioning Policy

- **MAJOR**: Principle removal, redefinition, or backward-incompatible governance changes
- **MINOR**: New principle or section added, material guidance expansion
- **PATCH**: Clarifications, wording improvements, typo fixes

### Compliance Review

- All pull requests SHOULD verify alignment with Constitution principles
- Plan documents MUST include a Constitution Check section
- Complexity that violates Simplicity principle MUST be justified in writing

**Version**: 1.0.0 | **Ratified**: 2025-12-30 | **Last Amended**: 2025-12-30
