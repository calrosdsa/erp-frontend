

export const fullName = (firstName:string,lastName?:string | null) =>{
    if(!lastName) return firstName
    return `${firstName} ${lastName}`
}