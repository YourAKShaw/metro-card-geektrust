/**
 * Represents a parsed input command with associated tokens.
 */
class InputCommands {
  /**
   * @param {string} command - The command string (e.g., "BALANCE", "CHECK_IN").
   * @param {string[]} token - An array of tokens/arguments for the command.
   */
  constructor(command, token) {
    this.command = command;
    this.token = token;
  }

  /**
   * @returns {string} The command name.
   */
  getCommand() {
    return this.command;
  }

  /**
   * @param {string} command
   */
  setCommand(command) {
    this.command = command;
  }

  /**
   * @returns {string[]} List of command tokens.
   */
  getToken() {
    return this.token;
  }

  /**
   * @param {string[]} token
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Compares this command with another for equality.
   * @param {InputCommands} obj - The object to compare.
   * @returns {boolean}
   */
  equals(obj) {
    if (this === obj) return true;
    if (!obj || !(obj instanceof InputCommands)) return false;
    return (
      this.command === obj.command &&
      JSON.stringify(this.token) === JSON.stringify(obj.token)
    );
  }
}

export default InputCommands;
