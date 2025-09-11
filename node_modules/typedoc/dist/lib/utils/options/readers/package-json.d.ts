import type { OptionsReader } from "../index.js";
import type { Options } from "../options.js";
import { type Logger } from "#utils";
export declare class PackageJsonReader implements OptionsReader {
    order: number;
    supportsPackages: boolean;
    name: string;
    read(container: Options, logger: Logger, cwd: string, usedFile: (path: string) => void): void;
}
