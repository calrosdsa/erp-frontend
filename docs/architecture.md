# ERP Frontend Architecture Document

## Template and Framework Selection

Based on the existing codebase analysis from CLAUDE.md, your project is already using:

- **Framework**: Remix v2 with Vite bundler
- **Styling**: Tailwind CSS with shadcn/ui components  
- **State Management**: Zustand for client state
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom shadcn/ui layer
- **API Integration**: OpenAPI-generated client with typed endpoints
- **Build Tool**: Vite (integrated with Remix)

Since you already have an established Remix v2 application, we're working with a mature frontend architecture rather than starting from a template. Your current setup represents a modern, full-stack approach with excellent developer experience tooling.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-08-05 | 1.0 | Initial frontend architecture documentation | Winston (Architect) |

## Frontend Tech Stack

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

## Project Structure

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

## Component Standards

Based on your Remix v2 + TypeScript + shadcn/ui stack, here are the component standards that follow your existing patterns:

### Component Template

```typescript
import { forwardRef } from "react"
import { cn } from "~/lib/utils"
import type { ComponentProps } from "react"

// Define component-specific props interface
interface CustomButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

// Use forwardRef for components that might need refs
const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          // Variant styles
          {
            "bg-primary text-primary-foreground hover:bg-primary/90": variant === "primary",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
            "border border-input hover:bg-accent hover:text-accent-foreground": variant === "outline",
            "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
          },
          // Size styles
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4": size === "md", 
            "h-12 px-6 text-lg": size === "lg",
          },
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    )
  }
)
CustomButton.displayName = "CustomButton"

export { CustomButton, type CustomButtonProps }
```

### Naming Conventions

**Files and Components:**
- **Components**: PascalCase for component names (`CustomerForm`, `DataTable`)
- **Files**: kebab-case for file names (`customer-form.tsx`, `data-table.tsx`)
- **Directories**: kebab-case for folder names (`custom/`, `ui/`, `layout/`)

**Routes (Remix-specific):**
- **Route files**: Follow Remix conventions (`_index.tsx`, `$id.tsx`, `_layout.tsx`)
- **Modal routes**: Use `$id.tsx` pattern for detail modals
- **Nested routes**: Use folder structure with `index.tsx` for list views

**State Management:**
- **Zustand stores**: kebab-case files with `-store` suffix (`auth-store.ts`, `ui-store.ts`)
- **Store actions**: camelCase (`setUser`, `toggleSidebar`, `clearAuth`)
- **Store selectors**: descriptive names (`isAuthenticated`, `currentUser`, `sidebarOpen`)

**API and Types:**
- **Type interfaces**: PascalCase with descriptive names (`Customer`, `InvoiceData`, `AuthState`)
- **API functions**: camelCase with verb prefixes (`getCustomer`, `createInvoice`, `updateStock`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_BASE_URL`, `DEFAULT_PAGE_SIZE`)

**Hooks:**
- **Custom hooks**: camelCase with `use` prefix (`useAuth`, `useCustomers`, `useLocalStorage`)
- **Hook files**: kebab-case with `use-` prefix (`use-auth.ts`, `use-customers.ts`)

**CSS Classes:**
- **Tailwind**: Use `cn()` utility for conditional classes
- **Custom CSS**: Follow BEM methodology if needed (`block__element--modifier`)

## State Management

Based on your Zustand setup for client state management in the Remix ERP application, here are the state management patterns:

### Store Structure

```
app/stores/
├── auth-store.ts          # Authentication and user state
├── ui-store.ts            # UI state (modals, sidebar, theme)
├── app-store.ts           # Global application state
├── customer-store.ts      # Customer-specific state (if needed)
└── index.ts               # Re-export all stores
```

### State Management Template

```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// Define the state interface
interface AuthState {
  // State properties
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  setUser: (user: User) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

// Create the store with middleware
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        setUser: (user) =>
          set((state) => {
            state.user = user
            state.isAuthenticated = true
            state.error = null
          }),

        clearUser: () =>
          set((state) => {
            state.user = null
            state.isAuthenticated = false
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading
          }),

        setError: (error) =>
          set((state) => {
            state.error = error
          }),

        login: async (credentials) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            // API call would go here
            const user = await loginUser(credentials)
            get().setUser(user)
          } catch (error) {
            get().setError(error instanceof Error ? error.message : 'Login failed')
          } finally {
            get().setLoading(false)
          }
        },

        logout: () => {
          get().clearUser()
          // Additional cleanup logic
        },
      })),
      {
        name: 'auth-storage', // localStorage key
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }), // Only persist specific fields
      }
    ),
    { name: 'auth-store' } // DevTools name
  )
)

