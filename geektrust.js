#!/usr/bin/env node
// geektrust.js - Main entry point for MetroCard project

import CommandFileParser from "./src/util/CommandFileParser.js";
import MetroCardServiceImpl from "./src/service/MetroCardServiceImpl.js";
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

/**
 * Main runner function that serves as the entry point to the application.
 * It expects a single command-line argument: the path to the input file.
 *
 * @param {string[]} args - Command line arguments array excluding node and script path.
 */
async function main(args) {
  try {
    if (args.length !== 1) {
      throw new Error(
        "Input file not supplied. Please provide the input file path as the sole argument."
      );
    }

    const filePath = args[0];

    if (!fs.existsSync(filePath)) {
      throw new Error(`Input file does not exist: ${filePath}`);
    }

    await processMetroCard(filePath);
    
  } catch (error) {
    console.error(error.message);
  }
}

/**
 * Reads the input file, parses commands, and delegates command execution to the service.
 *
 * @param {string} filePath - Path to the input file containing metro card commands
 * @returns {Promise<string>} - Output from the processed commands, formatted as a string
 */
async function processMetroCard(filePath) {
  const reader = new CommandFileParser(filePath);
  const commands = await reader.getCommandsFromFile();
  const cardService = new MetroCardServiceImpl();
  cardService.executeCommands(commands);
}

// Determine if the current module is being run directly using ES module-safe check
const __filename = fileURLToPath(import.meta.url);
const __main = process.argv[1] && resolve(process.argv[1]) === __filename;

// Run main() only if this script is executed directly
if (__main) {
  main(process.argv.slice(2));
}

// Export for testability and reuse
export default main;
