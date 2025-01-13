import { z } from "zod";
import { components } from "~/sdk";
import slugify from 'react-slugify';

export type ModuleDataType = z.infer<typeof moduleDataSchema>
export type ModuleSectionDataType = z.infer<typeof moduleSectionDataSchema>


export const moduleSectionDataSchema = z.object({
    module_id:z.number(),
    name:z.string(),
    entity_id:z.number(),
    entity_name:z.string(),
})

export const moduleDataSchema = z.object({
    id:z.number().optional(),
    label:z.string(),
    icon:z.string(),
    sections:z.array(moduleSectionDataSchema)
})


export const mapToModuleSectionData = (e:ModuleSectionDataType):components["schemas"]["ModuleSectionData"] =>{
    const d:components["schemas"]["ModuleSectionData"] = {
        entity_id: e.entity_id,
        module_id: e.module_id,
        name: e.name,
    }
    return d
}

export const mapToModuleData = (e:ModuleDataType):components["schemas"]["ModuleData"] =>{
    const d:components["schemas"]["ModuleData"] = {
        fields: {
            href:slugify(e.label),
            icon: e.icon,
            label: e.label
        },
        sections: e.sections.map(t=>mapToModuleSectionData(t))
    } 
    return d
}