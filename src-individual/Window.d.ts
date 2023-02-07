/**
 * Access `Window` properties and functions through the `currentWindow` property of the global `app` object.
 */
declare class Window {
    private constructor()
    /**
     * Array of the drafts currently selected by the user in the draft list. Can be iterated to create custom actions which operate on the selection.
     */
    selectedDrafts: Draft[]
}
