import { ConverterComponent } from "../components";
import type { Context } from "../../converter";
import { type ValidationOptions } from "../../utils";
import { type ProjectReflection } from "../../models";
/**
 * A plugin that resolves `{@link Foo}` tags.
 */
export declare class LinkResolverPlugin extends ConverterComponent {
    accessor validation: ValidationOptions;
    initialize(): void;
    onResolve(context: Context): void;
    resolveLinks(project: ProjectReflection): void;
    private resolveCategoryLinks;
}
