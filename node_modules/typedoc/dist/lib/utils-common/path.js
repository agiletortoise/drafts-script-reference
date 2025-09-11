import { assert } from "./general.js";
export var NormalizedPathUtils;
(function (NormalizedPathUtils) {
    function dirname(path) {
        let end = path.length - 2;
        for (; end > 0; --end) {
            if (path[end] === "/")
                break;
        }
        switch (end) {
            case -2:
            case -1:
                return (path[0] === "/" ? "/" : ".");
            case 0:
                return path.substring(0, path.indexOf("/") + 1);
            default:
                return path.slice(0, end);
        }
    }
    NormalizedPathUtils.dirname = dirname;
    function basename(path) {
        // We start at length - 2 as /var/typedoc/ should give `typedoc`
        let end = path.length - 2;
        for (; end >= 0; --end) {
            if (path[end] === "/")
                break;
        }
        switch (end) {
            case -2:
            case -1:
                return path;
            default:
                if (path.endsWith("/")) {
                    return path.slice(end + 1, -1);
                }
                return path.slice(end + 1);
        }
    }
    NormalizedPathUtils.basename = basename;
    function relative(from, to) {
        if (from == to) {
            return "";
        }
        assert(isAbsolute(from) && isAbsolute(to), "resolving relative paths without absolute inputs requires a filesystem");
        if (!from.endsWith("/")) {
            from += "/";
        }
        const end = to.length;
        if (!to.endsWith("/")) {
            to += "/";
        }
        const minLen = Math.min(from.length, to.length);
        let lastCommonSlash = 0;
        let i = 0;
        for (; i < minLen; ++i) {
            if (from[i] === to[i]) {
                if (from[i] === "/") {
                    lastCommonSlash = i;
                }
            }
            else {
                break;
            }
        }
        if (lastCommonSlash === from.length - 1) {
            return to.substring(from.length, end);
        }
        let prefix = "";
        for (let i = lastCommonSlash + 1; i < from.length; ++i) {
            if (from[i] === "/" || i + 1 === from.length) {
                prefix += prefix ? "/.." : "..";
            }
        }
        return prefix + to.substring(lastCommonSlash, end);
    }
    NormalizedPathUtils.relative = relative;
    function normalize(path) {
        const parts = path.split("/");
        let canRemoveDotDot = false;
        for (let i = 0; i < parts.length; /* inside loop */) {
            if (parts[i] == "." && i + 1 != parts.length) {
                parts.splice(i, 1);
            }
            else if (parts[i] == "..") {
                if (canRemoveDotDot) {
                    if (i - 1 === 0 && /\w:/i.test(parts[0])) {
                        parts.splice(i, 1);
                    }
                    else {
                        parts.splice(i - 1, 2);
                        i = i - 1;
                    }
                }
                else {
                    ++i;
                }
            }
            else {
                canRemoveDotDot = true;
                ++i;
            }
        }
        return parts.join("/");
    }
    NormalizedPathUtils.normalize = normalize;
    function resolve(from, to) {
        assert(isAbsolute(from), "resolving without an absolute path requires a filesystem");
        if (isAbsolute(to)) {
            return to;
        }
        return normalize(`${from}/${to}`);
    }
    NormalizedPathUtils.resolve = resolve;
    function isAbsolute(from) {
        return /^\/|^\w:\//.test(from);
    }
    NormalizedPathUtils.isAbsolute = isAbsolute;
    function splitFilename(name) {
        const lastDot = name.lastIndexOf(".");
        if (lastDot < 1) {
            return { name, ext: "" };
        }
        return { name: name.substring(0, lastDot), ext: name.substring(lastDot) };
    }
    NormalizedPathUtils.splitFilename = splitFilename;
})(NormalizedPathUtils || (NormalizedPathUtils = {}));
