"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntryPointStrategy = void 0;
exports.getEntryPoints = getEntryPoints;
exports.getDocumentEntryPoints = getDocumentEntryPoints;
exports.getWatchEntryPoints = getWatchEntryPoints;
exports.getPackageDirectories = getPackageDirectories;
exports.getExpandedEntryPointsForPaths = getExpandedEntryPointsForPaths;
const path_1 = require("path");
const typescript_1 = __importDefault(require("typescript"));
const FS = __importStar(require("fs"));
const package_manifest_1 = require("./package-manifest");
const paths_1 = require("./paths");
const fs_1 = require("./fs");
const general_1 = require("./general");
/**
 * Defines how entry points are interpreted.
 * @enum
 */
exports.EntryPointStrategy = {
    /**
     * The default behavior in v0.22+, expects all provided entry points as being part of a single program.
     * Any directories included in the entry point list will result in `dir/index.([cm][tj]s|[tj]sx?)` being used.
     */
    Resolve: "resolve",
    /**
     * The default behavior in v0.21 and earlier. Behaves like the resolve behavior, but will recursively
     * expand directories into an entry point for each file within the directory.
     */
    Expand: "expand",
    /**
     * Run TypeDoc in each directory passed as an entry point. Once all directories have been converted,
     * use the merge option to produce final output.
     */
    Packages: "packages",
    /**
     * Merges multiple previously generated output from TypeDoc's --json output together into a single project.
     */
    Merge: "merge",
};
function getEntryPoints(logger, options) {
    if (!options.isSet("entryPoints")) {
        logger.warn(logger.i18n.no_entry_points_provided());
        return [];
    }
    const entryPoints = options.getValue("entryPoints");
    const exclude = options.getValue("exclude");
    // May be set explicitly to be an empty array to only include a readme for a package
    // See #2264
    if (entryPoints.length === 0) {
        return [];
    }
    let result;
    const strategy = options.getValue("entryPointStrategy");
    switch (strategy) {
        case exports.EntryPointStrategy.Resolve:
            result = getEntryPointsForPaths(logger, expandGlobs(entryPoints, exclude, logger), options);
            break;
        case exports.EntryPointStrategy.Expand:
            result = getExpandedEntryPointsForPaths(logger, expandGlobs(entryPoints, exclude, logger), options);
            break;
        case exports.EntryPointStrategy.Merge:
        case exports.EntryPointStrategy.Packages:
            // Doesn't really have entry points in the traditional way of how TypeDoc has dealt with them.
            return [];
        default:
            (0, general_1.assertNever)(strategy);
    }
    if (result.length === 0) {
        logger.error(logger.i18n.unable_to_find_any_entry_points());
        return;
    }
    return result;
}
/**
 * Document entry points are markdown documents that the user has requested we include in the project with
 * an option rather than a `@document` tag.
 *
 * @returns A list of `.md` files to include in the documentation as documents.
 */
function getDocumentEntryPoints(logger, options) {
    const docGlobs = options.getValue("projectDocuments");
    if (docGlobs.length === 0) {
        return [];
    }
    const docPaths = expandGlobs(docGlobs, [], logger);
    // We might want to expand this in the future, there are quite a lot of extensions
    // that have at some point or another been used for markdown: https://superuser.com/a/285878
    const supportedFileRegex = /\.(md|markdown)$/;
    const expanded = expandInputFiles(logger, docPaths, options, supportedFileRegex);
    const baseDir = options.getValue("basePath") || (0, fs_1.deriveRootDir)(expanded);
    return expanded.map((path) => {
        return {
            displayName: (0, path_1.relative)(baseDir, path).replace(/\.[^.]+$/, ""),
            path,
        };
    });
}
function getWatchEntryPoints(logger, options, program) {
    let result;
    const entryPoints = options.getValue("entryPoints");
    const exclude = options.getValue("exclude");
    const strategy = options.getValue("entryPointStrategy");
    switch (strategy) {
        case exports.EntryPointStrategy.Resolve:
            result = getEntryPointsForPaths(logger, expandGlobs(entryPoints, exclude, logger), options, [program]);
            break;
        case exports.EntryPointStrategy.Expand:
            result = getExpandedEntryPointsForPaths(logger, expandGlobs(entryPoints, exclude, logger), options, [program]);
            break;
        case exports.EntryPointStrategy.Packages:
            logger.error(logger.i18n.watch_does_not_support_packages_mode());
            break;
        case exports.EntryPointStrategy.Merge:
            logger.error(logger.i18n.watch_does_not_support_merge_mode());
            break;
        default:
            (0, general_1.assertNever)(strategy);
    }
    if (result && result.length === 0) {
        logger.error(logger.i18n.unable_to_find_any_entry_points());
        return;
    }
    return result;
}
function getPackageDirectories(logger, options, packageGlobPaths) {
    const exclude = (0, paths_1.createMinimatch)(options.getValue("exclude"));
    const rootDir = (0, fs_1.deriveRootDir)(packageGlobPaths);
    // packages arguments are workspace tree roots, or glob patterns
    // This expands them to leave only leaf packages
    return (0, package_manifest_1.expandPackages)(logger, rootDir, packageGlobPaths, exclude);
}
function getModuleName(fileName, baseDir) {
    return (0, paths_1.normalizePath)((0, path_1.relative)(baseDir, fileName)).replace(/(\/index)?(\.d)?\.([cm][tj]s|[tj]sx?)$/, "");
}
/**
 * Converts a list of file-oriented paths in to DocumentationEntryPoints for conversion.
 * This is in contrast with the package-oriented `getEntryPointsForPackages`
 */
