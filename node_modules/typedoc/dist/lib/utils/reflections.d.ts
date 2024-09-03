import { type ProjectReflection, type ReferenceType, Reflection } from "../models";
export declare function discoverAllReferenceTypes(project: ProjectReflection, forExportValidation: boolean): {
    type: ReferenceType;
    owner: Reflection;
}[];
