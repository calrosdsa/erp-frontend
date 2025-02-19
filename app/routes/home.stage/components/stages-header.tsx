import { components } from "~/sdk"

export default function StagesHeader({stages}:{
    stages:components["schemas"]["StageDto"][]
}){
    return (
        <div className="flex space-x-1 rounded-sm">
            {stages.map((stage,idx)=>{
                return (
                    <div style={{
                        backgroundColor:stage.color,
                    }} className="px-2 py-1 text-white">
                        <span>{stage.name}</span>
                    </div>
                )
                    
            })}
        </div>
    )
}