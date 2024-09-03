"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDispatcher = void 0;
const array_1 = require("./array");
/**
 * Intentionally very simple event emitter.
 *
 * @privateRemarks
 * This is essentially a stripped down copy of EventHooks in hooks.ts.
 */
class EventDispatcher {
    constructor() {
        // Function is *usually* not a good type to use, but here it lets us specify stricter
        // contracts in the methods while not casting everywhere this is used.
        this._listeners = new Map();
    }
    /**
     * Starts listening to an event.
     * @param event the event to listen to.
     * @param listener function to be called when an this event is emitted.
     * @param priority optional priority to insert this hook with.
     */
    on(event, listener, priority = 0) {
        const list = (this._listeners.get(event) || []).slice();
        (0, array_1.insertPrioritySorted)(list, { listener, priority });
        this._listeners.set(event, list);
    }
    /**
     * Stops listening to an event.
     * @param event the event to stop listening to.
     * @param listener the function to remove from the listener array.
     */
    off(event, listener) {
        const listeners = this._listeners.get(event);
        if (listeners) {
            const index = listeners.findIndex((lo) => lo.listener === listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }
    /**
     * Emits an event to all currently subscribed listeners.
     * @param event the event to emit.
     * @param args any arguments required for the event.
     */
    trigger(event, ...args) {
        const listeners = this._listeners.get(event)?.slice() || [];
        for (const { listener } of listeners) {
            listener(...args);
        }
    }
}
exports.EventDispatcher = EventDispatcher;
