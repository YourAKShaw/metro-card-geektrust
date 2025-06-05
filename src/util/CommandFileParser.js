import { createReadStream } from 'fs';
import { createInterface } from 'readline';

/**
 * Represents a parsed command from the input file.
 * @typedef {Object} InputCommand
 * @property {string} command - The main command keyword (e.g., BALANCE, CHECK_IN).
 * @property {string[]} token - The list of arguments associated with the command.
 */

/**
 * CommandFileParser is responsible for:
 * - Reading input files
 * - Filtering out comments and empty lines
 * - Parsing valid lines into structured command objects
 */
class CommandFileParser {
  /**
   * @param {string} filePath - The path to the file containing command instructions.
   */
  constructor(filePath = '') {
    this.filePath = filePath;
  }

  /**
   * Reads and parses commands from the input file.
   * Skips lines that are empty or start with a comment character `#`.
   * 
   * @returns {Promise<InputCommand[]>} - A promise resolving to an array of parsed commands.
   * @throws {Error} - If file cannot be read or contains invalid lines.
   */
  async getCommandsFromFile() {
    if (!this.filePath) {
      throw new Error("File path not provided.");
    }

    const inputCommands = [];

    try {
      const fileStream = createReadStream(this.filePath);
      const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        if (!this._isEmptyOrComment(line)) {
          inputCommands.push(this._parseInput(line));
        }
      }

      return inputCommands;
    } catch (err) {
      throw new Error("Some error occurred while processing the input file.");
    }
  }

  /**
   * Parses a command line into an InputCommand object.
   * 
   * @param {string} line - A single line from the input file.
   * @returns {InputCommand} - Parsed command with its arguments.
   * @throws {Error} - If the line cannot be parsed properly.
   */
  _parseInput(line) {
    try {
      const parts = line.trim().split(/\s+/);
      const command = parts[0];
      const token = parts.slice(1);
      return { command, token };
    } catch (err) {
      throw new Error("Invalid command supplied: " + line);
    }
  }

  /**
   * Determines whether a line is a comment or empty.
   * 
   * @param {string} line - Line from the input file.
   * @returns {boolean} - True if the line is a comment or empty.
   */
  _isEmptyOrComment(line) {
    const trimmed = line.trim();
    return trimmed.length === 0 || trimmed.startsWith('#');
  }
}

export default CommandFileParser;
