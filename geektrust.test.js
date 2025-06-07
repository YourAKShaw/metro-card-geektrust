// geektrust.test.js
import { jest } from "@jest/globals";

// Mock the dependencies before importing
const mockExecuteCommands = jest.fn();
const mockGetCommandsFromFile = jest.fn();

jest.unstable_mockModule("./src/util/CommandFileParser.js", () => ({
  default: jest.fn().mockImplementation(() => ({
    getCommandsFromFile: mockGetCommandsFromFile,
  })),
}));

jest.unstable_mockModule("./src/service/MetroCardServiceImpl.js", () => ({
  default: jest.fn().mockImplementation(() => ({
    executeCommands: mockExecuteCommands,
  })),
}));

jest.unstable_mockModule("fs", () => ({
  default: {
    existsSync: jest.fn(),
  },
}));

// Import after mocking
const { default: main } = await import("./geektrust.js");
const { default: fs } = await import("fs");

describe("geektrust CLI", () => {
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    mockExecuteCommands.mockReset();
    mockGetCommandsFromFile.mockReset();

    // Setup console spies
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console methods
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("processes valid input file successfully", async () => {
    // Mock file existence check
    fs.existsSync.mockReturnValue(true);

    // Mock command parsing
    const mockCommands = [
      { command: "BALANCE", token: ["MC1", "500"] },
      { command: "PRINT_SUMMARY", token: [] },
    ];
    mockGetCommandsFromFile.mockResolvedValue(mockCommands);

    // Mock service execution
    const mockOutput =
      "TOTAL_COLLECTION CENTRAL 0 0\nTOTAL_COLLECTION AIRPORT 0 0";
    mockExecuteCommands.mockReturnValue(mockOutput);

    await main(["input.txt"]);

    expect(fs.existsSync).toHaveBeenCalledWith("input.txt");
    expect(mockGetCommandsFromFile).toHaveBeenCalled();
    expect(mockExecuteCommands).toHaveBeenCalledWith(mockCommands);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("throws error when no file argument is passed", async () => {
    await main([]);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Input file not supplied. Please provide the input file path as the sole argument."
    );
    expect(fs.existsSync).not.toHaveBeenCalled();
  });

  it("throws error when multiple file arguments are passed", async () => {
    await main(["file1.txt", "file2.txt"]);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Input file not supplied. Please provide the input file path as the sole argument."
    );
    expect(fs.existsSync).not.toHaveBeenCalled();
  });

  it("throws error when input file does not exist", async () => {
    fs.existsSync.mockReturnValue(false);

    await main(["nonexistent.txt"]);

    expect(fs.existsSync).toHaveBeenCalledWith("nonexistent.txt");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Input file does not exist: nonexistent.txt"
    );
  });

  it("handles file parsing errors gracefully", async () => {
    fs.existsSync.mockReturnValue(true);
    mockGetCommandsFromFile.mockRejectedValue(new Error("File parsing failed"));

    await main(["input.txt"]);

    expect(consoleErrorSpy).toHaveBeenCalledWith("File parsing failed");
  });

  it("handles service execution errors gracefully", async () => {
    fs.existsSync.mockReturnValue(true);

    const mockCommands = [{ command: "BALANCE", token: ["MC1", "500"] }];
    mockGetCommandsFromFile.mockResolvedValue(mockCommands);
    mockExecuteCommands.mockImplementation(() => {
      throw new Error("Service execution failed");
    });

    await main(["input.txt"]);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Service execution failed");
  });

  it("processes commands with complex scenario", async () => {
    fs.existsSync.mockReturnValue(true);

    const mockCommands = [
      { command: "BALANCE", token: ["MC1", "600"] },
      { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] },
      { command: "PRINT_SUMMARY", token: [] },
    ];
    mockGetCommandsFromFile.mockResolvedValue(mockCommands);

    const mockOutput =
      "TOTAL_COLLECTION CENTRAL 200 0\nTOTAL_COLLECTION AIRPORT 0 0\nPASSENGER_TYPE_SUMMARY\nADULT 1";
    mockExecuteCommands.mockReturnValue(mockOutput);

    await main(["input.txt"]);

    expect(mockExecuteCommands).toHaveBeenCalledWith(mockCommands);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
