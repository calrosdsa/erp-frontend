# Project Structure

Based on your Remix v2 ERP application, here's the recommended project structure that follows Remix conventions and supports your existing patterns:

```
erp-frontend/
├── app/                          # Remix app directory (main application code)
│   ├── components/               # Reusable UI components (aliased as @/components)
│   │   ├── ui/                   # Base shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   └── index.ts          # Re-export all UI components
│   │   ├── custom/               # Custom business components
│   │   │   ├── data-table.tsx
│   │   │   ├── customer-form.tsx
│   │   │   └── invoice-summary.tsx
│   │   └── layout/               # Layout and navigation components
│   │       ├── header.tsx
│   │       ├── sidebar.tsx
│   │       └── breadcrumb.tsx
│   ├── routes/                   # File-based routing (Remix convention)
│   │   ├── _index.tsx            # Home page (/)
│   │   ├── signin.tsx            # Sign in page
│   │   ├── home/                 # Main ERP modules
│   │   │   ├── _layout.tsx       # Shared layout for /home routes
│   │   │   ├── customer/         # Customer management
│   │   │   │   ├── index.tsx     # Customer list
│   │   │   │   ├── $id.tsx       # Customer detail modal route
│   │   │   │   └── tab/          # Customer detail tabs
│   │   │   │       ├── profile.tsx
│   │   │   │       ├── orders.tsx
│   │   │   │       └── billing.tsx
│   │   │   ├── accounting/       # Accounting module
│   │   │   ├── stock/            # Stock management
│   │   │   └── buying/           # Purchasing module
│   │   └── api/                  # API routes (if needed)
│   ├── lib/                      # Utility functions and configurations
│   │   ├── utils.ts              # General utilities (cn function, etc.)
│   │   ├── validations.ts        # Zod schemas for form validation
│   │   ├── constants.ts          # Application constants
│   │   └── auth.ts               # Authentication utilities
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-api.ts            # API interaction hooks
│   │   ├── use-auth.ts           # Authentication hooks
│   │   └── use-local-storage.ts  # Local storage hooks
│   ├── stores/                   # Zustand stores
│   │   ├── auth-store.ts         # Authentication state
│   │   ├── ui-store.ts           # UI state (modals, sidebar, etc.)
│   │   └── app-store.ts          # Global app state
│   ├── types/                    # TypeScript type definitions
│   │   ├── api.ts                # API response types
│   │   ├── auth.ts               # Authentication types
│   │   └── index.ts              # Shared/common types
│   ├── sdk/                      # Generated OpenAPI types and schemas
│   │   ├── types.ts              # Generated API types
│   │   └── schemas.ts            # Generated Zod schemas
│   ├── styles/                   # Global styles
│   │   ├── globals.css           # Global CSS with Tailwind imports
│   │   └── components.css        # Component-specific styles
│   ├── apiclient.tsx             # API client configuration
│   ├── entry.client.tsx          # Client-side entry point
│   ├── entry.server.tsx          # Server-side entry point
│   ├── root.tsx                  # Root component with providers
│   └── util/                     # Additional utilities (existing pattern)
├── public/                       # Static assets
│   ├── favicon.ico
│   ├── images/
│   └── icons/
├── docs/                         # Documentation
│   └── ui-architecture.md        # This document
├── tests/                        # Test files
│   ├── __mocks__/                # Test mocks
│   ├── components/               # Component tests
│   ├── routes/                   # Route/integration tests
│   └── setup.ts                  # Test setup
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── tailwind.config.ts            # Tailwind configuration
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```
