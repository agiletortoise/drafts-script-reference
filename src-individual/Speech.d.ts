/**
 * Supports text-to-speech operations to read aloud text content using system speech synthesis APIs. Speech objects cannot be instantiated, but are accessed via a single global `speech` object.
 *
 * #### Example
 * 
 * ```javascript
 * // read text 
 * speech.speak("Hello World")
 * 
 * // read with options
 * let voices = speech.voices("it-IT")
 * speech.speak("Hello World", {
 *     "voice": voices[0],
 *     "rate": "fast",
 *     "autoClose": false
 * })
 * ```
 * 
 * **Note:** Speech features are available only on iOS 18 and macOS 15 and greater.
 */
declare class Speech {
    /**
     * Array of available voices on the device. Can be used to locate available voices for different languages.
     */
    allVoices: SpeechVoice[]

     /**
      * List voices available for a specific language/locale.
     * @param language BCP 47 style locale identifier for the language to filter voices by, similar to `en-US` (US English) or `it-IT` (Italian Italian).
     * @returns Array of available voices of the specified locale. 
     */
    voices(language: string): SpeechVoice[]

    /**
     * Executes the shell script.
     * @param arguments An array of string arguments to pass to the script. These will appear to the script as command line arguments would.
     * @returns `true` if the script was executed without error, `false` if not. 
     */
    speak(text: string, settings: {
        /**
         * A voice to pre-select. Optional, and defaults to user's last selected voice.
         */
        voice?: SpeechVoice,
        /**
        * Rate of speech, supported values "slow", "normal", "fast"
        */
        rate?: string,
        /** If enabled, auto-start the speech. Default: `true` */
        autoStart?: boolean,
        /** If enabled, auto-close the speech interface and continue when audio is finished. Default: `true` */
        autoClose?: boolean
    }): boolean

}

