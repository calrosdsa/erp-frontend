import { z } from "zod";
import { components } from "~/sdk";
import slugify from 'react-slugify';
import { ItemActionSchema, ItemSchema } from "..";

export type ModuleDataType = z.infer<typeof moduleDataSchema>
export type ModuleSectionDataType = z.infer<typeof moduleSectionDataSchema>


export const moduleSectionDataSchema = z.object({
    module_id:z.number().optional(),
    section_name:z.string(),
    entity_id:z.number(),
    entity_name:z.string(),
})

export const moduleDataSchema = z.object({
    id:z.number().optional(),
    label:z.string(),
    icon_code:z.string().nullable(),
    icon_name:z.string().nullable(),
    href:z.string().optional(),
    has_direct_access:z.boolean(),
    priority:z.coerce.number(),
    sections:z.array(moduleSectionDataSchema)
})

export const mapToModuleSectionSchema = (e:components["schemas"]["ModuleSectionDto"],moduleID:number):ModuleSectionDataType =>{
    const d:ModuleSectionDataType = {
        entity_id: e.id,
        module_id: moduleID,
        section_name:e.section_name,
        entity_name: e.name,
    }
    return d
}

export const mapModuleDtoToItem = (e:components["schemas"]["ModuleDto"]) =>{
    const d:ItemSchema = {
        id:e.id,
        name:e.label,
    }
    return d
}


export const mapToModuleSectionData = (e:ModuleSectionDataType):components["schemas"]["ModuleSectionData"] =>{
    const d:components["schemas"]["ModuleSectionData"] = {
        entity_id: e.entity_id,
        module_id: e.module_id || 0,
        name: e.section_name,
        entity_name: e.entity_name
    }
    return d
}

export const mapToModuleData = (e:ModuleDataType):components["schemas"]["ModuleData"] =>{
    const d:components["schemas"]["ModuleData"] = {
        id:e.id,
        fields: {
            href:e.href || slugify(e.label),
            icon_code: e.icon_code,
            icon_name:e.icon_name,
            label: e.label,
            has_direct_access:e.has_direct_access,
            priority:e.priority,
        },
        sections: e.sections.map(t=>mapToModuleSectionData(t))
    } 
    return d
}