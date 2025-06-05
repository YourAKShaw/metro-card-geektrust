import CommandValidator from "./CommandValidator.js";

/**
 * Custom exception class for handling processing-related errors.
 */
class ProcessingException extends Error {
  constructor(message) {
    super(message);
    this.name = "ProcessingException";
  }
}

/**
 * CommandValidatorImpl
 *
 * Validates various types of MetroCard system commands.
 * Supported commands:
 * - BALANCE <cardId> <amount>
 * - CHECK_IN <cardId> <passengerType> <station>
 * - PRINT_SUMMARY
 */
class CommandValidatorImpl extends CommandValidator {
  /**
   * Validates the given input command object.
   *
   * @param {Object} inputCommand - The command object containing command and tokens.
   * @param {string} inputCommand.command - The command type.
   * @param {string[]} inputCommand.token - The arguments associated with the command.
   * @throws {ProcessingException} If command is invalid or tokens do not follow rules.
   */
  validateCommand(inputCommand) {
    const { command, token: tokens } = inputCommand;

    switch (command) {
      case "BALANCE":
        this.validateBalance(tokens);
        break;
      case "CHECK_IN":
        this.validateCheckIn(tokens);
        break;
      case "PRINT_SUMMARY":
        this.validatePrintSummary(tokens);
        break;
      default:
        throw new ProcessingException(
          `Invalid command '${command}'. Please check the input.`
        );
    }
  }

  /**
   * Validates the BALANCE command.
   * Expected format: BALANCE <cardId> <balance>
   *
   * @param {string[]} tokens - Array containing card ID and balance.
   * @throws {ProcessingException} If incorrect number of arguments or invalid balance.
   */
  validateBalance(tokens) {
    if (tokens.length !== 2) {
      throw new ProcessingException(
        "BALANCE command requires exactly 2 arguments: <cardId> <balance>."
      );
    }

    const balance = Number(tokens[1]);
    if (isNaN(balance) || balance < 0) {
      throw new ProcessingException("Balance must be a non-negative number.");
    }
  }

  /**
   * Validates the CHECK_IN command.
   * Expected format: CHECK_IN <cardId> <passengerType> <station>
   *
   * @param {string[]} tokens - Array containing card ID, passenger type, and station.
   * @throws {ProcessingException} If invalid argument count, passenger type, or station.
   */
  validateCheckIn(tokens) {
    if (tokens.length !== 3) {
      throw new ProcessingException(
        "CHECK_IN command requires exactly 3 arguments: <cardId> <passengerType> <station>."
      );
    }

    const passengerType = tokens[1];
    const validTypes = ["ADULT", "SENIOR_CITIZEN", "KID"];
    if (!validTypes.includes(passengerType)) {
      throw new ProcessingException(
        `Invalid passenger type '${passengerType}'. Allowed types: ${validTypes.join(
          ", "
        )}.`
      );
    }

    const fromStation = tokens[2];
    const validStations = ["AIRPORT", "CENTRAL"];
    if (!validStations.includes(fromStation)) {
      throw new ProcessingException(
        `Invalid station '${fromStation}'. Allowed stations: ${validStations.join(
          ", "
        )}.`
      );
    }
  }

  /**
   * Validates the PRINT_SUMMARY command.
   * Expected format: PRINT_SUMMARY
   *
   * @param {string[]} tokens - Should be empty.
   * @throws {ProcessingException} If any argument is passed to PRINT_SUMMARY.
   */
  validatePrintSummary(tokens) {
    if (tokens.length !== 0) {
      throw new ProcessingException(
        "PRINT_SUMMARY command should not have any arguments."
      );
    }
  }
}

export default CommandValidatorImpl;
