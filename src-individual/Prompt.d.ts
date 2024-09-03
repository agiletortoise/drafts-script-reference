type keyboardTypes =
    | 'default'
    | 'numbersAndPunctuation'
    | 'numberPad'
    | 'phonePad'
    | 'namePhonePad'
    | 'emailAddress'
    | 'decimalPad'
    | 'webSearch'
    | 'URL'

type capitalizationTypes = 'none' | 'sentences' | 'words'

type tintColor = 'gray' | 'red' | 'pink' | 'orange' | 'yellow' | 'green' |'blue' | 'indigo' | 'violet'

/**
 * Prompts allow the creation and display of custom dialogs to request information or confirmation from the user.
 * 
 * @example
 * 
 * ```javascript
 * let p = new Prompt()
 * p.title = "Hello"
 * p.message = "World!"
 * 
 * p.addTextField("textFieldName", "Label", "")
 * p.addDatePicker("myDate", "Start date", new Date(), {
 *   "mode": "date"
 * })
 * p.addButton("First")
 * p.addButton("Second")
 * 
 * // if `show` returns false, user hit
 * // cancel button
 * if (p.show()) {
 *   let textFieldContents = p.fieldValues["textFieldName"]
 *   let startDate = p.fieldValues["myDate"]
 *   
 *   if (p.buttonPressed == "First") {
 *     // do something
 *   }
 * }
 * ```
 *
 */
declare class Prompt {
    /**
     * Short title which appears as a heading in the prompt window.
     * @category Display
     */
    title: string

    /**
     * A longer message explaining the purpose of the dialog, if needed.
     * @category Display
     */
    message: string

    /**
     * If set to a valid URL string, a help button which links to the URL will be visible in the prompt directing the user to web-based information about the action. Useful if prompting for options or configuration information that might require addition information to complete.
     * @category Display
     */
    helpURL?: string

    /**
     * If true, a "Cancel" button will be included in the dialog. Defaults to `true`. If the user selects the cancel button, the `show()` method will return `false`. If `false`, no cancel button will be displayed and the user must select one of the button name options.
     * @category Display
     */
    isCancellable: boolean

    /**
     * After the `show()` method is called, this property will contain values from any fields added to the prompt. The dictionary keys will be the names of the fields as passed in when they were created, and the value will be the current contents of that field. They type of data depends on the type of field.
     * @category Result
     */
    fieldValues: { [x: string]: any }

    /**
     * After the `show()` method is called, this property will contain the name of the button selected by the user.
     * @category Result
     */
    buttonPressed: string

    /**
     * Add an information text label to the prompt.
     * @param name Identifier for the field.
     * @param label The text of the label.
     * @param options A dictionary of options for configuring the text field.
     * @category Field
     */
    addLabel(
        name: string,
        label: string,
        options?: { textSize?: 'body' | 'caption' | 'headline' } // FIXME: is this actually optional? and the rest of these
    ): void

    /**
     * Add a text input field to the prompt
     * @param name Identifier for the field. This will be used as the key in the `fieldValues` dictionary to access the contents of the field after calling `show()`.
     * @param label User-friendly text label to place next to the field.
     * @param initialText The initial text contents for the field.
     * @param options A dictionary of options for configuring the text field. 
     * @category Field
     */
    addTextField(
        name: string,
        label: string,
        initialText: string, // FIXME: is this optional?
        options?: {
            /**
            * Placeholder text to use when field is empty
            */
            placeholder?: string
            /**
            * Should system autocorrect be enabled in field, Default: true
            */
            autocorrect?: boolean
            autocapitalization?: capitalizationTypes
            keyboard?: keyboardTypes
            /**
            * If true, focus this field when prompt is displayed
            */
            wantsFocus?: boolean
        }
    ): void

    /**
     * Add a text input field to the prompt
     * @param name Identifier for the field. This will be used as the key in the `fieldValues` dictionary to access the contents of the field after calling `show()`.
     * @param label User-friendly text label to place next to the field.
     * @param initialText The initial text contents for the field.
     * @param options A dictionary of options for configuring the text field. 
     * @category Field
     */
    addTextView(
        name: string,
        label: string,
        initialText: string,
        options?: {
            height?: number
            /**
            * Should system autocorrect be enabled in field, Default: true
            */
            autocorrect?: boolean
            autocapitalization?: capitalizationTypes
            keyboard?: keyboardTypes
            /**
            * If true, focus this field when prompt is displayed
            */
            wantsFocus?: boolean
        }
    ): void