// Selector hooks for better performance
export const useAuth = () => useAuthStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
}))

export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  logout: state.logout,
  setUser: state.setUser,
  clearUser: state.clearUser,
}))
```

## API Integration

Based on your OpenAPI-generated client with typed endpoints, here are the API integration patterns for your Remix ERP application:

### Service Template

```typescript
import { createApiClient } from '~/apiclient'
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '~/sdk/types'
import type { ApiResponse, PaginatedResponse } from '~/types/api'

// Create service class for customer operations
export class CustomerService {
  private api = createApiClient()

  async getCustomers(params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<Customer>> {
    try {
      const { data, error } = await this.api.GET('/api/customers', {
        params: {
          query: params,
        },
      })

      if (error) {
        throw new Error(error.message || 'Failed to fetch customers')
      }

      return data
    } catch (error) {
      console.error('CustomerService.getCustomers:', error)
      throw error
    }
  }

  async getCustomer(id: string): Promise<Customer> {
    try {
      const { data, error } = await this.api.GET('/api/customers/{id}', {
        params: {
          path: { id },
        },
      })

      if (error) {
        throw new Error(error.message || 'Failed to fetch customer')
      }

      return data
    } catch (error) {
      console.error('CustomerService.getCustomer:', error)
      throw error
    }
  }

  async createCustomer(customerData: CreateCustomerRequest): Promise<Customer> {
    try {
      const { data, error } = await this.api.POST('/api/customers', {
        body: customerData,
      })

      if (error) {
        throw new Error(error.message || 'Failed to create customer')
      }

      return data
    } catch (error) {
      console.error('CustomerService.createCustomer:', error)
      throw error
    }
  }

  async updateCustomer(id: string, customerData: UpdateCustomerRequest): Promise<Customer> {
    try {
      const { data, error } = await this.api.PUT('/api/customers/{id}', {
        params: {
          path: { id },
        },
        body: customerData,
      })

      if (error) {
        throw new Error(error.message || 'Failed to update customer')
      }

      return data
    } catch (error) {
      console.error('CustomerService.updateCustomer:', error)
      throw error
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      const { error } = await this.api.DELETE('/api/customers/{id}', {
        params: {
          path: { id },
        },
      })

      if (error) {
        throw new Error(error.message || 'Failed to delete customer')
      }
    } catch (error) {
      console.error('CustomerService.deleteCustomer:', error)
      throw error
    }
  }
}

// Export singleton instance
export const customerService = new CustomerService()
```

### API Client Configuration

```typescript
import createClient from 'openapi-fetch'
import type { paths } from '~/sdk/types'

// Get API base URL from environment with fallback
const API_BASE_URL = process.env.API_URL || 'http://localhost:9090'

// Create typed API client
export function createApiClient() {
  const client = createClient<paths>({
    baseUrl: API_BASE_URL,
  })

  // Request interceptor for authentication
  client.use({
    onRequest({ request, options }) {
      // Add authentication headers
      const token = getAuthToken() // Your auth token logic
      if (token) {
        request.headers.set('Authorization', `Bearer ${token}`)
      }

      // Add company context if available
      const companyId = getCurrentCompanyId() // Your company context logic
      if (companyId) {
        request.headers.set('X-Company-ID', companyId)
      }

      // Add request ID for tracing
      request.headers.set('X-Request-ID', generateRequestId())

      return request
    },

    onResponse({ request, response, options }) {
      // Log API calls in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`${request.method} ${request.url}: ${response.status}`)
      }

      // Handle global error responses
      if (!response.ok) {
        // Handle specific error cases
        switch (response.status) {
          case 401:
            // Redirect to login or refresh token
            handleUnauthorized()
            break
          case 403:
            // Handle forbidden access
            handleForbidden()
            break
          case 500:
            // Handle server errors
            handleServerError()
            break
        }
      }

      return response
    },
  })

  return client
}

// Utility functions
function getAuthToken(): string | null {
  // Get token from your auth store or localStorage
  return localStorage.getItem('auth_token')
}

function getCurrentCompanyId(): string | null {
  // Get company ID from your app state
  return localStorage.getItem('current_company_id')
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function handleUnauthorized() {
  // Clear auth state and redirect to login
  localStorage.removeItem('auth_token')
  window.location.href = '/signin'
}

function handleForbidden() {
  // Handle forbidden access
  console.warn('Access forbidden')
}

function handleServerError() {
  // Handle server errors
  console.error('Server error occurred')
}
```

## Routing

Based on your Remix v2 file-based routing with nested layouts and modal routes, here are the routing patterns for your ERP application:

### Route Configuration

```typescript
// app/routes/_index.tsx - Home page route
import type { LoaderFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request)
  
  // Redirect unauthenticated users to signin
  if (!user) {
    throw redirect("/signin")
  }
  
  // Redirect authenticated users to main dashboard
  throw redirect("/home")
}

