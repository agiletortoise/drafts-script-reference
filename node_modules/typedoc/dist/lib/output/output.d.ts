import type { Application } from "../application.js";
import type { ProjectReflection } from "../models/index.js";
import { type OutputSpecification } from "../utils/options/declaration.js";
export declare class Outputs {
    readonly application: Application;
    private outputs;
    private defaultOutput;
    constructor(application: Application);
    addOutput(name: string, output: (path: string, project: ProjectReflection) => Promise<void>): void;
    setDefaultOutputName(name: string): void;
    getOutputSpecs(): OutputSpecification[];
    writeOutputs(project: ProjectReflection): Promise<void>;
    writeOutput(output: OutputSpecification, project: ProjectReflection): Promise<void>;
}