    /**
     * Same as addTextField, but the input field will be password masked.
     * @category Field
     */
    addPasswordField(name: string, label: string, initialValue: string): void

    /**
     * Add an on/off toggle switch. The `fieldValues` entry for this item will be a boolean indicating whether the switch was on.
     * @param name Identifier for the field. This will be used as the key in the `fieldValues` dictionary to access the contents of the field after calling `show()`.
     * @param label User-friendly text label to place next to the field.
     * @param initialValue indicate if the switch should be on or off when initially displayed.
     * @category Field
     */
    addSwitch(name: string, label: string, initialValue: boolean): void

    /**
     * Add a date and/or time picker to the prompt, with the arguments as below. The `fieldValues` entry for this will be a date object.
     * @param name Identifier for the field. This will be used as the key in the `fieldValues` dictionary to access the contents of the field after calling `show()`.
     * @param label User-friendly text label to place next to the field.
     * @param initialDate The initial date to selected for the field. Minimum and maximum values should be defined in options.
     * @param options A dictionary of options for configuring the text field. 
     * @category Field
     */
    addDatePicker(
        name: string,
        label: string,
        initialDate: Date,
        options?: {
            mode?: 'date' | 'time' | 'dateAndTime'
            minimumDate?: Date
            maximumDate?: Date
            minuteInterval?: number
        }
    ): void

    /**
     * Add a picker to the prompt, with the arguments as below. Picker can contain multiple rows. The `fieldValues` entry for this will be a array of selected index values object.
     * @param name Identifier for the field. This will be used as the key in the `fieldValues` dictionary to access the contents of the field after calling `show()`.
     * @param label User-friendly text label to place next to the field.
     * @param columns The values to display in the picker. Should be an array containing arrays of string values, each sub-array representing a column in the picker. Example two column picker: `[["Item 1", "Item 2"],["Column 2 Item 1", "Column 2 Item 2"]]`
     * @param selectedRows Array of zero-based index values to set the initial selected row in each column.
     * @category Field
     */
    addPicker(
        name: string,
        label: string,
        columns: string[][],
        selectedRows: number[]
    ): void

    /**
     * Add a select control. Returns an array of string values in `fieldValues`.
     * @param name Identifier for the field. This will be used as the key in the `fieldValues` dictionary to access the contents of the field after calling `show()`.
     * @param label User-friendly text label to place next to the field.
     * @param values The array of string values that will be available to select.
     * @param selectedValues Array of string values that should be initially selected when the prompt is displayed. All values in this array should match values in the `values` array.
     * @param allowMultiple If `false`, selecting a value will deselect all other values. If `true`, the user may select multiple items.
     * @category Field
     */
    addSelect(
        name: string,
        label: string,
        values: string[],
        selectedValues: string[],
        allowMultiple: boolean
    ): void

        /**
     * Add a segmented control. Best used for selection between a small number of values. Returns a string value in `fieldValues`.
     * @param name Identifier for the field. This will be used as the key in the `fieldValues` dictionary to access the contents of the field after calling `show()`.
     * @param label User-friendly text label to place next to the field.
     * @param values The array of string values that will be available in the segmented control.
     * @param selectedValue String values that should be initially selected when the prompt is displayed. Value should match value in the `values` array.
     * @category Field
     */
    addSegmentedControl(
        name: string,
        label: string,
        values: string[],
        selectedValue: string
    ): void

    /**
     * Add a button to the array of buttons to be displayed. All buttons should be created before calling `show()`.
     * @param name
     * @param value only needed to associate a different value than will be displayed in the button. For example, if you call `prompt.addButton("First Button", 1)`, after calling `prompt.show()` if that button is pressed, the `prompt.buttonPressed` will contain the number value `1`.
     * @param isDefault used to specify a single button which will be pinned to the bottom of the prompt and respond to `cmd + return` as the default button. If only one button is added to a prompt, it is assumed to be the default.
     * @param isDestructive if true, present the button as a destructive action, typically a red button, in the intereface.
     * @param tintColor Optionally override the default tint color of the button for the purpose of providing visual groupings. Tint colors are drawn from the current theme in use.
     * @category Field
     */
    addButton(name: string, value?: object, isDefault?: boolean, isDestructive?: boolean, tintColor?: tintColor): void

    /**
     * Displays the prompt. Returns `true` if the user selected one of the buttons in the buttons array, `false` if the user selected the "Cancel" button. After the dialog has been shown, the `buttonPressed` property will contain the name of the button selected by the user.
     */
    show(): boolean

    /**
     * Create new instance.
     */
    static create(): Prompt

    /**
     * Create new instance.
     */
    constructor()
}
