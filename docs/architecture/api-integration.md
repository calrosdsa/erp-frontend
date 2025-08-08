# API Integration

Based on your OpenAPI-generated client with typed endpoints, here are the API integration patterns for your Remix ERP application, updated with real-world examples from the Deal modal implementation:

## Real-World Implementation Example

### Deal Route Action/Loader Pattern

```typescript
import { DealData, mapToDealData } from "~/util/data/schemas/crm/deal-schema";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import { DEFAULT_ID, LOAD_ACTION, MAX_SIZE } from "~/constant";
import { Entity } from "~/types/enums";
import { components } from "~/sdk";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { ItemLineType, itemLineTypeToJSON } from "~/gen/common";

// Action Data Type using Zod Schema
type ActionData = {
  action: string;
  dealData: DealData; // From zod schema type: z.infer<typeof dealSchema>
};

// Action Handler - Handles CRUD operations
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request }); // Pass request for auth/session context
  const data = (await request.json()) as ActionData;
  
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let deal: components["schemas"]["DealDto"] | undefined = undefined;
  let action = LOAD_ACTION;
  let shouldRevalidate: boolean = false;

  switch (data.action) {
    case "edit": {
      const res = await client.PUT("/deal", {
        body: mapToDealData(data.dealData), // Transform Zod schema to API format
      });
      error = res.error?.detail;
      message = res.data?.message;
      shouldRevalidate = true;
      break;
    }
    case "create": {
      const res = await client.POST("/deal", {
        body: mapToDealData(data.dealData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      deal = res.data?.result;
      shouldRevalidate = true;
      break;
    }
  }

  return json({
    action,
    error,
    message,
    deal,
    shouldRevalidate,
  });
};

// Loader - Fetches data for the route
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  const entityId = searchParams.get("entity_id") ?? Entity.DEAL.toString();
  
  let stages: components["schemas"]["StageDto"][] = [];
  let dealData: components["schemas"]["EntityResponseResultEntityDealDetailDtoBody"] | undefined = undefined;
  let lineItems: components["schemas"]["LineItemDto"][] = [];

  if (params.id != DEFAULT_ID) {
    // Parallel API calls for better performance
    const [stagesRes, dealRes, lineItemsRes] = await Promise.all([
      client.GET("/stage", {
        params: {
          query: {
            size: MAX_SIZE,
            entity_id: entityId,
            column: "index",
            orientation: "ASC",
          },
        },
      }),
      client.GET("/deal/detail/{id}", {
        params: {
          path: {
            id: params.id || "",
          },
        },
      }),
      client.GET("/item-line", {
        params: {
          query: {
            line_type: itemLineTypeToJSON(ItemLineType.DEAL_LINE_ITEM),
            id: params.id,
          },
        },
      }),
    ]);

    stages = stagesRes.data?.result || [];
    dealData = dealRes?.data;
    lineItems = lineItemsRes.data?.result || [];
  }

  return json({
    stages: stages || [],
    deal: dealData?.result.entity.deal || null,
    observers: dealData?.result.entity.participants || [],
    activities: dealData?.result.activities || [],
    actions: dealData?.actions,
    contacts: dealData?.result.contacts || [],
    entityActions: dealData?.associated_actions,
    lineItems,
  });
};

// Revalidation Strategy
export function shouldRevalidate({
  formMethod,
  defaultShouldRevalidate,
  actionResult,
}: ShouldRevalidateFunctionArgs) {
  if (actionResult?.shouldRevalidate) {
    return defaultShouldRevalidate;
  }
  return false;
}
```

## Key Patterns from Real Implementation

### 1. Schema-to-API Mapping
```typescript
// Zod schema for form validation
export const dealSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  stage: fieldRequired,
  customer: fieldNull,
  amount: z.coerce.number(),
  currency: field,
  deal_type: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  source_information: z.string().nullable().optional(),
  start_date: z.date(),
  end_date: z.date().optional().nullable(),
  available_for_everyone: z.boolean(),
  responsible: fieldRequired,
  contacts: z.array(contactDataSchema),
  index: z.number(),
  observers: z.array(observerSchema),
});

export type DealData = z.infer<typeof dealSchema>;

// Transformation function to map Zod schema to API format
export function mapToDealData(dealData: DealData): components["schemas"]["DealCreateDto"] {
  return {
    // Transform properties as needed for API
    ...dealData,
    // Handle any specific API requirements
  };
}
```

### 2. Request Context Pattern
```typescript
// apiClient function receives request for session/auth context
const client = apiClient({ request });
```

### 3. Parallel API Calls
```typescript
// Execute multiple API calls simultaneously for better performance
const [stagesRes, dealRes, lineItemsRes] = await Promise.all([
  client.GET("/stage", { /* params */ }),
  client.GET("/deal/detail/{id}", { /* params */ }),
  client.GET("/item-line", { /* params */ }),
]);
```

### 4. Conditional Data Loading
```typescript
// Only fetch detailed data when not creating new records
if (params.id != DEFAULT_ID) {
  // Fetch existing data
}
```

### 5. Type-Safe API Responses
```typescript
// Use generated types from OpenAPI schema
let deal: components["schemas"]["DealDto"] | undefined = undefined;
let dealData: components["schemas"]["EntityResponseResultEntityDealDetailDtoBody"] | undefined = undefined;
```

## API Client Configuration

```typescript
import createClient from 'openapi-fetch'
import type { paths } from '~/sdk/types'

// Get API base URL from environment with fallback
const API_BASE_URL = process.env.API_URL || 'http://localhost:9090'

// Create typed API client with request context
export default function apiClient({ request }: { request?: Request } = {}) {
  const client = createClient<paths>({
    baseUrl: API_BASE_URL,
  })

  // Request interceptor for authentication and session context
  client.use({
    onRequest({ request: apiRequest, options }) {
      // Extract session/auth data from Remix request
      if (request) {
        // Add session-based authentication
        const authHeader = request.headers.get('Authorization')
        if (authHeader) {
          apiRequest.headers.set('Authorization', authHeader)
        }
        
        // Add company context from session
        const companyId = getCompanyFromSession(request)
        if (companyId) {
          apiRequest.headers.set('X-Company-ID', companyId)
        }
      }

      return apiRequest
    },

    onResponse({ request, response, options }) {
      // Handle API responses and errors
      if (!response.ok) {
        handleError(response.status, response.statusText)
      }
      return response
    },
  })

  return client
}

function getCompanyFromSession(request: Request): string | null {
  // Extract company context from Remix session
  // Implementation depends on your session management
  return null
}
```

