export const DEFAULT_SIZE = "15"
export const DEFAULT_PAGE = "0"


export let API_URL = 
  typeof process !== 'undefined' ?
  process.env.API_URL || "http://localhost:9090"
  :"http://localhost:9090"

  