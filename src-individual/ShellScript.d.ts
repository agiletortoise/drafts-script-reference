/**
 * > _**macOS only**. Requires Drafts 19 or greater._
 * 
 * ShellScript objects can be used to execute Unix shell scripts.
 *
 * #### Bash Example
 * 
 * ```javascript
 * // define text of bash script
 * let script = `#!/bin/bash
 * echo "Total arguments : $#"
 * echo "1st Argument = $1"
 * echo "2nd argument = $2"
 * `;
 * let runner = ShellScript.create(script);
 *
 * if (runner.execute(["1", "2"])) {
 * 	alert("STDOUT: " + runner.standardOutput);
 * }
 * else {
 * 	alert("STDERR: " + runner.standardError);
 * }
 * ```
 * 
 * #### Ruby Example
 * 
 * ```javascript
 * let script = `#!/usr/bin/env ruby
 * ARGV.each do |a|
 *   puts "Argument: #{a}"
 * end
 * `;
 * let runner = ShellScript.create(script);
 *
 * if (runner.execute(["1", "2"])) {
 * 	alert("STDOUT:\n" + runner.standardOutput);
 * }
 * else {
 * 	alert("STDERR:\n" + runner.standardError);
 * }
 * ```
 * 
 * **Note:** When executed, scripts are saved to temporary files in the Drafts' script directory at `~/Library/Application Scripts/com.agiletortoise.Drafts-OSX` and run. Scripts should not be written to make assumptions about their location in the file system (e.g. using relative paths). The first time a script is executed, the user will be asked to grant permissions to the script directory.
 */
declare class ShellScript {
    /**
     * Content sent to standard error during the execution of the script
     */
    standardError?: string | undefined

    /**
    * Content sent to standard output during the execution of the script
    */
    standardOutput?: string | undefined

    /**
     * Convenience method to create a ShellScript object.
     * @param script A string containing the shell script. This should contain the appropriate "she bang" to trigger the appropriate scripting language/shell.
     */
    static create(script: string): ShellScript

    /**
     * Create new instance.
     */
    constructor(script: string)

    /**
     * Executes the shell script.
     * @param arguments An array of string arguments to pass to the script. These will appear to the script as command line arguments would.
     * @returns `true` if the script was executed without error, `false` if not. 
     */
    execute(arguments: string[]): boolean

}

