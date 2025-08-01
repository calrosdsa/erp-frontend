import { redirect } from "@remix-run/node"

export const loader = async()=>{
    console.log("LOADING LOADER")
    return redirect("/home")
}

export default function Index(){
    return <h1>H</h1>
}