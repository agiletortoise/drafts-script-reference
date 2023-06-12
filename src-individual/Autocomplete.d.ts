/**
 * Create and update entries in the Editor's [global autocomplete system](https://docs.getdrafts.com/docs/editor/autocomplete)
 * 
 * @example
 *
 * ```javascript
 * // work with the default system autocomplete
 * let autocomplete = Autocomplete.getDefault();
 * // object with all autocomplete items, using label as key
 * let items = autocomplete.getAll();
 * // add new autocomplete item
 * autocomplete.add("label", "template value");
 * ```
 * 
 */
declare class Autocomplete {
        private constructor()
    /**
     * Get the default system global autocomplete object
     * @category Constructors
     */
    static getDefault(): Autocomplete

    /**
     * Get all existing autocomplete items as an object with the item lobels as keys, and templates as values.
     * @category Query
     */
    getAll(): object

    /**
     * Create a new autocomplete item
     * @param label The label used in the autocomplete drop-down
     * @param template The template value used to insert text
     * @category Update
     */
    add(label: string, template: string): boolean

    /**
     * Deletes aa autocomplete item. Returns true if successful, false if item with label does not exist.
     * @param label The label used in the autocomplete drop-down
     * @category Update
     */
    remove(label: string): boolean
}
