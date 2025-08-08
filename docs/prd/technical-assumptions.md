# Technical Assumptions

### Repository Structure: Monorepo
Single repository containing both frontend (Remix v2) and backend services with shared TypeScript type definitions generated from OpenAPI specifications. This aligns with your current project structure and enables efficient development workflow with synchronized API contracts.

### Service Architecture
Full-stack Remix v2 application with integrated backend API services following RESTful patterns. The architecture leverages Remix's server-side rendering capabilities combined with OpenAPI-generated client types for end-to-end type safety. Backend services provide business logic and data persistence while frontend handles presentation and user interaction through server-side rendering with selective client-side hydration.

### Testing Requirements
Comprehensive testing pyramid including unit tests for business logic, integration tests for API endpoints and database interactions, and end-to-end tests for critical user workflows. Testing framework should integrate with TypeScript compilation and support automated CI/CD pipeline execution. Manual testing convenience methods required for complex ERP workflow validation.

### Additional Technical Assumptions and Requests
- **Database:** PostgreSQL with Prisma ORM for type-safe database operations and migration management
- **Authentication:** Session-based authentication with secure HTTP-only cookies and CSRF protection
- **State Management:** Zustand for client-side state with server state managed through Remix loaders/actions
- **Styling:** Tailwind CSS with shadcn/ui component library for consistent design system
- **Build System:** Vite bundler with TypeScript compilation and hot module replacement
- **API Specification:** OpenAPI 3.0 for API documentation and type generation
- **Deployment:** Docker containerization with cloud-native deployment capabilities (AWS/GCP/Azure)
- **Development Tools:** ESLint, Prettier, TypeScript strict mode, and automated pre-commit hooks
- **Performance Monitoring:** Real-time application performance monitoring and error tracking
- **CI/CD Pipeline:** Automated testing, building, and deployment with branch protection and code quality gates
