# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (runs on host with Vite)
- **Build**: `npm run build` (Remix Vite build)
- **Production**: `npm start` (serves built app)
- **Linting**: `npm run lint` (ESLint with cache)
- **Type checking**: `npm run typecheck` (TypeScript compiler)

## Project Architecture

This is a **Remix v2** full-stack ERP application built with TypeScript, Vite, and Tailwind CSS.

### Core Structure

- **Framework**: Remix v2 with Vite bundler
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand for client state
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom shadcn/ui layer
- **API**: OpenAPI-generated client with typed endpoints
- **Internationalization**: i18next with React integration

### Key Directories

- `app/routes/` - File-based routing with nested layouts
- `@/components/` - Reusable UI components (aliased import)
- `app/types/` - TypeScript type definitions
- `app/sdk/` - Generated OpenAPI types and schemas
- `app/util/` - Utility functions and hooks

### Authentication & Authorization

- Session-based auth with server-side session management
- Role-based access control with workspace isolation
- API client automatically injects auth headers and company context
- Protected routes redirect to `/signin` when unauthorized

### API Integration

- Uses `openapi-fetch` with generated types from backend OpenAPI spec
- API client (`app/apiclient.tsx`) handles authentication middleware
- Base URL configurable via `API_URL` environment variable
- Default fallback: `http://localhost:9090`

### Route Architecture

- Nested routes follow ERP module structure (accounting, stock, buying, etc.)
- Modal routes for detail views (e.g., `home.customer.$id`)
- Tab-based detail layouts in `tab/` subdirectories
- Client components use `.client.tsx` suffix for browser-only code

### State Management Patterns

- Global app state passed through Remix context
- Zustand stores for complex component state
- Server state managed via Remix loaders/actions
- Form state with React Hook Form

### Component Organization

- `@/components/ui/` - Base shadcn/ui components
- `@/components/custom/` - Custom business components
- `@/components/layout/` - Layout and navigation components
- Component composition follows atomic design principles

### Type Safety

- Strict TypeScript configuration
- Generated API types from OpenAPI spec
- Zod schemas for runtime validation
- Path aliases: `~/*` for app, `@/*` for components

## Important Notes

- Use absolute imports with path aliases (`~/` and `@/`)
- Always run typecheck before committing changes
- Follow existing naming conventions for routes and components
- Modal components should use the established modal patterns
- API calls should use the configured client with proper error handling