export default function Index() {
  return null // This component won't render due to redirect
}

// app/routes/signin.tsx - Authentication route
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, useActionData, useNavigation } from "@remix-run/react"

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request)
  
  // Redirect if already authenticated
  if (user) {
    throw redirect("/home")
  }
  
  return json({})
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const email = formData.get("email")
  const password = formData.get("password")
  
  try {
    const user = await authenticateUser(email, password)
    const session = await createUserSession(user.id, "/home")
    
    return redirect("/home", {
      headers: {
        "Set-Cookie": session,
      },
    })
  } catch (error) {
    return json(
      { error: "Invalid email or password" },
      { status: 400 }
    )
  }
}

// app/routes/home/_layout.tsx - Main ERP layout
import type { LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request) // Throws redirect if not authenticated
  const companies = await getUserCompanies(user.id)
  
  return json({
    user,
    companies,
  })
}

export default function HomeLayout() {
  const { user, companies } = useLoaderData<typeof loader>()
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} companies={companies} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// app/routes/home/customer/index.tsx - Customer list route
import type { LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData, Outlet } from "@remix-run/react"
import { CustomerList } from "@/components/custom/customer-list"

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request)
  const url = new URL(request.url)
  
  const searchParams = {
    page: parseInt(url.searchParams.get("page") || "1"),
    limit: parseInt(url.searchParams.get("limit") || "25"),
    search: url.searchParams.get("search") || "",
    sortBy: url.searchParams.get("sortBy") || "name",
    sortOrder: (url.searchParams.get("sortOrder") as "asc" | "desc") || "asc",
  }
  
  const customers = await customerService.getCustomers(searchParams)
  
  return json({
    customers,
    searchParams,
  })
}

export default function CustomerIndex() {
  const { customers, searchParams } = useLoaderData<typeof loader>()
  
  return (
    <>
      <CustomerList customers={customers} searchParams={searchParams} />
      <Outlet /> {/* Renders modal routes */}
    </>
  )
}

// app/routes/home/customer/$id.tsx - Customer detail modal route
import type { LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react"
import { Modal } from "@/components/ui/modal"
import { CustomerTabs } from "@/components/custom/customer-tabs"

export async function loader({ params, request }: LoaderFunctionArgs) {
  const user = await requireUser(request)
  const customerId = params.id!
  
  const customer = await customerService.getCustomer(customerId)
  
  return json({
    customer,
  })
}

export default function CustomerDetail() {
  const { customer } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  
  return (
    <Modal
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          navigate("/home/customer", { replace: true })
        }
      }}
      className="max-w-4xl"
    >
      <CustomerTabs customer={customer} />
    </Modal>
  )
}

// app/routes/home/customer/tab/profile.tsx - Customer profile tab
import type { LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { CustomerProfileForm } from "@/components/custom/customer-profile-form"

export async function loader({ params, request }: LoaderFunctionArgs) {
  const user = await requireUser(request)
  const customerId = params.id!
  
  const customer = await customerService.getCustomer(customerId)
  
  return json({
    customer,
  })
}

export default function CustomerProfile() {
  const { customer } = useLoaderData<typeof loader>()
  
  return <CustomerProfileForm customer={customer} />
}
```

## Styling Guidelines

Based on your Tailwind CSS + shadcn/ui setup, here are the styling patterns for your ERP application:

### Styling Approach

Your project uses a **utility-first approach** with Tailwind CSS, enhanced by shadcn/ui components built on Radix UI primitives. This provides:

- **Rapid development**: Compose styles directly in JSX with utility classes
- **Consistent design system**: CSS custom properties define your theme
- **Component-based styling**: shadcn/ui components handle complex styling patterns
- **Accessibility built-in**: Radix UI ensures ARIA compliance and keyboard navigation
- **Dark mode support**: CSS variables enable seamless theme switching

**Styling Patterns:**
- Use `cn()` utility for conditional classes and component variants
- Prefer Tailwind utilities over custom CSS
- Use CSS custom properties for theme values
- Follow shadcn/ui patterns for complex components
- Implement responsive design with Tailwind's breakpoint system

### Global Theme Variables

```css
/* app/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colors */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;

    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;

    /* Spacing */
    --radius: 0.5rem;

    /* Typography */
    --font-sans: 'Inter', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

    /* Z-index layers */
    --z-dropdown: 1000;
    --z-sticky: 1020;
    --z-fixed: 1030;
    --z-modal-backdrop: 1040;
    --z-modal: 1050;
    --z-popover: 1060;
    --z-tooltip: 1070;
    --z-toast: 1080;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans;
  }

  /* ERP-specific styling */
  .data-table-row:hover {
    @apply bg-muted/50;
  }

  .form-section {
    @apply space-y-6 p-6 border rounded-lg bg-card;
  }

  .sidebar-nav-item {
    @apply flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors;
    @apply hover:bg-accent hover:text-accent-foreground;
    @apply focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2;
  }

  .sidebar-nav-item[aria-current="page"] {
    @apply bg-accent text-accent-foreground;
  }

  /* Print styles for reports */
  @media print {
    .no-print {
      @apply hidden;
    }
    
    .print-break-after {
      page-break-after: always;
    }
    
    .print-break-before {
      page-break-before: always;
    }
  }
}

