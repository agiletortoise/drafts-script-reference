import { countMatches, filterMap } from "#utils";
import { Minimatch } from "minimatch";
import { dirname, isAbsolute, relative, resolve } from "path";
export class MinimatchSet {
    patterns;
    constructor(patterns) {
        this.patterns = patterns.map(p => new Minimatch(p, { dot: true }));
    }
    matchesAny(path) {
        return this.patterns.some(p => {
            return p.match(path);
        });
    }
}
function escapeGlob(glob) {
    return glob.replace(/[?*()[\]\\{}]/g, "\\$&");
}
function isGlobalGlob(glob) {
    const start = glob.match(/^[!#]+/)?.[0].length ?? 0;
    return glob.startsWith("**", start);
}
export function splitGlobToPathAndSpecial(glob) {
    const modifiers = glob.match(/^[!#]+/)?.[0] ?? "";
    const noModifierGlob = glob.substring(modifiers.length);
    if (isGlobalGlob(glob)) {
        return { modifiers, path: "", glob: noModifierGlob };
    }
    const mini = new Minimatch(noModifierGlob, { dot: true });
    const basePaths = mini.set.map(set => {
        const stop = set.findIndex((part) => typeof part !== "string");
        if (stop === -1) {
            return set.join("/");
        }
        else {
            return set.slice(0, stop).join("/");
        }
    });
    const base = getCommonPath(basePaths);
    if (base) {
        const skipIndex = countMatches(base, "/") + 1;
        const globPart = mini.globParts.map(s => s.slice(skipIndex));
        // This isn't ideal, it will end up re-writing the glob if braces are used,
        // but I don't want to write a glob minimizer at this point, and this should
        // handle all the edge cases as we're just using Minimatch's glob parsing
        const resultingGlob = globPart.length === 1
            ? globPart[0].join("/")
            : `{${globPart.map(s => s.join("/")).join(",")}}`;
        return { modifiers, path: base, glob: resultingGlob };
    }
    return { modifiers, path: "", glob: noModifierGlob };
}
export function createGlobString(relativeTo, glob) {
    if (isAbsolute(glob) || isGlobalGlob(glob))
        return glob;
    const split = splitGlobToPathAndSpecial(glob);
    const leadingPath = normalizePath(resolve(relativeTo, split.path));
    if (!split.glob) {
        return split.modifiers + escapeGlob(leadingPath);
    }
    return `${split.modifiers}${escapeGlob(leadingPath)}/${split.glob}`;
}
/**
 * Get the longest directory path common to all files.
 */
export function getCommonPath(files) {
    if (!files.length) {
        return "";
    }
    const roots = files.map((f) => f.split("/"));
    if (roots.length === 1) {
        return roots[0].join("/");
    }
    let i = 0;
    while (i < roots[0].length &&
        new Set(roots.map((part) => part[i])).size === 1) {
        i++;
    }
    return roots[0].slice(0, i).join("/");
}
export function getCommonDirectory(files) {
    if (files.length === 1) {
        return normalizePath(dirname(files[0]));
    }
    return getCommonPath(files);
}
export function deriveRootDir(globPaths) {
    const globs = new MinimatchSet(globPaths).patterns;
    const rootPaths = globs.flatMap((glob, i) => filterMap(glob.set, (set) => {
        const stop = set.findIndex((part) => typeof part !== "string");
        if (stop === -1) {
            return globPaths[i];
        }
        else {
            const kept = set.slice(0, stop).join("/");
            return globPaths[i].substring(0, globPaths[i].indexOf(kept) + kept.length);
        }
    }));
    return getCommonDirectory(rootPaths);
}
export function nicePath(absPath) {
    if (!isAbsolute(absPath))
        return absPath;
    const relativePath = relative(process.cwd(), absPath);
    if (relativePath.startsWith("..")) {
        return normalizePath(absPath);
    }
    return `./${normalizePath(relativePath)}`;
}
/**
 * Normalize the given path.
 *
 * @param path  The path that should be normalized.
 * @returns The normalized path.
 */
export function normalizePath(path) {
    if (process.platform === "win32") {
        // Ensure forward slashes
        path = path.replace(/\\/g, "/");
        // Msys2 git on windows will give paths which use unix-style
        // absolute paths, like /c/users/you. Since the rest of TypeDoc
        // expects drive letters, convert it to that here.
        path = path.replace(/^\/([a-zA-Z])\//, (_m, m1) => `${m1}:/`);
        // Make Windows drive letters upper case
        path = path.replace(/^([^:]+):\//, (_m, m1) => m1.toUpperCase() + ":/");
    }
    return path;
}
