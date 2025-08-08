# Routing

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