@layer components {
  /* Button variants using CSS instead of className variants */
  .btn-primary {
    @apply bg-primary text-primary-foreground hover:bg-primary/90;
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
    @apply disabled:pointer-events-none disabled:opacity-50;
  }

  .btn-secondary {
    @apply bg-secondary text-secondary-foreground hover:bg-secondary/80;
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
    @apply disabled:pointer-events-none disabled:opacity-50;
  }

  /* Data table styling */
  .data-table {
    @apply w-full border-collapse;
  }

  .data-table th {
    @apply border-b border-border bg-muted/50 px-4 py-3 text-left text-sm font-medium text-muted-foreground;
  }

  .data-table td {
    @apply border-b border-border px-4 py-3 text-sm;
  }

  /* Form styling */
  .form-field {
    @apply space-y-2;
  }

  .form-label {
    @apply text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70;
  }

  .form-error {
    @apply text-sm font-medium text-destructive;
  }
}
```

## Testing Requirements

Based on your Vitest + React Testing Library setup, here are the testing patterns for your Remix ERP application:

### Component Test Template

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { CustomerForm } from '@/components/custom/customer-form'
import type { Customer } from '~/sdk/types'

// Mock dependencies
vi.mock('~/apiclient', () => ({
  customerService: {
    createCustomer: vi.fn(),
    updateCustomer: vi.fn(),
  },
}))

vi.mock('@remix-run/react', () => ({
  useNavigate: () => vi.fn(),
  useNavigation: () => ({ state: 'idle' }),
}))

// Test utilities
const mockCustomer: Customer = {
  id: '1',
  name: 'Test Customer',
  email: 'test@example.com',
  phone: '+1234567890',
  address: '123 Main St',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
}

describe('CustomerForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Create mode', () => {
    it('renders form fields correctly', () => {
      render(<CustomerForm mode="create" />)
      
      expect(screen.getByLabelText(/customer name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/address/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create customer/i })).toBeInTheDocument()
    })

    it('validates required fields', async () => {
      const user = userEvent.setup()
      render(<CustomerForm mode="create" />)
      
      const submitButton = screen.getByRole('button', { name: /create customer/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/customer name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      })
    })

    it('validates email format', async () => {
      const user = userEvent.setup()
      render(<CustomerForm mode="create" />)
      
      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'invalid-email')
      
      const submitButton = screen.getByRole('button', { name: /create customer/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
      })
    })

    it('submits form with valid data', async () => {
      const user = userEvent.setup()
      const mockCreate = vi.mocked(customerService.createCustomer)
      mockCreate.mockResolvedValue(mockCustomer)
      
      render(<CustomerForm mode="create" />)
      
      await user.type(screen.getByLabelText(/customer name/i), 'Test Customer')
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/phone/i), '+1234567890')
      await user.type(screen.getByLabelText(/address/i), '123 Main St')
      
      const submitButton = screen.getByRole('button', { name: /create customer/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockCreate).toHaveBeenCalledWith({
          name: 'Test Customer',
          email: 'test@example.com',
          phone: '+1234567890',
          address: '123 Main St',
        })
      })
    })
  })

  describe('Edit mode', () => {
    it('populates form with existing data', () => {
      render(<CustomerForm mode="edit" customer={mockCustomer} />)
      
      expect(screen.getByDisplayValue('Test Customer')).toBeInTheDocument()
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument()
      expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument()
    })

    it('submits updated data', async () => {
      const user = userEvent.setup()
      const mockUpdate = vi.mocked(customerService.updateCustomer)
      mockUpdate.mockResolvedValue({ ...mockCustomer, name: 'Updated Customer' })
      
      render(<CustomerForm mode="edit" customer={mockCustomer} />)
      
      const nameInput = screen.getByDisplayValue('Test Customer')
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Customer')
      
      const submitButton = screen.getByRole('button', { name: /update customer/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith('1', {
          name: 'Updated Customer',
          email: 'test@example.com',
          phone: '+1234567890',
          address: '123 Main St',
        })
      })
    })
  })

  describe('Loading states', () => {
    it('shows loading state during submission', async () => {
      const user = userEvent.setup()
      const mockCreate = vi.mocked(customerService.createCustomer)
      mockCreate.mockImplementation(() => new Promise(() => {})) // Never resolves
      
      render(<CustomerForm mode="create" />)
      
      await user.type(screen.getByLabelText(/customer name/i), 'Test Customer')
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      
      const submitButton = screen.getByRole('button', { name: /create customer/i })
      await user.click(submitButton)
      
      expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled()
    })
  })

  describe('Error handling', () => {
    it('displays error message on API failure', async () => {
      const user = userEvent.setup()
      const mockCreate = vi.mocked(customerService.createCustomer)
      mockCreate.mockRejectedValue(new Error('Failed to create customer'))
      
      render(<CustomerForm mode="create" />)
      
      await user.type(screen.getByLabelText(/customer name/i), 'Test Customer')
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      
      const submitButton = screen.getByRole('button', { name: /create customer/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/failed to create customer/i)).toBeInTheDocument()
      })
    })
  })
})
```

