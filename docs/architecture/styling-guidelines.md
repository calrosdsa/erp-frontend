# Styling Guidelines

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
