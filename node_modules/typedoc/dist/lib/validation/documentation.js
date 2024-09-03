"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDocumentation = validateDocumentation;
const models_1 = require("../models");
const enum_1 = require("../utils/enum");
const paths_1 = require("../utils/paths");
function validateDocumentation(project, logger, requiredToBeDocumented) {
    let kinds = requiredToBeDocumented.reduce((prev, cur) => prev | models_1.ReflectionKind[cur], 0);
    // Functions, Constructors, and Accessors never have comments directly on them.
    // If they are required to be documented, what's really required is that their
    // contained signatures have a comment.
    if (kinds & models_1.ReflectionKind.FunctionOrMethod) {
        kinds |= models_1.ReflectionKind.CallSignature;
        kinds = (0, enum_1.removeFlag)(kinds, models_1.ReflectionKind.FunctionOrMethod);
    }
    if (kinds & models_1.ReflectionKind.Constructor) {
        kinds |= models_1.ReflectionKind.ConstructorSignature;
        kinds = (0, enum_1.removeFlag)(kinds, models_1.ReflectionKind.Constructor);
    }
    if (kinds & models_1.ReflectionKind.Accessor) {
        kinds |= models_1.ReflectionKind.GetSignature | models_1.ReflectionKind.SetSignature;
        kinds = (0, enum_1.removeFlag)(kinds, models_1.ReflectionKind.Accessor);
    }
    const toProcess = project.getReflectionsByKind(kinds);
    const seen = new Set();
    outer: while (toProcess.length) {
        const ref = toProcess.shift();
        if (seen.has(ref))
            continue;
        seen.add(ref);
        // If inside a parameter, we shouldn't care. Callback parameter's values don't get deeply documented.
        let r = ref.parent;
        while (r) {
            if (r.kindOf(models_1.ReflectionKind.Parameter)) {
                continue outer;
            }
            r = r.parent;
        }
        // Type aliases own their comments, even if they're function-likes.
        // So if we're a type literal owned by a type alias, don't do anything.
        if (ref.kindOf(models_1.ReflectionKind.TypeLiteral) &&
            ref.parent?.kindOf(models_1.ReflectionKind.TypeAlias)) {
            toProcess.push(ref.parent);
            continue;
        }
        // Call signatures are considered documented if they have a comment directly, or their
        // container has a comment and they are directly within a type literal belonging to that container.
        if (ref.kindOf(models_1.ReflectionKind.CallSignature) &&
            ref.parent?.kindOf(models_1.ReflectionKind.TypeLiteral)) {
            toProcess.push(ref.parent.parent);
            continue;
        }
        // Construct signatures are considered documented if they are directly within a documented type alias.
        if (ref.kindOf(models_1.ReflectionKind.ConstructorSignature) &&
            ref.parent?.parent?.kindOf(models_1.ReflectionKind.TypeAlias)) {
            toProcess.push(ref.parent.parent);
            continue;
        }
        if (ref instanceof models_1.DeclarationReflection) {
            const signatures = ref.type instanceof models_1.ReflectionType
                ? ref.type.declaration.getNonIndexSignatures()
                : ref.getNonIndexSignatures();
            if (signatures.length) {
                // We've been asked to validate this reflection, so we should validate that
                // signatures all have comments
                toProcess.push(...signatures);
                if (ref.kindOf(models_1.ReflectionKind.SignatureContainer)) {
                    // Comments belong to each signature, and will not be included on this object.
                    continue;
                }
            }
        }
        const symbolId = project.getSymbolIdFromReflection(ref);
        // #2644, signatures may be documented by their parent reflection.
        const hasComment = ref.hasComment() ||
            (ref.kindOf(models_1.ReflectionKind.SomeSignature) &&
                ref.parent?.hasComment());
        if (!hasComment && symbolId) {
            if (symbolId.fileName.includes("node_modules")) {
                continue;
            }
            logger.warn(logger.i18n.reflection_0_kind_1_defined_in_2_does_not_have_any_documentation(ref.getFriendlyFullName(), models_1.ReflectionKind[ref.kind], (0, paths_1.nicePath)(symbolId.fileName)));
        }
    }
}
