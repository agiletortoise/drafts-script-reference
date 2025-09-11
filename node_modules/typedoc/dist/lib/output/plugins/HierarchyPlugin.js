import * as Path from "path";
import { RendererComponent } from "../components.js";
import { RendererEvent } from "../events.js";
import { writeFile } from "../../utils/index.js";
import { DefaultTheme } from "../themes/default/DefaultTheme.js";
import { getHierarchyRoots, getKindClass, getUniquePath } from "../themes/lib.js";
import { compressJson } from "../../utils/compress.js";
export class HierarchyPlugin extends RendererComponent {
    constructor(renderer) {
        super(renderer);
        this.owner.on(RendererEvent.BEGIN, this.onRendererBegin.bind(this));
    }
    onRendererBegin(_event) {
        if (!(this.owner.theme instanceof DefaultTheme)) {
            return;
        }
        this.owner.preRenderAsyncJobs.push((event) => this.buildHierarchy(event));
    }
    async buildHierarchy(event) {
        const project = event.project;
        const hierarchy = {
            roots: getHierarchyRoots(project).map((refl) => refl.id),
            reflections: {},
        };
        const queue = [...hierarchy.roots];
        while (queue.length) {
            const id = queue.pop();
            const refl = project.getReflectionById(id);
            if (id in hierarchy.reflections)
                continue;
            const url = this.owner.router.getFullUrl(refl);
            if (!url)
                continue;
            const jsonRecord = {
                name: refl.name,
                kind: refl.kind,
                url,
                class: getKindClass(refl),
            };
            const path = getUniquePath(refl);
            if (path.length > 1) {
                jsonRecord.uniqueNameParents = path
                    .slice(0, -1)
                    .map((r) => r.id);
                queue.push(...jsonRecord.uniqueNameParents);
            }
            const children = [
                ...(refl.implementedBy || []),
                ...(refl.extendedBy || []),
            ];
            for (const child of children) {
                if (child.reflection) {
                    jsonRecord.children ||= [];
                    jsonRecord.children.push(child.reflection.id);
                }
            }
            if (jsonRecord.children) {
                queue.push(...jsonRecord.children);
            }
            hierarchy.reflections[id] = jsonRecord;
        }
        const hierarchyJs = Path.join(event.outputDirectory, "assets", "hierarchy.js");
        await writeFile(hierarchyJs, `window.hierarchyData = "${await compressJson(hierarchy)}"`);
    }
}
