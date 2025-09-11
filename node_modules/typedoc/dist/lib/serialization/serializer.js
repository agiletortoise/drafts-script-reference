import { SerializeEvent } from "./events.js";
import { EventDispatcher, insertPrioritySorted, removeIfPresent } from "#utils";
/**
 * Serializes TypeDoc's models to JSON
 *
 * @group None
 * @summary Serializes TypeDoc's models to JSON
 */
export class Serializer extends EventDispatcher {
    /**
     * Triggered when the {@link Serializer} begins transforming a project.
     * @event
     */
    static EVENT_BEGIN = "begin";
    /**
     * Triggered when the {@link Serializer} has finished transforming a project.
     * @event
     */
    static EVENT_END = "end";
    serializers = [];
    /**
     * Only set when serializing.
     */
    projectRoot;
    /**
     * Only set when serializing
     */
    project;
    addSerializer(serializer) {
        insertPrioritySorted(this.serializers, serializer);
    }
    removeSerializer(serializer) {
        removeIfPresent(this.serializers, serializer);
    }
    toObject(value) {
        if (value === undefined) {
            return undefined;
        }
        return this.serializers
            .filter((s) => s.supports(value))
            .reduce((val, s) => s.toObject(value, val, this), value.toObject(this));
    }
    toObjectsOptional(value) {
        if (!value || value.length === 0) {
            return undefined;
        }
        return value.map((val) => this.toObject(val));
    }
    /**
     * Same as toObject but emits {@link Serializer.EVENT_BEGIN} and {@link Serializer.EVENT_END} events.
     * @param value
     */
    projectToObject(value, projectRoot) {
        this.projectRoot = projectRoot;
        this.project = value;
        const eventBegin = new SerializeEvent(value);
        this.trigger(Serializer.EVENT_BEGIN, eventBegin);
        const project = this.toObject(value);
        const eventEnd = new SerializeEvent(value, project);
        this.trigger(Serializer.EVENT_END, eventEnd);
        this.project = undefined;
        this.projectRoot = undefined;
        return project;
    }
}
