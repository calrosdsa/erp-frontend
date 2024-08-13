
  export interface SquareSalesOrderResponse {
    squareSubscription: SquareSubscription
    subscription: Subscription
  }
  
  export interface SquareSubscription {
    ID: number
    CreatedAt: string
    DeletedAt: any
    UpdatedAt: string
    SubscriptionId: string
    CustomerId: string
    PlanVariationId: string
    Status: string
  }
  
  export interface Subscription {
    subscription: Subscription2
  }
  
  export interface Subscription2 {
    id: string
    location_id: string
    customer_id: string
    start_date: string
    canceled_date: string
    charged_through_date: string
    status: string
    invoice_ids: string[]
    version: number
    created_at: string
    card_id: string
    timezone: string
    source: Source
    actions: SubscriptionAction[]
    monthly_billing_anchor_date: number
    plan_variation_id: string
  }
  
  export interface Source {
    name: string
  }
  
  export interface SubscriptionAction {
    id: string
    type: string
    effective_date: string
  }
  

  export enum SquareSubscriptionStatus {
    ACTIVE = "ACTIVE"
  }