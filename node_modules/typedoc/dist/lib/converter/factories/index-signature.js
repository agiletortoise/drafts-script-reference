"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertIndexSignatures = convertIndexSignatures;
const assert_1 = __importDefault(require("assert"));
const typescript_1 = __importDefault(require("typescript"));
const models_1 = require("../../models");
const converter_events_1 = require("../converter-events");
function convertIndexSignatures(context, symbol) {
    (0, assert_1.default)(context.scope instanceof models_1.DeclarationReflection);
    const indexSymbol = symbol.members?.get("__index");
    if (!indexSymbol)
        return;
    for (const indexDeclaration of indexSymbol.getDeclarations() || []) {
        (0, assert_1.default)(typescript_1.default.isIndexSignatureDeclaration(indexDeclaration));
        const param = indexDeclaration.parameters[0];
        (0, assert_1.default)(param && typescript_1.default.isParameter(param));
        const index = new models_1.SignatureReflection("__index", models_1.ReflectionKind.IndexSignature, context.scope);
        index.comment = context.getNodeComment(indexDeclaration, false);
        index.parameters = [
            new models_1.ParameterReflection(param.name.getText(), models_1.ReflectionKind.Parameter, index),
        ];
        index.parameters[0].type = context.converter.convertType(context.withScope(index.parameters[0]), param.type);
        index.type = context.converter.convertType(context.withScope(index), indexDeclaration.type);
        context.registerReflection(index, indexSymbol);
        context.scope.indexSignatures ||= [];
        context.scope.indexSignatures.push(index);
        context.converter.trigger(converter_events_1.ConverterEvents.CREATE_SIGNATURE, context, index, indexDeclaration);
    }
}
