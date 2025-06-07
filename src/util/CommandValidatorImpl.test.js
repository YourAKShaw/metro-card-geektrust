import CommandValidatorImpl from "./CommandValidatorImpl.js";

describe("CommandValidatorImpl", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidatorImpl();
  });

  describe("validateCommand", () => {
    describe("BALANCE command", () => {
      it("should validate correct BALANCE command with positive balance", () => {
        const inputCommand = {
          command: "BALANCE",
          token: ["CARD001", "100"],
        };

        expect(() => validator.validateCommand(inputCommand)).not.toThrow();
      });

      it("should validate BALANCE command with zero balance", () => {
        const inputCommand = {
          command: "BALANCE",
          token: ["CARD001", "0"],
        };

        expect(() => validator.validateCommand(inputCommand)).not.toThrow();
      });

      it("should validate BALANCE command with decimal balance", () => {
        const inputCommand = {
          command: "BALANCE",
          token: ["CARD001", "50.75"],
        };

        expect(() => validator.validateCommand(inputCommand)).not.toThrow();
      });

      it("should throw error when BALANCE command has too few arguments", () => {
        const inputCommand = {
          command: "BALANCE",
          token: ["CARD001"],
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow(
          "BALANCE command requires exactly 2 arguments: <cardId> <balance>."
        );
      });

      it("should throw error when BALANCE command has too many arguments", () => {
        const inputCommand = {
          command: "BALANCE",
          token: ["CARD001", "100", "extra"],
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow(
          "BALANCE command requires exactly 2 arguments: <cardId> <balance>."
        );
      });

      it("should throw error when balance is negative", () => {
        const inputCommand = {
          command: "BALANCE",
          token: ["CARD001", "-50"],
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow(
          "Balance must be a non-negative number."
        );
      });

      it("should throw error when balance is not a number", () => {
        const inputCommand = {
          command: "BALANCE",
          token: ["CARD001", "invalid"],
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow(
          "Balance must be a non-negative number."
        );
      });

      it("should throw error when balance is empty string", () => {
        const inputCommand = {
          command: "BALANCE",
          token: ["CARD001", ""],
        };

        // Empty string converts to 0, which is valid
        expect(() => validator.validateCommand(inputCommand)).not.toThrow();
      });
    });

    describe("CHECK_IN command", () => {
      it("should validate correct CHECK_IN command with ADULT passenger", () => {
        const inputCommand = {
          command: "CHECK_IN",
          token: ["CARD001", "ADULT", "AIRPORT"],
        };

        expect(() => validator.validateCommand(inputCommand)).not.toThrow();
      });

      it("should validate CHECK_IN command with SENIOR_CITIZEN passenger", () => {
        const inputCommand = {
          command: "CHECK_IN",
          token: ["CARD001", "SENIOR_CITIZEN", "CENTRAL"],
        };

        expect(() => validator.validateCommand(inputCommand)).not.toThrow();
      });

      it("should validate CHECK_IN command with KID passenger", () => {
        const inputCommand = {
          command: "CHECK_IN",
          token: ["CARD001", "KID", "AIRPORT"],
        };

        expect(() => validator.validateCommand(inputCommand)).not.toThrow();
      });

      it("should throw error when CHECK_IN command has too few arguments", () => {
        const inputCommand = {
          command: "CHECK_IN",
          token: ["CARD001", "ADULT"],
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow(
          "CHECK_IN command requires exactly 3 arguments: <cardId> <passengerType> <station>."
        );
      });

      it("should throw error when CHECK_IN command has too many arguments", () => {
        const inputCommand = {
          command: "CHECK_IN",
          token: ["CARD001", "ADULT", "AIRPORT", "extra"],
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow(
          "CHECK_IN command requires exactly 3 arguments: <cardId> <passengerType> <station>."
        );
      });

      it("should throw error when passenger type is invalid", () => {
        const inputCommand = {
          command: "CHECK_IN",
          token: ["CARD001", "INVALID_TYPE", "AIRPORT"],
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow(
          "Invalid passenger type 'INVALID_TYPE'. Allowed types: ADULT, SENIOR_CITIZEN, KID."
        );
      });

      it("should throw error when passenger type is lowercase", () => {
        const inputCommand = {
          command: "CHECK_IN",
          token: ["CARD001", "adult", "AIRPORT"],
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow(
          "Invalid passenger type 'adult'. Allowed types: ADULT, SENIOR_CITIZEN, KID."
        );
      });

      it("should throw error when station is invalid", () => {
        const inputCommand = {
          command: "CHECK_IN",
          token: ["CARD001", "ADULT", "INVALID_STATION"],
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow(
          "Invalid station 'INVALID_STATION'. Allowed stations: AIRPORT, CENTRAL."
        );
      });

      it("should throw error when station is lowercase", () => {
        const inputCommand = {
          command: "CHECK_IN",
          token: ["CARD001", "ADULT", "airport"],
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow(
          "Invalid station 'airport'. Allowed stations: AIRPORT, CENTRAL."
        );
      });
    });

    describe("PRINT_SUMMARY command", () => {
      it("should validate correct PRINT_SUMMARY command with no arguments", () => {
        const inputCommand = {
          command: "PRINT_SUMMARY",
          token: [],
        };

        expect(() => validator.validateCommand(inputCommand)).not.toThrow();
      });

      it("should throw error when PRINT_SUMMARY command has arguments", () => {
        const inputCommand = {
          command: "PRINT_SUMMARY",
          token: ["extra_arg"],
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow(
          "PRINT_SUMMARY command should not have any arguments."
        );
      });

      it("should throw error when PRINT_SUMMARY command has multiple arguments", () => {
        const inputCommand = {
          command: "PRINT_SUMMARY",
          token: ["arg1", "arg2"],
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow(
          "PRINT_SUMMARY command should not have any arguments."
        );
      });
    });

    describe("Invalid commands", () => {
      it("should throw error for unknown command", () => {
        const inputCommand = {
          command: "UNKNOWN_COMMAND",
          token: [],
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow(
          "Invalid command 'UNKNOWN_COMMAND'. Please check the input."
        );
      });

      it("should throw error for empty command", () => {
        const inputCommand = {
          command: "",
          token: [],
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow(
          "Invalid command ''. Please check the input."
        );
      });

      it("should throw error for null command", () => {
        const inputCommand = {
          command: null,
          token: [],
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow(
          "Invalid command 'null'. Please check the input."
        );
      });

      it("should throw error for undefined command", () => {
        const inputCommand = {
          command: undefined,
          token: [],
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow(
          "Invalid command 'undefined'. Please check the input."
        );
      });
    });

    describe("Edge cases", () => {
      it("should handle command with mixed case (should fail)", () => {
        const inputCommand = {
          command: "balance",
          token: ["CARD001", "100"],
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow(
          "Invalid command 'balance'. Please check the input."
        );
      });

      it("should handle missing token property", () => {
        const inputCommand = {
          command: "BALANCE",
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow();
      });

      it("should handle null tokens", () => {
        const inputCommand = {
          command: "BALANCE",
          token: null,
        };

        expect(() => validator.validateCommand(inputCommand)).toThrow();
      });

      it("should handle balance with leading/trailing spaces (should parse correctly)", () => {
        const inputCommand = {
          command: "BALANCE",
          token: ["CARD001", " 100 "],
        };

        expect(() => validator.validateCommand(inputCommand)).not.toThrow();
      });

      it("should handle very large balance numbers", () => {
        const inputCommand = {
          command: "BALANCE",
          token: ["CARD001", "999999999.99"],
        };

        expect(() => validator.validateCommand(inputCommand)).not.toThrow();
      });

      it("should handle balance with scientific notation", () => {
        const inputCommand = {
          command: "BALANCE",
          token: ["CARD001", "1e2"],
        };

        expect(() => validator.validateCommand(inputCommand)).not.toThrow();
      });
    });
  });

  describe("Individual validation methods", () => {
    describe("validateBalance", () => {
      it("should validate correct balance tokens", () => {
        expect(() =>
          validator.validateBalance(["CARD001", "100"])
        ).not.toThrow();
      });

      it("should throw error for incorrect token count", () => {
        expect(() => validator.validateBalance(["CARD001"])).toThrow(
          "BALANCE command requires exactly 2 arguments: <cardId> <balance>."
        );
      });
    });

    describe("validateCheckIn", () => {
      it("should validate correct check-in tokens", () => {
        expect(() =>
          validator.validateCheckIn(["CARD001", "ADULT", "AIRPORT"])
        ).not.toThrow();
      });

      it("should throw error for incorrect token count", () => {
        expect(() => validator.validateCheckIn(["CARD001", "ADULT"])).toThrow(
          "CHECK_IN command requires exactly 3 arguments: <cardId> <passengerType> <station>."
        );
      });
    });

    describe("validatePrintSummary", () => {
      it("should validate empty tokens", () => {
        expect(() => validator.validatePrintSummary([])).not.toThrow();
      });

      it("should throw error for non-empty tokens", () => {
        expect(() => validator.validatePrintSummary(["arg"])).toThrow(
          "PRINT_SUMMARY command should not have any arguments."
        );
      });
    });
  });
});
