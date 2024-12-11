/**
 * See {@link Speech} documentation for example usage.
 */
declare class SpeechVoice {
    /**
     * Unique identifier for the voice.
     */
    id: string

    /**
    * Friendly name for the voice. Typically this is a common name like "Samantha" and is provided by the OS.
    */
    name: string

    /**
    * BCP 47 style locale identifier for the language, country the voice is intended for use with. Examples: `en-US` (US English), `es-MX` (Mexican Spanish).
    */
    language: string

}

