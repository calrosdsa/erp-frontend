

export function findItem<T,K extends keyof T>(data:T[],key:K,value:string | number):T | undefined{
    return data.find(item=>item[key]==value)
}