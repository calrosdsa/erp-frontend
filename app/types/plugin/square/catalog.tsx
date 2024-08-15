export interface SquareCatalogObject {
    object: Object
  }
  
  export interface Object {
    type: string
    id: string
    updated_at: string
    created_at: string
    version: number
    is_deleted: boolean
    present_at_all_locations: boolean
    subscription_plan_variation_data?: SubscriptionPlanVariationData
  }
  
  export interface SubscriptionPlanVariationData {
    name: string
    phases: Phase[]
    subscription_plan_id: string
  }
  
  export interface Phase {
    uid: string
    cadence: string
    periods: number
    ordinal: number
    pricing: Pricing
  }
  
  export interface Pricing {
    type: string
    price: Price
    price_money: PriceMoney
  }
  
  export interface Price {
    amount: number
    currency: string
  }
  
  export interface PriceMoney {
    amount: number
    currency: string
  }
  