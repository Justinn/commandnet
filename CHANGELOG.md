# Changelog

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