function getEntryPointsForPaths(logger, inputFiles, options, programs = getEntryPrograms(inputFiles, logger, options)) {
    const baseDir = options.getValue("basePath") || (0, fs_1.deriveRootDir)(inputFiles);
    const entryPoints = [];
    let expandSuggestion = true;
    entryLoop: for (const fileOrDir of inputFiles.map(paths_1.normalizePath)) {
        const toCheck = [fileOrDir];
        if (!/\.([cm][tj]s|[tj]sx?)$/.test(fileOrDir)) {
            toCheck.push(`${fileOrDir}/index.ts`, `${fileOrDir}/index.cts`, `${fileOrDir}/index.mts`, `${fileOrDir}/index.tsx`, `${fileOrDir}/index.js`, `${fileOrDir}/index.cjs`, `${fileOrDir}/index.mjs`, `${fileOrDir}/index.jsx`);
        }
        for (const program of programs) {
            for (const check of toCheck) {
                const sourceFile = program.getSourceFile(check);
                if (sourceFile) {
                    entryPoints.push({
                        displayName: getModuleName((0, path_1.resolve)(check), baseDir),
                        sourceFile,
                        program,
                    });
                    continue entryLoop;
                }
            }
        }
        logger.warn(logger.i18n.entry_point_0_not_in_program((0, paths_1.nicePath)(fileOrDir)));
        if (expandSuggestion && (0, fs_1.isDir)(fileOrDir)) {
            expandSuggestion = false;
            logger.info(logger.i18n.use_expand_or_glob_for_files_in_dir());
        }
    }
    return entryPoints;
}
function getExpandedEntryPointsForPaths(logger, inputFiles, options, programs = getEntryPrograms(inputFiles, logger, options)) {
    const compilerOptions = options.getCompilerOptions();
    const supportedFileRegex = compilerOptions.allowJs || compilerOptions.checkJs
        ? /\.([cm][tj]s|[tj]sx?)$/
        : /\.([cm]ts|tsx?)$/;
    return getEntryPointsForPaths(logger, expandInputFiles(logger, inputFiles, options, supportedFileRegex), options, programs);
}
function expandGlobs(inputFiles, exclude, logger) {
    const excludePatterns = (0, paths_1.createMinimatch)(exclude);
    const base = (0, fs_1.deriveRootDir)(inputFiles);
    const result = inputFiles.flatMap((entry) => {
        const result = (0, fs_1.glob)(entry, base, {
            includeDirectories: true,
            followSymlinks: true,
        });
        const filtered = result.filter((file) => file === entry || !(0, paths_1.matchesAny)(excludePatterns, file));
        if (result.length === 0) {
            logger.warn(logger.i18n.glob_0_did_not_match_any_files((0, paths_1.nicePath)(entry)));
        }
        else if (filtered.length === 0) {
            logger.warn(logger.i18n.entry_point_0_did_not_match_any_files_after_exclude((0, paths_1.nicePath)(entry)));
        }
        else {
            logger.verbose(`Expanded ${(0, paths_1.nicePath)(entry)} to:\n\t${filtered
                .map(paths_1.nicePath)
                .join("\n\t")}`);
        }
        return filtered;
    });
    return result;
}
function getEntryPrograms(inputFiles, logger, options) {
    const noTsConfigFound = options.getFileNames().length === 0 &&
        options.getProjectReferences().length === 0;
    const rootProgram = noTsConfigFound
        ? typescript_1.default.createProgram({
            rootNames: inputFiles,
            options: options.getCompilerOptions(),
        })
        : typescript_1.default.createProgram({
            rootNames: options.getFileNames(),
            options: options.getCompilerOptions(),
            projectReferences: options.getProjectReferences(),
        });
    const programs = [rootProgram];
    // This might be a solution style tsconfig, in which case we need to add a program for each
    // reference so that the converter can look through each of these.
    if (rootProgram.getRootFileNames().length === 0) {
        logger.verbose("tsconfig appears to be a solution style tsconfig - creating programs for references");
        const resolvedReferences = rootProgram.getResolvedProjectReferences();
        for (const ref of resolvedReferences ?? []) {
            if (!ref)
                continue; // This indicates bad configuration... will be reported later.
            programs.push(typescript_1.default.createProgram({
                options: options.fixCompilerOptions(ref.commandLine.options),
                rootNames: ref.commandLine.fileNames,
                projectReferences: ref.commandLine.projectReferences,
            }));
        }
    }
    return programs;
}
/**
 * Expand a list of input files.
 *
 * Searches for directories in the input files list and replaces them with a
 * listing of all TypeScript files within them. One may use the ```--exclude``` option
 * to filter out files with a pattern.
 *
 * @param inputFiles  The list of files that should be expanded.
 * @returns  The list of input files with expanded directories.
 */
function expandInputFiles(logger, entryPoints, options, supportedFile) {
    const files = [];
    const exclude = (0, paths_1.createMinimatch)(options.getValue("exclude"));
    function add(file, entryPoint) {
        let stats;
        try {
            stats = FS.statSync(file);
        }
        catch {
            // No permission or a symbolic link, do not resolve.
            return;
        }
        const fileIsDir = stats.isDirectory();
        if (fileIsDir && !file.endsWith("/")) {
            file = `${file}/`;
        }
        if (fileIsDir) {
            FS.readdirSync(file).forEach((next) => {
                add((0, path_1.join)(file, next), false);
            });
        }
        else if (supportedFile.test(file)) {
            if (!entryPoint && (0, paths_1.matchesAny)(exclude, file)) {
                return;
            }
            files.push((0, paths_1.normalizePath)(file));
        }
    }
    entryPoints.forEach((file) => {
        const resolved = (0, path_1.resolve)(file);
        if (!FS.existsSync(resolved)) {
            logger.warn(logger.i18n.entry_point_0_did_not_exist(file));
            return;
        }
        add(resolved, true);
    });
    return files;
}
