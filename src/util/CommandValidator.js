/**
 * CommandValidator is an interface-like base class
 * that defines a contract for validating input commands.
 *
 * Concrete implementations must implement the `validateCommand` method.
 */

/**
 * @typedef {Object} InputCommand
 * @property {string} command - The command keyword (e.g., BALANCE, CHECK_IN, PRINT_SUMMARY).
 * @property {string[]} token - The list of arguments for the command.
 */

class CommandValidator {
  /**
   * Validates the structure and correctness of an input command.
   *
   * @param {InputCommand} inputCommand - The command object to validate.
   * @throws {Error} Throws error if command or arguments are invalid.
   */
  validateCommand(inputCommand) {
    throw new Error("validateCommand method must be implemented by subclass");
  }
}

export default CommandValidator;