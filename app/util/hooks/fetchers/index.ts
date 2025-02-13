export const formatQuery = (e:string)=>{
    if(e == ""){
        return undefined
    }
    return `["like","${e}"]`
}