### Testing Best Practices

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test critical user flows (using Cypress/Playwright)
4. **Coverage Goals**: Aim for 80% code coverage
5. **Test Structure**: Arrange-Act-Assert pattern
6. **Mock External Dependencies**: API calls, routing, state management

## Environment Configuration

Based on your Remix v2 ERP application setup, here are the required environment variables and configuration patterns:

**Environment Variables:**

```bash
# .env.example - Template for environment configuration
# Copy to .env and fill in your values

# API Configuration
API_URL=http://localhost:9090
API_TIMEOUT=30000

# Authentication
SESSION_SECRET=your-super-secret-session-key
JWT_SECRET=your-jwt-secret-key
ENCRYPTION_KEY=your-32-character-encryption-key

# Database (if using Remix for backend operations)
DATABASE_URL=postgresql://user:password@localhost:5432/erp_db

# Company/Workspace Configuration
DEFAULT_COMPANY_ID=company-uuid-here
MULTI_TENANCY_ENABLED=true

# File Upload & Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,xlsx,docx

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@company.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@company.com

# Feature Flags
ENABLE_DARK_MODE=true
ENABLE_ANALYTICS=true
ENABLE_DEBUG_MODE=false

# Analytics & Monitoring
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
SENTRY_DSN=https://your-sentry-dsn

# Development Settings
NODE_ENV=development
PORT=3000
DEV_TOOLS_ENABLED=true

# Production Settings (for reference)
# NODE_ENV=production
# SECURE_COOKIES=true
# FORCE_HTTPS=true
```

**Remix Environment Configuration:**

```typescript
// app/lib/env.server.ts - Server-side environment validation
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_URL: z.string().url().default('http://localhost:9090'),
  API_TIMEOUT: z.coerce.number().default(30000),
  SESSION_SECRET: z.string().min(32),
  JWT_SECRET: z.string().min(32),
  DATABASE_URL: z.string().url().optional(),
  DEFAULT_COMPANY_ID: z.string().uuid().optional(),
  MULTI_TENANCY_ENABLED: z.coerce.boolean().default(false),
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE: z.coerce.number().default(10485760),
  ENABLE_DARK_MODE: z.coerce.boolean().default(true),
  ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  ENABLE_DEBUG_MODE: z.coerce.boolean().default(false),
  PORT: z.coerce.number().default(3000),
})

function getEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error('❌ Invalid environment variables:')
    console.error(error.flatten().fieldErrors)
    throw new Error('Invalid environment variables')
  }
}

// Export validated environment
export const env = getEnv()

// Type-safe environment access
export type Env = z.infer<typeof envSchema>
```

**Client-side Environment (Public Variables):**

```typescript
// app/lib/env.client.ts - Client-side environment (public variables only)
declare global {
  interface Window {
    ENV: {
      API_URL: string
      ENABLE_DARK_MODE: boolean
      ENABLE_ANALYTICS: boolean
      GOOGLE_ANALYTICS_ID?: string
    }
  }
}

// Access client environment (populated by root.tsx)
export const clientEnv = typeof window !== 'undefined' ? window.ENV : null
```
