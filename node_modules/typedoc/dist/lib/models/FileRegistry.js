"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatingFileRegistry = exports.FileRegistry = void 0;
const path_1 = require("path");
const utils_1 = require("../utils");
class FileRegistry {
    constructor() {
        this.nextId = 1;
        // The combination of these two make up the registry
        this.mediaToReflection = new Map();
        this.mediaToPath = new Map();
        this.reflectionToPath = new Map();
        this.pathToMedia = new Map();
        // Lazily created as we get names for rendering
        this.names = new Map();
        this.nameUsage = new Map();
    }
    registerAbsolute(absolute) {
        absolute = (0, utils_1.normalizePath)(absolute);
        const existing = this.pathToMedia.get(absolute);
        if (existing) {
            return existing;
        }
        this.mediaToPath.set(this.nextId, absolute);
        this.pathToMedia.set(absolute, this.nextId);
        return this.nextId++;
    }
    /** Called by {@link ProjectReflection.registerReflection} @internal*/
    registerReflection(absolute, reflection) {
        absolute = (0, utils_1.normalizePath)(absolute);
        const id = this.registerAbsolute(absolute);
        this.reflectionToPath.set(reflection, absolute);
        this.mediaToReflection.set(id, reflection);
    }
    register(sourcePath, relativePath) {
        return this.registerAbsolute((0, path_1.resolve)((0, path_1.dirname)(sourcePath), relativePath));
    }
    removeReflection(reflection) {
        const absolute = this.reflectionToPath.get(reflection);
        if (absolute) {
            const media = this.pathToMedia.get(absolute);
            this.mediaToReflection.delete(media);
        }
    }
    resolve(id) {
        return this.mediaToReflection.get(id) ?? this.mediaToPath.get(id);
    }
    getName(id) {
        const absolute = this.mediaToPath.get(id);
        if (!absolute)
            return;
        if (this.names.has(id)) {
            return this.names.get(id);
        }
        const file = (0, path_1.basename)(absolute);
        if (!this.nameUsage.has(file)) {
            this.nameUsage.set(file, 1);
            this.names.set(id, file);
        }
        else {
            const { name, ext } = (0, path_1.parse)(file);
            let counter = this.nameUsage.get(file);
            while (this.nameUsage.has(`${name}-${counter}${ext}`)) {
                ++counter;
            }
            this.nameUsage.set(file, counter + 1);
            this.nameUsage.set(`${name}-${counter}${ext}`, counter + 1);
            this.names.set(id, `${name}-${counter}${ext}`);
        }
        return this.names.get(id);
    }
    getNameToAbsoluteMap() {
        const result = new Map();
        for (const [id, name] of this.names.entries()) {
            result.set(name, this.mediaToPath.get(id));
        }
        return result;
    }
    toObject(ser) {
        const result = {
            entries: {},
            reflections: {},
        };
        for (const [key, val] of this.mediaToPath.entries()) {
            result.entries[key] = (0, utils_1.normalizePath)((0, path_1.relative)(ser.projectRoot, val));
        }
        for (const [key, val] of this.mediaToReflection.entries()) {
            // A registry may be shared by multiple projects. When serializing,
            // only save reflection mapping for reflections in the serialized project.
            if (ser.project.getReflectionById(val.id)) {
                result.reflections[key] = val.id;
            }
        }
        return result;
    }
    /**
     * Revive a file registry from disc.
     * Note that in the packages context this may be called multiple times on
     * a single object, and should merge in files from the other registries.
     */
    fromObject(de, obj) {
        for (const [key, val] of Object.entries(obj.entries)) {
            const absolute = (0, utils_1.normalizePath)((0, path_1.resolve)(de.projectRoot, val));
            de.oldFileIdToNewFileId[+key] = this.registerAbsolute(absolute);
        }
        de.defer((project) => {
            for (const [media, reflId] of Object.entries(obj.reflections)) {
                const refl = project.getReflectionById(de.oldIdToNewId[reflId]);
                if (refl) {
                    this.mediaToReflection.set(de.oldFileIdToNewFileId[+media], refl);
                }
            }
        });
    }
}
exports.FileRegistry = FileRegistry;
class ValidatingFileRegistry extends FileRegistry {
    register(sourcePath, relativePath) {
        const absolute = (0, path_1.resolve)((0, path_1.dirname)(sourcePath), relativePath);
        if (!(0, utils_1.isFile)(absolute)) {
            return;
        }
        return this.registerAbsolute(absolute);
    }
    fromObject(de, obj) {
        for (const [key, val] of Object.entries(obj.entries)) {
            const absolute = (0, utils_1.normalizePath)((0, path_1.resolve)(de.projectRoot, val));
            if (!(0, utils_1.isFile)(absolute)) {
                de.logger.warn(de.logger.i18n.saved_relative_path_0_resolved_from_1_is_not_a_file(val, de.projectRoot));
                continue;
            }
            de.oldFileIdToNewFileId[+key] = this.registerAbsolute(absolute);
        }
        de.defer((project) => {
            for (const [media, reflId] of Object.entries(obj.reflections)) {
                const refl = project.getReflectionById(de.oldIdToNewId[reflId]);
                if (refl) {
                    this.mediaToReflection.set(de.oldFileIdToNewFileId[+media], refl);
                }
                else {
                    de.logger.warn(de.logger.i18n.serialized_project_referenced_0_not_part_of_project(reflId.toString()));
                }
            }
        });
    }
}
exports.ValidatingFileRegistry = ValidatingFileRegistry;
