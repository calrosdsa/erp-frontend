# Component Standards

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
