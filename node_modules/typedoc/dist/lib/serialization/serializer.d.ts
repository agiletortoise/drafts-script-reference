import { EventDispatcher } from "../utils";
import type { ProjectReflection } from "../models";
import { SerializeEvent } from "./events";
import type { ModelToObject } from "./schema";
import type { SerializerComponent } from "./components";
export interface SerializerEvents {
    begin: [SerializeEvent];
    end: [SerializeEvent];
}
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
    projectRoot: string;
    /**
     * Only set when serializing
     */
    project: ProjectReflection;
    addSerializer<T extends object>(serializer: SerializerComponent<T>): void;
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
    projectToObject(value: ProjectReflection, projectRoot: string): ModelToObject<ProjectReflection>;
}
