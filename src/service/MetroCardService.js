/**
 * Abstract class representing metro card service operations.
 * Implementations should provide logic for executing commands related to metro card processing.
 */
class MetroCardService {
  /**
   * Executes a list of input commands.
   * @param {Array<Object>} arguments - List of InputCommands objects or plain objects with command data.
   * @returns {string} Result or summary after executing commands.
   */
  executeCommands() {
    throw new Error("Method executeCommands() must be implemented.");
  }

  /**
   * Initializes a passenger's balance based on tokens from a BALANCE command.
   * @param {Array<string>} tokens - List of tokens related to balance initialization.
   * @returns {Object} Passenger object representing initialized passenger details.
   */
  initializeBalance(tokens) {
    throw new Error("Method initializeBalance() must be implemented.");
  }

  /**
   * Processes a CHECK_IN command with relevant tokens.
   * @param {Array<string>} tokens - List of tokens related to passenger check-in.
   * @returns {void}
   */
  processCheckIn(tokens) {
    throw new Error("Method processCheckIn() must be implemented.");
  }

  /**
   * Prints or generates a summary after processing commands.
   * @returns {string} Summary string.
   */
  printSummary() {
    throw new Error("Method printSummary() must be implemented.");
  }
}

export default MetroCardService;