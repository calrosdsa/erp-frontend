# ERP Frontend Application

A modern, full-stack ERP (Enterprise Resource Planning) application built with Remix v2, TypeScript, and Tailwind CSS. This system provides comprehensive business management capabilities for small-to-medium businesses including customer management, inventory tracking, purchase orders, invoicing, and business intelligence reporting.

[![Remix](https://img.shields.io/badge/Remix-v2-blue.svg)](https://remix.run)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-blue.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-06B6D4.svg)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)

## 🚀 Features

### Core Business Modules
- **Customer & Supplier Management** - Complete CRM with contact management and transaction history
- **Inventory Management** - Product catalog, stock tracking, and automated low-stock alerts  
- **Purchase Order Workflow** - End-to-end procurement with approval workflows and supplier management
- **Invoicing & Payment Tracking** - Professional invoice generation with accounts receivable management
- **Reporting & Analytics** - Configurable business intelligence with export capabilities
- **Task & Deal Management** - Kanban-style project management with CRM pipeline tracking

### Technical Highlights
- **Full-Stack Architecture** - Remix v2 with server-side rendering and client-side interactivity
- **Type-Safe API Integration** - OpenAPI-generated clients with end-to-end type safety
- **Modern UI Components** - shadcn/ui with Radix UI primitives for accessibility
- **Role-Based Access Control** - Workspace isolation with granular permissions
- **Responsive Design** - Desktop-first with full tablet and mobile browser support
- **Internationalization** - i18next integration with English and Spanish locales
- **Real-time Updates** - WebSocket integration for live data synchronization

## 🛠 Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | Remix v2 | Full-stack React framework with SSR/SSG |
| **Build Tool** | Vite | Fast bundling and development server |
| **UI Library** | React 18 | Component-based user interface |
| **Components** | shadcn/ui + Radix UI | Accessible, customizable component library |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **State Management** | Zustand | Lightweight client state management |
| **Forms** | React Hook Form + Zod | Type-safe form validation |
| **API Client** | openapi-fetch | Generated type-safe API client |
| **Language** | TypeScript | Static type checking |
| **Internationalization** | i18next | Multi-language support |

## 📋 Prerequisites

- **Node.js** 20.0.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control
- **Backend API** running on port 9090 (configurable via `API_URL`)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd erp-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Configure your environment variables
# API_URL=http://localhost:9090
# SESSION_SECRET=your-super-secret-session-key
```

### 4. Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot module replacement |
| `npm run build` | Build application for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint with caching |
| `npm run typecheck` | Run TypeScript compiler checks |

## 🏗 Project Structure

```
erp-frontend/
├── app/                          # Remix application directory
│   ├── components/               # Reusable UI components (aliased as @/components)
│   │   ├── ui/                   # Base shadcn/ui components
│   │   ├── custom/               # Custom business components
│   │   ├── layout/               # Layout and navigation components
│   │   └── form/                 # Smart form components
│   ├── routes/                   # File-based routing (Remix convention)
│   │   ├── home/                 # Main ERP modules
│   │   ├── admin/                # Administrative interfaces
│   │   └── api/                  # API route handlers
│   ├── types/                    # TypeScript type definitions
│   ├── util/                     # Utility functions and hooks
│   ├── sdk/                      # Generated OpenAPI types and schemas
│   ├── apiclient.tsx             # API client configuration
│   ├── root.tsx                  # Root component with providers
│   └── global.css                # Global styles with Tailwind imports
├── @/                            # Component alias directory
├── public/                       # Static assets
├── docs/                         # Comprehensive project documentation
└── README.md                     # This file
```

## 🔐 Authentication & Authorization

The application implements session-based authentication with role-based access control:

- **Session Management** - HTTP-only cookies with CSRF protection
- **User Roles** - Admin, Manager, User, Viewer with hierarchical permissions
- **Workspace Isolation** - Multi-tenant architecture with data segregation
- **Protected Routes** - Automatic redirect to `/signin` for unauthorized access
- **API Security** - Automatic auth headers and company context injection

## 🎨 UI/UX Features

### Design System
- **shadcn/ui Components** - Consistent, accessible design system
- **Dark/Light Mode** - System-wide theme switching
- **Responsive Layout** - Mobile-first design with desktop optimization
- **Component Variants** - Flexible styling with Tailwind utilities

### Navigation Patterns
- **File-based Routing** - Intuitive URL structure following business domains
- **Modal Routes** - Detail views as overlays maintaining context
- **Tab Navigation** - Organized information architecture within entities
- **Breadcrumb Navigation** - Clear hierarchy and location awareness

### User Experience
- **Real-time Updates** - WebSocket integration for live data
- **Loading States** - Progressive loading with skeleton screens
- **Error Boundaries** - Graceful error handling and recovery
- **Form Validation** - Real-time validation with helpful error messages

## 🌐 API Integration

### Type-Safe API Client
The application uses `openapi-fetch` with generated types from the backend OpenAPI specification:

```typescript
// Automatic type inference from OpenAPI schema
const { data, error } = await api.GET('/api/customers/{id}', {
  params: { path: { id: customerId } }
})
```

### API Configuration
- **Base URL** - Configurable via `API_URL` environment variable (default: `http://localhost:9090`)
- **Authentication** - Automatic injection of auth headers and company context
- **Error Handling** - Global error interceptors with status code handling
- **Request/Response Logging** - Development logging for API calls

## 🔧 Development Guidelines

### Code Standards
- **TypeScript Strict Mode** - Full type safety throughout the application
- **ESLint + Prettier** - Automated code formatting and linting
- **Path Aliases** - `~/` for app directory, `@/` for components
- **Component Patterns** - Consistent prop interfaces and forwardRef usage

### Styling Conventions
- **Tailwind Utilities** - Utility-first approach with the `cn()` helper
- **Component Variants** - Use class-variance-authority for component APIs
- **Responsive Design** - Mobile-first breakpoints with desktop enhancement
- **Accessibility** - WCAG 2.1 AA compliance through Radix UI primitives

### State Management
- **Server State** - Managed through Remix loaders/actions
- **Client State** - Zustand stores for UI state and complex interactions
- **Form State** - React Hook Form with Zod schema validation
- **Global Context** - Application-wide data through Remix context

## 📊 Business Modules

### Customer & Supplier Management
- **Entity CRUD Operations** - Full create, read, update, delete capabilities
- **Contact Management** - Multiple contacts per entity with role assignment
- **Transaction History** - Complete audit trail of business interactions
- **Import/Export** - Bulk data operations with CSV/Excel support

### Inventory Management  
- **Product Catalog** - Comprehensive product information with categories
- **Stock Tracking** - Real-time inventory levels across multiple locations
- **Automated Alerts** - Configurable low-stock notifications and reorder points
- **Cost Management** - FIFO/LIFO/Average cost methods with variance tracking

### Purchase Orders
- **Order Creation** - Multi-line purchase orders with supplier integration
- **Approval Workflows** - Configurable authorization based on amount and category
- **Supplier Communication** - PDF generation and email transmission
- **Goods Receiving** - Inventory updates with quality inspection tracking

### Invoicing & Payments
- **Professional Invoices** - Branded PDF generation with customizable templates
- **Payment Tracking** - Complete accounts receivable with aging reports
- **Customer Communication** - Automated follow-ups and payment reminders
- **Multi-currency Support** - International business capability

### Reporting & Analytics
- **Report Builder** - Drag-and-drop interface for custom reports
- **Financial Reports** - P&L, cash flow, and budget variance analysis
- **Operational Metrics** - Inventory turnover, supplier performance, customer analytics
- **Executive Dashboard** - Real-time KPIs with mobile-responsive design


## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
The application includes Docker configuration for containerized deployment:

```bash
docker build -t erp-frontend .
docker run -p 3000:3000 -e API_URL=https://api.yourdomain.com erp-frontend
```
