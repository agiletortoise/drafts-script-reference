"use strict";
// Utilities to support the inspection of node package "manifests"
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPackageManifest = loadPackageManifest;
exports.expandPackages = expandPackages;
const path_1 = require("path");
const fs_1 = require("./fs");
const paths_1 = require("./paths");
/**
 * Helper for the TS type system to understand hasOwnProperty
 * and narrow a type appropriately.
 * @param obj the receiver of the hasOwnProperty method call
 * @param prop the property to test for
 */
function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
/**
 * Loads a package.json and validates that it is a JSON Object
 */
function loadPackageManifest(logger, packageJsonPath) {
    const packageJson = JSON.parse((0, fs_1.readFile)(packageJsonPath));
    if (typeof packageJson !== "object" || !packageJson) {
        logger.error(logger.i18n.file_0_not_an_object((0, paths_1.nicePath)(packageJsonPath)));
        return undefined;
    }
    return packageJson;
}
/**
 * Load the paths to packages specified in a Yarn workspace package JSON
 * Returns undefined if packageJSON does not define a Yarn workspace
 * @param packageJSON the package json object
 */
function getPackagePaths(packageJSON) {
    if (Array.isArray(packageJSON["workspaces"]) &&
        packageJSON["workspaces"].every((i) => typeof i === "string")) {
        return packageJSON["workspaces"];
    }
    if (typeof packageJSON["workspaces"] === "object" &&
        packageJSON["workspaces"] != null) {
        const workspaces = packageJSON["workspaces"];
        if (hasOwnProperty(workspaces, "packages") &&
            Array.isArray(workspaces["packages"]) &&
            workspaces["packages"].every((i) => typeof i === "string")) {
            return workspaces["packages"];
        }
    }
    return undefined;
}
/**
 * Given a list of (potentially wildcard containing) package paths,
 * return all the actual package folders found.
 */
function expandPackages(logger, packageJsonDir, workspaces, exclude) {
    // Technically npm and Yarn workspaces don't support recursive nesting,
    // however we support the passing of paths to either packages or
    // to the root of a workspace tree in our params and so we could here
    // be dealing with either a root or a leaf. So let's do this recursively,
    // as it actually is simpler from an implementation perspective anyway.
    return workspaces.flatMap((workspace) => {
        const expandedPackageJsonPaths = (0, fs_1.glob)((0, path_1.resolve)(packageJsonDir, workspace, "package.json"), (0, path_1.resolve)(packageJsonDir));
        if (expandedPackageJsonPaths.length === 0) {
            logger.warn(logger.i18n.entry_point_0_did_not_match_any_packages((0, paths_1.nicePath)(workspace)));
        }
        else {
            logger.verbose(`Expanded ${(0, paths_1.nicePath)(workspace)} to:\n\t${expandedPackageJsonPaths
                .map(paths_1.nicePath)
                .join("\n\t")}`);
        }
        return expandedPackageJsonPaths.flatMap((packageJsonPath) => {
            if ((0, paths_1.matchesAny)(exclude, (0, path_1.dirname)(packageJsonPath))) {
                return [];
            }
            const packageJson = loadPackageManifest(logger, packageJsonPath);
            if (packageJson === undefined) {
                return [];
            }
            const packagePaths = getPackagePaths(packageJson);
            if (packagePaths === undefined) {
                // Assume this is a single package repo
                return [(0, path_1.dirname)(packageJsonPath)];
            }
            // This is a workspace root package, recurse
            return expandPackages(logger, (0, path_1.dirname)(packageJsonPath), packagePaths, exclude);
        });
    });
}
