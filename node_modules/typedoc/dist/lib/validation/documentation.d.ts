import { type ProjectReflection, ReflectionKind } from "../models/index.js";
import { type Logger } from "#utils";
export declare function validateDocumentation(project: ProjectReflection, logger: Logger, requiredToBeDocumented: readonly ReflectionKind.KindString[], intentionallyNotDocumented: readonly string[], packagesRequiringDocumentation: readonly string[]): void;
