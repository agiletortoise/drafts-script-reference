/**
 * Drafts defines a single global `device` object which provides access to information about the current device.
 * 
 * @example
 * 
 * ```javascript
 * // get system info from device object
 * let model = device.model;
 * let system = device.systemName;
 * let osVersion = device.systemVersion;
 * let batteryLevel = device.batteryLevel;
 * 
 * // create and display it in an alert
 * let s = "Model: " + model + "\n";
 * s = s + "System: " + system + "\n";
 * s = s + "OS: " + osVersion + "\n";
 * s = s + "Battery: " + batteryLevel;
 * alert(s);
 * 
 * // branch logic based on platform
 * if (device.systemName == 'macOS') {
 *     // do something only on Mac
 * }
 * else {
 *     // do something only on iOS
 * }
 * ```
 */
declare class Device {
    private constructor()
    /**
     * Model of current device.
     */
    model: 'iPhone' | 'iPad' | 'Mac' 

    /**
     * Name of current OS.
     */
    systemName: 'iOS' | 'macOS'

    /**
     * Version of current OS.
     */
    systemVersion: string

    /**
     * Current battery level as a number between 0.0 and 1.0
     */
    batteryLevel: number
}
/**
 * Current device.
 */
declare const  device: Device
