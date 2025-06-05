const fs = require("fs/promises");
const CommandFileParser = require ("./CommandFileParser.js");

jest.mock("fs/promises");

describe("CommandFileParser", () => {
  it("reads commands from file correctly", async () => {
    const mockData =
      "BALANCE MC1 100\nCHECK_IN MC1 ADULT CENTRAL\nPRINT_SUMMARY\n";
    fs.readFile.mockResolvedValue(mockData);

    const parser = new CommandFileParser("dummyPath");
    const commands = await parser.getCommandsFromFile();

    expect(fs.readFile).toHaveBeenCalledWith("dummyPath", "utf8");
    expect(commands).toEqual([
      "BALANCE MC1 100",
      "CHECK_IN MC1 ADULT CENTRAL",
      "PRINT_SUMMARY",
    ]);
  });

  it("handles empty lines correctly", async () => {
    const mockData =
      "BALANCE MC1 100\n\nCHECK_IN MC1 ADULT CENTRAL\n\nPRINT_SUMMARY\n";
    fs.readFile.mockResolvedValue(mockData);

    const parser = new CommandFileParser("dummyPath");
    const commands = await parser.getCommandsFromFile();

    expect(commands).not.toContain("");
    expect(commands).toContain("BALANCE MC1 100");
  });
});
