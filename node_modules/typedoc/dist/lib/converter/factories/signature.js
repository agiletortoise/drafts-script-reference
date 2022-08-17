"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTypeParamReflection = exports.convertTypeParameterNodes = exports.convertParameterNodes = exports.createSignature = void 0;
const ts = require("typescript");
const assert = require("assert");
const models_1 = require("../../models");
const converter_events_1 = require("../converter-events");
const convert_expression_1 = require("../convert-expression");
const reflections_1 = require("../utils/reflections");
const comments_1 = require("../comments");
function createSignature(context, kind, signature, declaration) {
    var _a;
    assert(context.scope instanceof models_1.DeclarationReflection);
    declaration || (declaration = signature.getDeclaration());
    const sigRef = new models_1.SignatureReflection(kind == models_1.ReflectionKind.ConstructorSignature
        ? `new ${context.scope.parent.name}`
        : context.scope.name, kind, context.scope);
    if (declaration) {
        sigRef.comment = (0, comments_1.getSignatureComment)(declaration, context.converter.config, context.logger, context.converter.commentStyle);
    }
    sigRef.typeParameters = convertTypeParameters(context, sigRef, signature.typeParameters);
    const parameterSymbols = signature.thisParameter
        ? [signature.thisParameter, ...signature.parameters]
        : signature.parameters;
    sigRef.parameters = convertParameters(context, sigRef, parameterSymbols, declaration?.parameters);
    const predicate = context.checker.getTypePredicateOfSignature(signature);
    if (predicate) {
        sigRef.type = convertPredicate(predicate, context.withScope(sigRef));
    }
    else if (kind == models_1.ReflectionKind.SetSignature) {
        sigRef.type = new models_1.IntrinsicType("void");
    }
    else {
        sigRef.type = context.converter.convertType(context.withScope(sigRef), (declaration?.kind === ts.SyntaxKind.FunctionDeclaration &&
            declaration.type) ||
            signature.getReturnType());
    }
    context.registerReflection(sigRef, undefined);
    switch (kind) {
        case models_1.ReflectionKind.GetSignature:
            context.scope.getSignature = sigRef;
            break;
        case models_1.ReflectionKind.SetSignature:
            context.scope.setSignature = sigRef;
            break;
        case models_1.ReflectionKind.CallSignature:
        case models_1.ReflectionKind.ConstructorSignature:
            (_a = context.scope).signatures ?? (_a.signatures = []);
            context.scope.signatures.push(sigRef);
            break;
    }
    context.trigger(converter_events_1.ConverterEvents.CREATE_SIGNATURE, sigRef, declaration);
}
exports.createSignature = createSignature;
function convertParameters(context, sigRef, parameters, parameterNodes) {
    return parameters.map((param, i) => {
        const declaration = param.valueDeclaration;
        assert(!declaration ||
            ts.isParameter(declaration) ||
            ts.isJSDocParameterTag(declaration));
        const paramRefl = new models_1.ParameterReflection(/__\d+/.test(param.name) ? "__namedParameters" : param.name, models_1.ReflectionKind.Parameter, sigRef);
        if (declaration && ts.isJSDocParameterTag(declaration)) {
            paramRefl.comment = (0, comments_1.getJsDocComment)(declaration, context.converter.config, context.logger);
        }
        paramRefl.comment || (paramRefl.comment = (0, comments_1.getComment)(param, paramRefl.kind, context.converter.config, context.logger, context.converter.commentStyle));
        context.registerReflection(paramRefl, param);
        context.trigger(converter_events_1.ConverterEvents.CREATE_PARAMETER, paramRefl);
        let type;
        if (declaration) {
            type = context.checker.getTypeOfSymbolAtLocation(param, declaration);
        }
        else {
            type = param.type;
        }
        paramRefl.type = context.converter.convertType(context.withScope(paramRefl), type);
        let isOptional = false;
        if (declaration) {
            isOptional = ts.isParameter(declaration)
                ? !!declaration.questionToken ||
                    ts
                        .getJSDocParameterTags(declaration)
                        .some((tag) => tag.isBracketed)
                : declaration.isBracketed;
        }
        if (isOptional) {
            paramRefl.type = (0, reflections_1.removeUndefined)(paramRefl.type);
        }
        paramRefl.defaultValue = (0, convert_expression_1.convertDefaultValue)(parameterNodes?.[i]);
        paramRefl.setFlag(models_1.ReflectionFlag.Optional, isOptional);
        // If we have no declaration, then this is an implicitly defined parameter in JS land
        // because the method body uses `arguments`... which is always a rest argument
        let isRest = true;
        if (declaration) {
            isRest = ts.isParameter(declaration)
                ? !!declaration.dotDotDotToken
                : !!declaration.typeExpression &&
                    ts.isJSDocVariadicType(declaration.typeExpression.type);
        }
        paramRefl.setFlag(models_1.ReflectionFlag.Rest, isRest);
        return paramRefl;
    });
}
function convertParameterNodes(context, sigRef, parameters) {
    return parameters.map((param) => {
        const paramRefl = new models_1.ParameterReflection(/__\d+/.test(param.name.getText())
            ? "__namedParameters"
            : param.name.getText(), models_1.ReflectionKind.Parameter, sigRef);
        if (ts.isJSDocParameterTag(param)) {
            paramRefl.comment = (0, comments_1.getJsDocComment)(param, context.converter.config, context.logger);
        }
        context.registerReflection(paramRefl, context.getSymbolAtLocation(param));
        context.trigger(converter_events_1.ConverterEvents.CREATE_PARAMETER, paramRefl);
        paramRefl.type = context.converter.convertType(context.withScope(paramRefl), ts.isParameter(param) ? param.type : param.typeExpression?.type);
        const isOptional = ts.isParameter(param)
            ? !!param.questionToken
            : param.isBracketed;
        if (isOptional) {
            paramRefl.type = (0, reflections_1.removeUndefined)(paramRefl.type);
        }
        paramRefl.defaultValue = (0, convert_expression_1.convertDefaultValue)(param);
        paramRefl.setFlag(models_1.ReflectionFlag.Optional, isOptional);
        paramRefl.setFlag(models_1.ReflectionFlag.Rest, ts.isParameter(param)
            ? !!param.dotDotDotToken
            : !!param.typeExpression &&
                ts.isJSDocVariadicType(param.typeExpression.type));
        return paramRefl;
    });
}
exports.convertParameterNodes = convertParameterNodes;
function convertTypeParameters(context, parent, parameters) {
    return parameters?.map((param) => {
        const constraintT = param.getConstraint();
        const defaultT = param.getDefault();
        const constraint = constraintT
            ? context.converter.convertType(context, constraintT)
            : void 0;
        const defaultType = defaultT
            ? context.converter.convertType(context, defaultT)
            : void 0;
        // There's no way to determine directly from a ts.TypeParameter what it's variance modifiers are
        // so unfortunately we have to go back to the node for this...
        const variance = getVariance(param.getSymbol()?.declarations?.find(ts.isTypeParameterDeclaration)
            ?.modifiers);
        const paramRefl = new models_1.TypeParameterReflection(param.symbol.name, constraint, defaultType, parent, variance);
        context.registerReflection(paramRefl, param.getSymbol());
        context.trigger(converter_events_1.ConverterEvents.CREATE_TYPE_PARAMETER, paramRefl);
        return paramRefl;
    });
}
function convertTypeParameterNodes(context, parameters) {
    return parameters?.map((param) => createTypeParamReflection(param, context));
}
exports.convertTypeParameterNodes = convertTypeParameterNodes;
function createTypeParamReflection(param, context) {
    const constraint = param.constraint
        ? context.converter.convertType(context, param.constraint)
        : void 0;
    const defaultType = param.default
        ? context.converter.convertType(context, param.default)
        : void 0;
    const paramRefl = new models_1.TypeParameterReflection(param.name.text, constraint, defaultType, context.scope, getVariance(param.modifiers));
    context.registerReflection(paramRefl, param.symbol);
    if (ts.isJSDocTemplateTag(param.parent)) {
        paramRefl.comment = (0, comments_1.getJsDocComment)(param.parent, context.converter.config, context.logger);
    }
    context.trigger(converter_events_1.ConverterEvents.CREATE_TYPE_PARAMETER, paramRefl, param);
    return paramRefl;
}
exports.createTypeParamReflection = createTypeParamReflection;
function getVariance(modifiers) {
    const hasIn = modifiers?.some((mod) => mod.kind === ts.SyntaxKind.InKeyword);
    const hasOut = modifiers?.some((mod) => mod.kind === ts.SyntaxKind.OutKeyword);
    if (hasIn && hasOut) {
        return models_1.VarianceModifier.inOut;
    }
    if (hasIn) {
        return models_1.VarianceModifier.in;
    }
    if (hasOut) {
        return models_1.VarianceModifier.out;
    }
}
function convertPredicate(predicate, context) {
    let name;
    switch (predicate.kind) {
        case ts.TypePredicateKind.This:
        case ts.TypePredicateKind.AssertsThis:
            name = "this";
            break;
        case ts.TypePredicateKind.Identifier:
        case ts.TypePredicateKind.AssertsIdentifier:
            name = predicate.parameterName;
            break;
    }
    let asserts;
    switch (predicate.kind) {
        case ts.TypePredicateKind.This:
        case ts.TypePredicateKind.Identifier:
            asserts = false;
            break;
        case ts.TypePredicateKind.AssertsThis:
        case ts.TypePredicateKind.AssertsIdentifier:
            asserts = true;
            break;
    }
    return new models_1.PredicateType(name, asserts, predicate.type
        ? context.converter.convertType(context, predicate.type)
        : void 0);
}
