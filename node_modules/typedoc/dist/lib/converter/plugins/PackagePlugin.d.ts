import { ConverterComponent } from "../components.js";
import type { Converter } from "../converter.js";
import { type GlobString } from "#utils";
import { type EntryPointStrategy } from "#node-utils";
/**
 * A handler that tries to find the package.json and readme.md files of the
 * current project.
 */
export declare class PackagePlugin extends ConverterComponent {
    accessor readme: string;
    accessor entryPointStrategy: EntryPointStrategy;
    accessor entryPoints: GlobString[];
    accessor includeVersion: boolean;
    /**
     * The file name of the found readme.md file.
     */
    private readmeFile?;
    /**
     * Contents of the readme.md file discovered, if any
     */
    private readmeContents?;
    /**
     * Contents of package.json for the active project
     */
    private packageJson?;
    constructor(owner: Converter);
    private onRevive;
    private onBegin;
    private onBeginResolve;
    private addEntries;
}
