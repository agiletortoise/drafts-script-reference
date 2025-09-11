import type { ProjectReflection } from "#models";
import { SerializeEvent } from "./events.js";
import type { ModelToObject } from "./schema.js";
import type { SerializerComponent } from "./components.js";
import { EventDispatcher, type NormalizedPath } from "#utils";
export interface SerializerEvents {
    begin: [SerializeEvent];
    end: [SerializeEvent];
}
/**
 * Serializes TypeDoc's models to JSON
 *
 * @group None
 * @summary Serializes TypeDoc's models to JSON
 */
export declare class Serializer extends EventDispatcher<SerializerEvents> {
    /**
     * Triggered when the {@link Serializer} begins transforming a project.
     * @event
     */
    static readonly EVENT_BEGIN = "begin";
    /**
     * Triggered when the {@link Serializer} has finished transforming a project.
     * @event
     */
    static readonly EVENT_END = "end";
    private serializers;
    /**
     * Only set when serializing.
     */
    projectRoot: NormalizedPath;
    /**
     * Only set when serializing
     */
    project: ProjectReflection;
    addSerializer<T extends object>(serializer: SerializerComponent<T>): void;
    removeSerializer(serializer: SerializerComponent<any>): void;
    toObject<T extends {
        toObject(serializer: Serializer): ModelToObject<T>;
    }>(value: T): ModelToObject<T>;
    toObject<T extends {
        toObject(serializer: Serializer): ModelToObject<T>;
    }>(value: T | undefined): ModelToObject<T> | undefined;
    toObjectsOptional<T extends {
        toObject(serializer: Serializer): ModelToObject<T>;
    }>(value: T[] | undefined): ModelToObject<T>[] | undefined;
    /**
     * Same as toObject but emits {@link Serializer.EVENT_BEGIN} and {@link Serializer.EVENT_END} events.
     * @param value
     */
    projectToObject(value: ProjectReflection, projectRoot: NormalizedPath): ModelToObject<ProjectReflection>;
}
