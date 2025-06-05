const fs = require("fs/promises");
const main = require("./geektrust.js"); // PascalCase file if renamed accordingly

jest.mock("fs/promises");

describe("geektrust CLI", () => {
  it("prints output for valid input file", async () => {
    const inputData = "BALANCE MC1 500\nPRINT_SUMMARY\n";
    fs.readFile.mockResolvedValue(inputData);

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await main(["dummyPath"]);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("throws error when no file arg passed", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await main([]);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Input file not supplied. Please provide the input file path as the sole argument."
    );
    consoleErrorSpy.mockRestore();
  });
});
