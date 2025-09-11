import { i18n } from "#utils";
/**
 * Defines the available reflection kinds.
 * @category Reflections
 */
export var ReflectionKind;
(function (ReflectionKind) {
    ReflectionKind[ReflectionKind["Project"] = 1] = "Project";
    ReflectionKind[ReflectionKind["Module"] = 2] = "Module";
    ReflectionKind[ReflectionKind["Namespace"] = 4] = "Namespace";
    ReflectionKind[ReflectionKind["Enum"] = 8] = "Enum";
    ReflectionKind[ReflectionKind["EnumMember"] = 16] = "EnumMember";
    ReflectionKind[ReflectionKind["Variable"] = 32] = "Variable";
    ReflectionKind[ReflectionKind["Function"] = 64] = "Function";
    ReflectionKind[ReflectionKind["Class"] = 128] = "Class";
    ReflectionKind[ReflectionKind["Interface"] = 256] = "Interface";
    ReflectionKind[ReflectionKind["Constructor"] = 512] = "Constructor";
    ReflectionKind[ReflectionKind["Property"] = 1024] = "Property";
    ReflectionKind[ReflectionKind["Method"] = 2048] = "Method";
    ReflectionKind[ReflectionKind["CallSignature"] = 4096] = "CallSignature";
    ReflectionKind[ReflectionKind["IndexSignature"] = 8192] = "IndexSignature";
    ReflectionKind[ReflectionKind["ConstructorSignature"] = 16384] = "ConstructorSignature";
    ReflectionKind[ReflectionKind["Parameter"] = 32768] = "Parameter";
    ReflectionKind[ReflectionKind["TypeLiteral"] = 65536] = "TypeLiteral";
    ReflectionKind[ReflectionKind["TypeParameter"] = 131072] = "TypeParameter";
    ReflectionKind[ReflectionKind["Accessor"] = 262144] = "Accessor";
    ReflectionKind[ReflectionKind["GetSignature"] = 524288] = "GetSignature";
    ReflectionKind[ReflectionKind["SetSignature"] = 1048576] = "SetSignature";
    ReflectionKind[ReflectionKind["TypeAlias"] = 2097152] = "TypeAlias";
    ReflectionKind[ReflectionKind["Reference"] = 4194304] = "Reference";
    /**
     * Generic non-ts content to be included in the generated docs as its own page.
     */
    ReflectionKind[ReflectionKind["Document"] = 8388608] = "Document";
})(ReflectionKind || (ReflectionKind = {}));
/** @category Reflections */
(function (ReflectionKind) {
    /** @internal */
    ReflectionKind.All = ReflectionKind.Reference * 2 - 1;
    /** @internal */
    ReflectionKind.ClassOrInterface = ReflectionKind.Class | ReflectionKind.Interface;
    /** @internal */
    ReflectionKind.VariableOrProperty = ReflectionKind.Variable | ReflectionKind.Property;
    /** @internal */
    ReflectionKind.FunctionOrMethod = ReflectionKind.Function | ReflectionKind.Method;
    /** @internal */
    ReflectionKind.ClassMember = ReflectionKind.Accessor |
        ReflectionKind.Constructor |
        ReflectionKind.Method |
        ReflectionKind.Property;
    /** @internal */
    ReflectionKind.SomeSignature = ReflectionKind.CallSignature |
        ReflectionKind.IndexSignature |
        ReflectionKind.ConstructorSignature |
        ReflectionKind.GetSignature |
        ReflectionKind.SetSignature;
    /** @internal */
    ReflectionKind.SomeModule = ReflectionKind.Namespace | ReflectionKind.Module;
    /** @internal */
    ReflectionKind.SomeType = ReflectionKind.Interface |
        ReflectionKind.TypeLiteral |
        ReflectionKind.TypeParameter |
        ReflectionKind.TypeAlias;
    /** @internal */
    ReflectionKind.SomeValue = ReflectionKind.Variable | ReflectionKind.Function;
    /** @internal */
    ReflectionKind.SomeMember = ReflectionKind.EnumMember |
        ReflectionKind.Property |
        ReflectionKind.Method |
        ReflectionKind.Accessor;
    /** @internal */
    ReflectionKind.SomeExport = ReflectionKind.Module |
        ReflectionKind.Namespace |
        ReflectionKind.Enum |
        ReflectionKind.Variable |
        ReflectionKind.Function |
        ReflectionKind.Class |
        ReflectionKind.Interface |
        ReflectionKind.TypeAlias |
        ReflectionKind.Reference;
    /** @internal */
    ReflectionKind.MayContainDocuments = ReflectionKind.SomeExport | ReflectionKind.Project | ReflectionKind.Document;
    /** @internal */
    ReflectionKind.ExportContainer = ReflectionKind.SomeModule | ReflectionKind.Project;
    /** @internal */
    ReflectionKind.Inheritable = ReflectionKind.Accessor |
        ReflectionKind.IndexSignature |
        ReflectionKind.Property |
        ReflectionKind.Method |
        ReflectionKind.Constructor;
    /** @internal */
    ReflectionKind.ContainsCallSignatures = ReflectionKind.Constructor |
        ReflectionKind.Function |
        ReflectionKind.Method;
    // The differences between Type/Value here only really matter for
    // possibly merged declarations where we have multiple reflections.
    /** @internal */
    ReflectionKind.TypeReferenceTarget = ReflectionKind.Interface |
        ReflectionKind.TypeAlias |
        ReflectionKind.Class |
        ReflectionKind.Enum;
    /** @internal */
    ReflectionKind.ValueReferenceTarget = ReflectionKind.Module |
        ReflectionKind.Namespace |
        ReflectionKind.Variable |
        ReflectionKind.Function;
    /**
     * Note: This does not include Class/Interface, even though they technically could contain index signatures
     * @internal
     */
    ReflectionKind.SignatureContainer = ReflectionKind.ContainsCallSignatures | ReflectionKind.Accessor;
    /** @internal */
    ReflectionKind.VariableContainer = ReflectionKind.SomeModule | ReflectionKind.Project;
    /** @internal */
    ReflectionKind.MethodContainer = ReflectionKind.ClassOrInterface |
        ReflectionKind.VariableOrProperty |
        ReflectionKind.FunctionOrMethod |
        ReflectionKind.TypeLiteral;
    function singularString(kind) {
        switch (kind) {
            case ReflectionKind.Project:
                return i18n.kind_project();
            case ReflectionKind.Module:
                return i18n.kind_module();
            case ReflectionKind.Namespace:
                return i18n.kind_namespace();
            case ReflectionKind.Enum:
                return i18n.kind_enum();
            case ReflectionKind.EnumMember:
                return i18n.kind_enum_member();
            case ReflectionKind.Variable:
                return i18n.kind_variable();
            case ReflectionKind.Function:
                return i18n.kind_function();
            case ReflectionKind.Class:
                return i18n.kind_class();
            case ReflectionKind.Interface:
                return i18n.kind_interface();
            case ReflectionKind.Constructor:
                return i18n.kind_constructor();
            case ReflectionKind.Property:
                return i18n.kind_property();
            case ReflectionKind.Method:
                return i18n.kind_method();
            case ReflectionKind.CallSignature:
                return i18n.kind_call_signature();
            case ReflectionKind.IndexSignature:
                return i18n.kind_index_signature();
            case ReflectionKind.ConstructorSignature:
                return i18n.kind_constructor_signature();
            case ReflectionKind.Parameter:
                return i18n.kind_parameter();
            case ReflectionKind.TypeLiteral:
                return i18n.kind_type_literal();
            case ReflectionKind.TypeParameter:
                return i18n.kind_type_parameter();
            case ReflectionKind.Accessor:
                return i18n.kind_accessor();
            case ReflectionKind.GetSignature:
                return i18n.kind_get_signature();
            case ReflectionKind.SetSignature:
                return i18n.kind_set_signature();
            case ReflectionKind.TypeAlias:
                return i18n.kind_type_alias();
            case ReflectionKind.Reference:
                return i18n.kind_reference();
            case ReflectionKind.Document:
                return i18n.kind_document();
        }
    }
    ReflectionKind.singularString = singularString;
    function pluralString(kind) {
        switch (kind) {
            case ReflectionKind.Project:
                return i18n.kind_plural_project();
            case ReflectionKind.Module:
                return i18n.kind_plural_module();
            case ReflectionKind.Namespace:
                return i18n.kind_plural_namespace();
            case ReflectionKind.Enum:
                return i18n.kind_plural_enum();
            case ReflectionKind.EnumMember:
                return i18n.kind_plural_enum_member();
            case ReflectionKind.Variable:
                return i18n.kind_plural_variable();
            case ReflectionKind.Function:
                return i18n.kind_plural_function();
            case ReflectionKind.Class:
                return i18n.kind_plural_class();
            case ReflectionKind.Interface:
                return i18n.kind_plural_interface();
            case ReflectionKind.Constructor:
                return i18n.kind_plural_constructor();
            case ReflectionKind.Property:
                return i18n.kind_plural_property();
            case ReflectionKind.Method:
                return i18n.kind_plural_method();
            case ReflectionKind.CallSignature:
                return i18n.kind_plural_call_signature();
            case ReflectionKind.IndexSignature:
                return i18n.kind_plural_index_signature();
            case ReflectionKind.ConstructorSignature:
                return i18n.kind_plural_constructor_signature();
            case ReflectionKind.Parameter:
                return i18n.kind_plural_parameter();
            case ReflectionKind.TypeLiteral:
                return i18n.kind_plural_type_literal();
            case ReflectionKind.TypeParameter:
                return i18n.kind_plural_type_parameter();
            case ReflectionKind.Accessor:
                return i18n.kind_plural_accessor();
            case ReflectionKind.GetSignature:
                return i18n.kind_plural_get_signature();
            case ReflectionKind.SetSignature:
                return i18n.kind_plural_set_signature();
            case ReflectionKind.TypeAlias:
                return i18n.kind_plural_type_alias();
            case ReflectionKind.Reference:
                return i18n.kind_plural_reference();
            case ReflectionKind.Document:
                return i18n.kind_plural_document();
        }
    }
    ReflectionKind.pluralString = pluralString;
    function classString(kind) {
        return `tsd-kind-${ReflectionKind[kind]
            .replace(/(.)([A-Z])/g, (_m, a, b) => `${a}-${b}`)
            .toLowerCase()}`;
    }
    ReflectionKind.classString = classString;
})(ReflectionKind || (ReflectionKind = {}));
