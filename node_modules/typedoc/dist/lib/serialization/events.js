"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializeEvent = void 0;
/**
 * An event emitted by the {@link Serializer} class at the very beginning and
 * ending of the a project serialization process.
 *
 * @see {@link Serializer.EVENT_BEGIN}
 * @see {@link Serializer.EVENT_END}
 */
class SerializeEvent {
    constructor(project, output) {
        this.project = project;
        this.output = output;
    }
}
exports.SerializeEvent = SerializeEvent;
