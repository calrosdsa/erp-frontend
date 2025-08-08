# Frontend Tech Stack

Based on your existing Remix v2 ERP application, here's the complete frontend technology stack:

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Framework | Remix | v2 | Full-stack React framework with SSR/SSG | Provides excellent data loading patterns, nested routing, and progressive enhancement |
| Build Tool | Vite | Latest | Fast bundling and dev server | Integrated with Remix v2, offers superior DX with HMR and optimized builds |
| UI Library | React | v18+ | Component-based UI library | Industry standard with excellent ecosystem and Remix integration |
| Component Library | shadcn/ui + Radix UI | Latest | Accessible, customizable components | Combines accessibility (Radix) with design flexibility (shadcn) |
| State Management | Zustand | Latest | Lightweight client state management | Simple API, TypeScript-first, minimal boilerplate compared to Redux |
| Routing | Remix Router | v2 | File-based routing with nested layouts | Integrated with Remix, supports modal routes and complex nesting patterns |
| Styling | Tailwind CSS | Latest | Utility-first CSS framework | Rapid development, consistent design system, excellent with component libraries |
| Form Handling | React Hook Form + Zod | Latest | Type-safe form validation | Performant forms with schema validation and TypeScript integration |
| API Client | openapi-fetch | Latest | Type-safe API client | Generated from OpenAPI spec, automatic type safety, middleware support |
| Testing | Vitest + React Testing Library | Latest | Unit and integration testing | Fast test runner compatible with Vite, established React testing patterns |
| TypeScript | TypeScript | Latest | Static type checking | Enhanced developer experience, catches errors early, excellent with Remix |
| Internationalization | i18next + react-i18next | Latest | Multi-language support | Industry standard for React i18n with SSR support |
