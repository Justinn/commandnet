# Changelog

## [0.0.10] - 2025-05-19
### Added
- **Component Cleanup & Reusability:** Refactored components to maximize reusability (DRY principle), moved shared logic to hooks/utilities, and made components as stateless as possible.
- **Unit Testing:** Added or improved unit tests for all refactored components using React-Testing-Library, targeting at least 80% coverage for affected components.
- **Mobile UI/UX Enhancements:** Added tooltips or accessible hints for disabled icons/buttons on mobile, improved responsiveness and accessibility, and ensured all interactive elements are touch-friendly.

### Changed
- General code quality improvements: removed or merged duplicate components, followed project conventions (e.g., @ alias, scalable units for styling), and ensured no new lint/type errors.
- All tests pass in CI.

## [0.0.9] - 2025-05-19
### Added
- **Agent Management Feature:** First SpaceTraders integration ([#17](https://github.com/Justinn/commandnet/issues/17))
  - Agent Management UI: New pages and components for agent management (listing, registering, selecting, etc.).
  - API Endpoints: New API routes for agent CRUD operations.
  - Context/State: New context for agent state management.
  - Sidebar navigation and responsive, mobile-friendly design for agent management.
  - Well-tested using React-Testing-Library.
- **Prisma Migrations:** Database schema changes to support agent management (agent fields, account id changes, etc.).
- **General Refactoring:** Updates to shared components and authentication logic.

### Changed
- Updates to authentication and shared layout components to support agent management workflows.

### Removed
- Deprecated API routes: db-test and sentry-example-api. 

## [0.0.8] - 2025-05-19
### Added
- **SpaceTraders API Client Foundation:** Implemented a reusable, authenticated API client for SpaceTraders endpoints with robust request queueing and distributed rate limiting ([#15](https://github.com/Justinn/commandnet/issues/15)).
- **Global Rate Limiting:** Integrated Upstash Redis to enforce global (distributed) rate limits across all serverless instances and deployments.
- **Request Queue:** Requests are queued and processed in order, automatically respecting rate limits and retrying after HTTP 429 responses.
- **Error Handling & Logging:** Integrated Sentry for error tracking throughout the client.
- **Unit Tests:** Added Jest tests for request queueing and rate limiting logic, including mocking of Redis for reliable, isolated test runs.

## [0.0.7] - 2025-05-19
### Added
- Passwordless Email Authentication: Integrated NextAuth with a passwordless email login flow using the Resend email provider.
  - New API route at `app/api/auth/[...nextauth]/route.ts` for authentication.
  - Uses Prisma as the database adapter and Resend for sending magic links.
  - Login page (`/login`) for users to sign in with their email.
- Prisma Models for Auth: Added/updated Prisma models for `User`, `Account`, `Session`, and `VerificationToken` to support NextAuth.
- Session Management: Components now use NextAuth session hooks to display user info and authentication state.
- Client Providers: Added a `ClientProviders` component to wrap the app with NextAuth's `SessionProvider`.
- Mobile Support: Improved responsive design and mobile usability across the app.

### Changed
- UI Updates: Header, Sidebar, and MainContent components updated to reflect authentication state and provide sign-in/sign-out flows.
- Replaced Material UI (MUI) with styled-components for all UI styling.
- Updated dependencies in `package.json` to include all necessary packages for authentication, email, and styled-components.

### Added
- Integrated Prisma ORM and Vercel Postgres for database caching.
- Added a `Cache` model and API route for database connectivity.

## [0.0.6] - 2025-05-18
### Added
- Integrated Prisma ORM and Vercel Postgres for database caching.
- Added a `Cache` model and API route for database connectivity.

## [0.0.5] - 2025-05-18
### Changed
- Updated all neon cyan (#00fff7) accents, theme colors, and highlights to blue-cyan neon (#00bfff) for a more modern, cohesive look. See [#10](https://github.com/Justinn/commandnet/issues/10).

## [0.0.4] - 2025-05-18
### Changed
- Redesigned homepage

## [0.0.3] - 2025-05-18
### Added
- Installed React Testing Library and its peer dependencies for component testing.
- Added an example test for the sentry-example-page component.

## [0.0.2] - 2025-05-18
### Added
- Installed Sentry for Next.js (`@sentry/nextjs`) to enable error monitoring and tracking.

## [0.0.1] - 2025-05-18
### Added
- Installed Material UI (`@mui/material`), `@emotion/react`, and `@emotion/styled` dependencies for UI development.