import { Boxes } from "lucide-react"

export const DEFAULT_SIZE = "20"
export const DEFAULT_PAGE = "0"

export const DEFAULT_COMPANY_NAME = "ERP"

export const CURRENCY_CODES:CurrencyCode[] = [
  {Code:"BOB"},{Code:"US"}
]

export let API_URL = 
  typeof process !== 'undefined' ?
  process.env.API_URL || "http://localhost:9090"
  :"http://localhost:9090"


type CurrencyCode = {
  Code:string
}  
  

export const MIN_LENGTH = 3
export const MAX_LENGTH = 50
