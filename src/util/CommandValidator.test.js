import CommandValidator from "./CommandValidator.js";

describe("CommandValidator", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  describe("constructor", () => {
    it("should create an instance of CommandValidator", () => {
      expect(validator).toBeInstanceOf(CommandValidator);
    });

    it("should be a function/class", () => {
      expect(typeof CommandValidator).toBe("function");
    });
  });

  describe("validateCommand method", () => {
    it("should throw error when validateCommand is called directly", () => {
      const inputCommand = {
        command: "BALANCE",
        token: ["CARD001", "100"],
      };

      expect(() => validator.validateCommand(inputCommand)).toThrow(
        "validateCommand method must be implemented by subclass"
      );
    });

    it("should throw error with any input command", () => {
      const inputCommand = {
        command: "CHECK_IN",
        token: ["CARD001", "ADULT", "AIRPORT"],
      };

      expect(() => validator.validateCommand(inputCommand)).toThrow(
        "validateCommand method must be implemented by subclass"
      );
    });

    it("should throw error with empty command object", () => {
      const inputCommand = {
        command: "",
        token: [],
      };

      expect(() => validator.validateCommand(inputCommand)).toThrow(
        "validateCommand method must be implemented by subclass"
      );
    });

    it("should throw error with null input", () => {
      expect(() => validator.validateCommand(null)).toThrow(
        "validateCommand method must be implemented by subclass"
      );
    });

    it("should throw error with undefined input", () => {
      expect(() => validator.validateCommand(undefined)).toThrow(
        "validateCommand method must be implemented by subclass"
      );
    });

    it("should throw error with malformed input command", () => {
      const inputCommand = {
        invalidProperty: "test",
      };

      expect(() => validator.validateCommand(inputCommand)).toThrow(
        "validateCommand method must be implemented by subclass"
      );
    });
  });

  describe("inheritance behavior", () => {
    it("should be extendable by subclasses", () => {
      class TestValidator extends CommandValidator {
        validateCommand(inputCommand) {
          return "implemented";
        }
      }

      const testValidator = new TestValidator();
      expect(testValidator).toBeInstanceOf(CommandValidator);
      expect(testValidator).toBeInstanceOf(TestValidator);
    });

    it("should allow subclass to override validateCommand", () => {
      class TestValidator extends CommandValidator {
        validateCommand(inputCommand) {
          if (!inputCommand || !inputCommand.command) {
            throw new Error("Invalid command");
          }
          return true;
        }
      }

      const testValidator = new TestValidator();
      const validCommand = {
        command: "TEST",
        token: ["arg1"],
      };

      expect(() => testValidator.validateCommand(validCommand)).not.toThrow();
      expect(testValidator.validateCommand(validCommand)).toBe(true);
    });

    it("should allow subclass to throw custom errors", () => {
      class TestValidator extends CommandValidator {
        validateCommand(inputCommand) {
          throw new Error("Custom validation error");
        }
      }

      const testValidator = new TestValidator();
      const inputCommand = {
        command: "TEST",
        token: [],
      };

      expect(() => testValidator.validateCommand(inputCommand)).toThrow(
        "Custom validation error"
      );
    });

    it("should maintain method signature in subclass", () => {
      class TestValidator extends CommandValidator {
        validateCommand(inputCommand) {
          // Verify the method receives the parameter
          expect(inputCommand).toBeDefined();
          return "received parameter";
        }
      }

      const testValidator = new TestValidator();
      const inputCommand = {
        command: "TEST",
        token: ["test"],
      };

      const result = testValidator.validateCommand(inputCommand);
      expect(result).toBe("received parameter");
    });
  });

  describe("interface contract", () => {
    it("should have validateCommand method defined", () => {
      expect(typeof validator.validateCommand).toBe("function");
    });

    it("should enforce implementation in concrete classes", () => {
      // This test verifies that the base class forces implementation
      class IncompleteValidator extends CommandValidator {
        // Intentionally not implementing validateCommand
      }

      const incompleteValidator = new IncompleteValidator();
      const inputCommand = {
        command: "TEST",
        token: [],
      };

      expect(() => incompleteValidator.validateCommand(inputCommand)).toThrow(
        "validateCommand method must be implemented by subclass"
      );
    });

    it("should accept InputCommand type structure", () => {
      // This test documents the expected input structure
      const validInputCommand = {
        command: "SAMPLE_COMMAND",
        token: ["arg1", "arg2", "arg3"],
      };

      // Even with valid structure, base class should throw
      expect(() => validator.validateCommand(validInputCommand)).toThrow(
        "validateCommand method must be implemented by subclass"
      );
    });
  });

  describe("error handling", () => {
    it("should throw Error instance", () => {
      const inputCommand = {
        command: "TEST",
        token: [],
      };

      try {
        validator.validateCommand(inputCommand);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(
          "validateCommand method must be implemented by subclass"
        );
      }
    });

    it("should have consistent error message", () => {
      const commands = [
        { command: "BALANCE", token: ["CARD001", "100"] },
        { command: "CHECK_IN", token: ["CARD001", "ADULT", "AIRPORT"] },
        { command: "PRINT_SUMMARY", token: [] },
      ];

      commands.forEach((inputCommand) => {
        expect(() => validator.validateCommand(inputCommand)).toThrow(
          "validateCommand method must be implemented by subclass"
        );
      });
    });
  });

  describe("method behavior", () => {
    it("should not modify input parameters", () => {
      const inputCommand = {
        command: "TEST",
        token: ["original"],
      };

      const originalCommand = inputCommand.command;
      const originalToken = [...inputCommand.token];

      try {
        validator.validateCommand(inputCommand);
      } catch (error) {
        // Verify input wasn't modified
        expect(inputCommand.command).toBe(originalCommand);
        expect(inputCommand.token).toEqual(originalToken);
      }
    });

    it("should handle method call with no parameters", () => {
      expect(() => validator.validateCommand()).toThrow(
        "validateCommand method must be implemented by subclass"
      );
    });

    it("should handle method call with extra parameters", () => {
      const inputCommand = {
        command: "TEST",
        token: [],
      };

      expect(() =>
        validator.validateCommand(inputCommand, "extra", "params")
      ).toThrow("validateCommand method must be implemented by subclass");
    });
  });
});
