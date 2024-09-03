import { Converter } from "./converter/index";
import { Renderer } from "./output/renderer";
import { Deserializer, Serializer } from "./serialization";
import type { ProjectReflection } from "./models/index";
import { Logger, type OptionsReader } from "./utils/index";
import { type AbstractComponent, ChildableComponent } from "./utils/component";
import { Options } from "./utils";
import type { TypeDocOptions } from "./utils/options/declaration";
import { type DocumentationEntryPoint, EntryPointStrategy } from "./utils/entry-point";
import { Internationalization } from "./internationalization/internationalization";
import { FileRegistry } from "./models/FileRegistry";
export declare function createAppForTesting(): Application;
export interface ApplicationEvents {
    bootstrapEnd: [Application];
    reviveProject: [ProjectReflection];
    validateProject: [ProjectReflection];
}
/**
 * The default TypeDoc main application class.
 *
 * This class holds the two main components of TypeDoc, the {@link Converter} and
 * the {@link Renderer}. When running TypeDoc, first the {@link Converter} is invoked which
 * generates a {@link ProjectReflection} from the passed in source files. The
 * {@link ProjectReflection} is a hierarchical model representation of the TypeScript
 * project. Afterwards the model is passed to the {@link Renderer} which uses an instance
 * of {@link Theme} to generate the final documentation.
 *
 * Both the {@link Converter} and the {@link Renderer} emit a series of events while processing the project.
 * Subscribe to these Events to control the application flow or alter the output.
 *
 * @remarks
 *
 * Access to an Application instance can be retrieved with {@link Application.bootstrap} or
 * {@link Application.bootstrapWithPlugins}. It can not be constructed manually.
 */
export declare class Application extends ChildableComponent<Application, AbstractComponent<Application, {}>, ApplicationEvents> {
    /**
     * The converter used to create the declaration reflections.
     */
    converter: Converter;
    /**
     * The renderer used to generate the documentation output.
     */
    renderer: Renderer;
    /**
     * The serializer used to generate JSON output.
     */
    serializer: Serializer;
    /**
     * The deserializer used to restore previously serialized JSON output.
     */
    deserializer: Deserializer;
    /**
     * The logger that should be used to output messages.
     */
    logger: Logger;
    /**
     * Internationalization module which supports translating according to
     * the `lang` option.
     */
    internationalization: Internationalization;
    /**
     * Proxy based shortcuts for internationalization keys.
     */
    i18n: import("./internationalization/internationalization").TranslationProxy;
    options: Options;
    files: FileRegistry;
    /** @internal */
    accessor lang: string;
    /** @internal */
    accessor skipErrorChecking: boolean;
    /** @internal */
    accessor entryPointStrategy: EntryPointStrategy;
    /** @internal */
    accessor entryPoints: string[];
    /**
     * The version number of TypeDoc.
     */
    static readonly VERSION: string;
    /**
     * Emitted after plugins have been loaded and options have been read, but before they have been frozen.
     * The listener will be given an instance of {@link Application}.
     */
    static readonly EVENT_BOOTSTRAP_END: "bootstrapEnd";
    /**
     * Emitted after a project has been deserialized from JSON.
     * The listener will be given an instance of {@link ProjectReflection}.
     */
    static readonly EVENT_PROJECT_REVIVE: "reviveProject";
    /**
     * Emitted when validation is being run.
     * The listener will be given an instance of {@link ProjectReflection}.
     */
    static readonly EVENT_VALIDATE_PROJECT: "validateProject";
    /**
     * Create a new TypeDoc application instance.
     */
    private constructor();
    /**
     * Initialize TypeDoc, loading plugins if applicable.
     */
    static bootstrapWithPlugins(options?: Partial<TypeDocOptions>, readers?: readonly OptionsReader[]): Promise<Application>;
    /**
     * Initialize TypeDoc without loading plugins.
     *
     * @example
     * Initialize the application with pretty-printing output disabled.
     * ```ts
     * const app = Application.bootstrap({ pretty: false });
     * ```
     *
     * @param options Options to set during initialization
     * @param readers Option readers to use to discover options from config files.
     */
    static bootstrap(options?: Partial<TypeDocOptions>, readers?: readonly OptionsReader[]): Promise<Application>;
    private _bootstrap;
    private setOptions;
    /**
     * Return the path to the TypeScript compiler.
     */
    getTypeScriptPath(): string;
    getTypeScriptVersion(): string;
    /**
     * Gets the entry points to be documented according to the current `entryPoints` and `entryPointStrategy` options.
     * May return undefined if entry points fail to be expanded.
     */
    getEntryPoints(): DocumentationEntryPoint[] | undefined;
    /**
     * Run the converter for the given set of files and return the generated reflections.
     *
     * @returns An instance of ProjectReflection on success, undefined otherwise.
     */
    convert(): Promise<ProjectReflection | undefined>;
    convertAndWatch(success: (project: ProjectReflection) => Promise<void>): void;
    validate(project: ProjectReflection): void;
    /**
     * Render HTML for the given project
     */
    generateDocs(project: ProjectReflection, out: string): Promise<void>;
    /**
     * Write the reflections to a json file.
     *
     * @param out The path and file name of the target file.
     * @returns Whether the JSON file could be written successfully.
     */
    generateJson(project: ProjectReflection, out: string): Promise<void>;
    /**
     * Print the version number.
     */
    toString(): string;
    private _convertPackages;
    private _merge;
}
