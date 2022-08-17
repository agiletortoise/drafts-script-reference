"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serializer = void 0;
const utils_1 = require("../utils");
const events_1 = require("./events");
class Serializer extends utils_1.EventDispatcher {
    constructor() {
        super(...arguments);
        this.serializers = [];
    }
    addSerializer(serializer) {
        if ("serializeGroup" in serializer) {
            // Remove this check in 0.24
            throw new Error("Support for `serializeGroup` was removed. Use supports instead.");
        }
        this.serializers.push(serializer);
        this.serializers.sort((a, b) => b.priority - a.priority);
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
     * @param eventData Partial information to set in the event
     */
    projectToObject(value, eventData = {}) {
        const eventBegin = new events_1.SerializeEvent(Serializer.EVENT_BEGIN, value);
        if (eventData.begin) {
            eventBegin.outputDirectory = eventData.begin.outputDirectory;
            eventBegin.outputFile = eventData.begin.outputFile;
        }
        this.trigger(eventBegin);
        const project = this.toObject(value);
        const eventEnd = new events_1.SerializeEvent(Serializer.EVENT_END, value, project);
        if (eventData.end) {
            eventBegin.outputDirectory = eventData.end.outputDirectory;
            eventBegin.outputFile = eventData.end.outputFile;
        }
        this.trigger(eventEnd);
        return project;
    }
}
exports.Serializer = Serializer;
/**
 * Triggered when the {@link Serializer} begins transforming a project.
 * @event EVENT_BEGIN
 */
Serializer.EVENT_BEGIN = "begin";
/**
 * Triggered when the {@link Serializer} has finished transforming a project.
 * @event EVENT_END
 */
Serializer.EVENT_END = "end";
