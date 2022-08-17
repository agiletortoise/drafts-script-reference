"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureReflection = void 0;
const types_1 = require("../types");
const abstract_1 = require("./abstract");
class SignatureReflection extends abstract_1.Reflection {
    constructor(name, kind, parent) {
        super(name, kind, parent);
    }
    /**
     * Traverse all potential child reflections of this reflection.
     *
     * The given callback will be invoked for all children, signatures and type parameters
     * attached to this reflection.
     *
     * @param callback  The callback function that should be applied for each child reflection.
     */
    traverse(callback) {
        if (this.type instanceof types_1.ReflectionType) {
            if (callback(this.type.declaration, abstract_1.TraverseProperty.TypeLiteral) === false) {
                return;
            }
        }
        for (const parameter of this.typeParameters?.slice() || []) {
            if (callback(parameter, abstract_1.TraverseProperty.TypeParameter) === false) {
                return;
            }
        }
        for (const parameter of this.parameters?.slice() || []) {
            if (callback(parameter, abstract_1.TraverseProperty.Parameters) === false) {
                return;
            }
        }
        super.traverse(callback);
    }
    /**
     * Return a string representation of this reflection.
     */
    toString() {
        let result = super.toString();
        if (this.typeParameters) {
            const parameters = this.typeParameters.map((parameter) => parameter.name);
            result += "<" + parameters.join(", ") + ">";
        }
        if (this.type) {
            result += ":" + this.type.toString();
        }
        return result;
    }
    toObject(serializer) {
        return {
            ...super.toObject(serializer),
            typeParameter: serializer.toObjectsOptional(this.typeParameters),
            parameters: serializer.toObjectsOptional(this.parameters),
            type: serializer.toObject(this.type),
            overwrites: serializer.toObject(this.overwrites),
            inheritedFrom: serializer.toObject(this.inheritedFrom),
            implementationOf: serializer.toObject(this.implementationOf),
        };
    }
}
exports.SignatureReflection = SignatureReflection;
