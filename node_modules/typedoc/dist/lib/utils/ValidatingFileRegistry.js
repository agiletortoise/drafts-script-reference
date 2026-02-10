import { FileRegistry } from "../models/FileRegistry.js";
import { i18n, NormalizedPathUtils } from "#utils";
import { existsSync } from "fs";
export class ValidatingFileRegistry extends FileRegistry {
    basePath;
    constructor(basePath = "") {
        super();
        this.basePath = basePath;
    }
    register(sourcePath, relativePath) {
        let absolute = NormalizedPathUtils.resolve(NormalizedPathUtils.dirname(sourcePath), relativePath);
        let absoluteWithoutAnchor = absolute.replace(/#.*/, "");
        // Note: We allow paths to directories to be registered here, but the AssetsPlugin will not
        // copy them to the output path. This is so that we can link to directories and associate them
        // with reflections in packages mode.
        if (!existsSync(absoluteWithoutAnchor)) {
            // If the relative path didn't exist normally, also check the path relative to the assetBasePath option
            if (this.basePath != "") {
                absolute = NormalizedPathUtils.resolve(this.basePath, relativePath);
                absoluteWithoutAnchor = absolute.replace(/#.*/, "");
                if (!existsSync(absoluteWithoutAnchor)) {
                    return;
                }
            }
            else {
                return;
            }
        }
        return this.registerAbsolute(absolute);
    }
    fromObject(de, obj) {
        for (const [key, val] of Object.entries(obj.entries)) {
            const absolute = NormalizedPathUtils.resolve(de.projectRoot, val);
            if (!existsSync(absolute)) {
                de.logger.warn(i18n.saved_relative_path_0_resolved_from_1_does_not_exist(val, de.projectRoot));
                continue;
            }
            de.oldFileIdToNewFileId[+key] = this.registerAbsolute(absolute).target;
        }
        de.defer((project) => {
            for (const [media, reflId] of Object.entries(obj.reflections)) {
                const refl = project.getReflectionById(de.oldIdToNewId[reflId]);
                if (refl) {
                    this.mediaToReflection.set(de.oldFileIdToNewFileId[+media], refl.id);
                }
                else {
                    de.logger.warn(i18n.serialized_project_referenced_0_not_part_of_project(reflId.toString()));
                }
            }
        });
    }
}
