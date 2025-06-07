import MetroCardService from "./MetroCardService.js";

describe("MetroCardService", () => {
  let service;

  beforeEach(() => {
    service = new MetroCardService();
  });

  describe("constructor", () => {
    it("should create an instance of MetroCardService", () => {
      expect(service).toBeInstanceOf(MetroCardService);
    });

    it("should be a function/class", () => {
      expect(typeof MetroCardService).toBe("function");
    });
  });

  describe("executeCommands method", () => {
    it("should throw error when executeCommands is called directly", () => {
      const commands = [
        { command: "BALANCE", token: ["CARD001", "100"] },
        { command: "CHECK_IN", token: ["CARD001", "ADULT", "AIRPORT"] },
      ];

      expect(() => service.executeCommands(commands)).toThrow(
        "Method executeCommands() must be implemented."
      );
    });

    it("should throw error with empty array", () => {
      expect(() => service.executeCommands([])).toThrow(
        "Method executeCommands() must be implemented."
      );
    });

    it("should throw error with null input", () => {
      expect(() => service.executeCommands(null)).toThrow(
        "Method executeCommands() must be implemented."
      );
    });

    it("should throw error with undefined input", () => {
      expect(() => service.executeCommands(undefined)).toThrow(
        "Method executeCommands() must be implemented."
      );
    });

    it("should throw error with no parameters", () => {
      expect(() => service.executeCommands()).toThrow(
        "Method executeCommands() must be implemented."
      );
    });

    it("should throw error with single command object", () => {
      const command = { command: "BALANCE", token: ["CARD001", "100"] };

      expect(() => service.executeCommands([command])).toThrow(
        "Method executeCommands() must be implemented."
      );
    });

    it("should throw error with multiple command objects", () => {
      const commands = [
        { command: "BALANCE", token: ["CARD001", "100"] },
        { command: "CHECK_IN", token: ["CARD001", "ADULT", "AIRPORT"] },
        { command: "PRINT_SUMMARY", token: [] },
      ];

      expect(() => service.executeCommands(commands)).toThrow(
        "Method executeCommands() must be implemented."
      );
    });
  });

  describe("initializeBalance method", () => {
    it("should throw error when initializeBalance is called directly", () => {
      const tokens = ["CARD001", "100"];

      expect(() => service.initializeBalance(tokens)).toThrow(
        "Method initializeBalance() must be implemented."
      );
    });

    it("should throw error with empty tokens", () => {
      expect(() => service.initializeBalance([])).toThrow(
        "Method initializeBalance() must be implemented."
      );
    });

    it("should throw error with null tokens", () => {
      expect(() => service.initializeBalance(null)).toThrow(
        "Method initializeBalance() must be implemented."
      );
    });

    it("should throw error with undefined tokens", () => {
      expect(() => service.initializeBalance(undefined)).toThrow(
        "Method initializeBalance() must be implemented."
      );
    });

    it("should throw error with no parameters", () => {
      expect(() => service.initializeBalance()).toThrow(
        "Method initializeBalance() must be implemented."
      );
    });

    it("should throw error with valid balance tokens", () => {
      const tokens = ["CARD001", "250.50"];

      expect(() => service.initializeBalance(tokens)).toThrow(
        "Method initializeBalance() must be implemented."
      );
    });

    it("should throw error with multiple card tokens", () => {
      const tokens = ["CARD001", "100", "CARD002", "200"];

      expect(() => service.initializeBalance(tokens)).toThrow(
        "Method initializeBalance() must be implemented."
      );
    });
  });

  describe("processCheckIn method", () => {
    it("should throw error when processCheckIn is called directly", () => {
      const tokens = ["CARD001", "ADULT", "AIRPORT"];

      expect(() => service.processCheckIn(tokens)).toThrow(
        "Method processCheckIn() must be implemented."
      );
    });

    it("should throw error with empty tokens", () => {
      expect(() => service.processCheckIn([])).toThrow(
        "Method processCheckIn() must be implemented."
      );
    });

    it("should throw error with null tokens", () => {
      expect(() => service.processCheckIn(null)).toThrow(
        "Method processCheckIn() must be implemented."
      );
    });

    it("should throw error with undefined tokens", () => {
      expect(() => service.processCheckIn(undefined)).toThrow(
        "Method processCheckIn() must be implemented."
      );
    });

    it("should throw error with no parameters", () => {
      expect(() => service.processCheckIn()).toThrow(
        "Method processCheckIn() must be implemented."
      );
    });

    it("should throw error with valid check-in tokens", () => {
      const tokens = ["CARD001", "SENIOR_CITIZEN", "CENTRAL"];

      expect(() => service.processCheckIn(tokens)).toThrow(
        "Method processCheckIn() must be implemented."
      );
    });

    it("should throw error with kid passenger tokens", () => {
      const tokens = ["CARD002", "KID", "AIRPORT"];

      expect(() => service.processCheckIn(tokens)).toThrow(
        "Method processCheckIn() must be implemented."
      );
    });
  });

  describe("printSummary method", () => {
    it("should throw error when printSummary is called directly", () => {
      expect(() => service.printSummary()).toThrow(
        "Method printSummary() must be implemented."
      );
    });

    it("should throw error with parameters (should not accept any)", () => {
      expect(() => service.printSummary("extra", "params")).toThrow(
        "Method printSummary() must be implemented."
      );
    });
  });

  describe("inheritance behavior", () => {
    it("should be extendable by subclasses", () => {
      class TestMetroCardService extends MetroCardService {
        executeCommands(commands) {
          return "executed";
        }

        initializeBalance(tokens) {
          return { cardId: tokens[0], balance: parseFloat(tokens[1]) };
        }

        processCheckIn(tokens) {
          // void method
        }

        printSummary() {
          return "summary";
        }
      }

      const testService = new TestMetroCardService();
      expect(testService).toBeInstanceOf(MetroCardService);
      expect(testService).toBeInstanceOf(TestMetroCardService);
    });

    it("should allow subclass to override executeCommands", () => {
      class TestMetroCardService extends MetroCardService {
        executeCommands(commands) {
          return `Executed ${commands.length} commands`;
        }

        initializeBalance(tokens) {
          return {};
        }

        processCheckIn(tokens) {}

        printSummary() {
          return "";
        }
      }

      const testService = new TestMetroCardService();
      const commands = [
        { command: "BALANCE", token: ["CARD001", "100"] },
        { command: "CHECK_IN", token: ["CARD001", "ADULT", "AIRPORT"] },
      ];

      expect(() => testService.executeCommands(commands)).not.toThrow();
      expect(testService.executeCommands(commands)).toBe("Executed 2 commands");
    });

    it("should allow subclass to override initializeBalance", () => {
      class TestMetroCardService extends MetroCardService {
        executeCommands() {
          return "";
        }

        initializeBalance(tokens) {
          return {
            cardId: tokens[0],
            balance: parseFloat(tokens[1]),
            initialized: true,
          };
        }

        processCheckIn() {}
        printSummary() {
          return "";
        }
      }

      const testService = new TestMetroCardService();
      const tokens = ["CARD001", "150.75"];

      expect(() => testService.initializeBalance(tokens)).not.toThrow();
      const result = testService.initializeBalance(tokens);
      expect(result).toEqual({
        cardId: "CARD001",
        balance: 150.75,
        initialized: true,
      });
    });

    it("should allow subclass to override processCheckIn", () => {
      class TestMetroCardService extends MetroCardService {
        constructor() {
          super();
          this.checkIns = [];
        }

        executeCommands() {
          return "";
        }
        initializeBalance() {
          return {};
        }

        processCheckIn(tokens) {
          this.checkIns.push({
            cardId: tokens[0],
            passengerType: tokens[1],
            station: tokens[2],
          });
        }

        printSummary() {
          return "";
        }
      }

      const testService = new TestMetroCardService();
      const tokens = ["CARD001", "ADULT", "AIRPORT"];

      expect(() => testService.processCheckIn(tokens)).not.toThrow();
      expect(testService.checkIns).toHaveLength(1);
      expect(testService.checkIns[0]).toEqual({
        cardId: "CARD001",
        passengerType: "ADULT",
        station: "AIRPORT",
      });
    });

    it("should allow subclass to override printSummary", () => {
      class TestMetroCardService extends MetroCardService {
        executeCommands() {
          return "";
        }
        initializeBalance() {
          return {};
        }
        processCheckIn() {}

        printSummary() {
          return "Total collections: Rs. 100\nTotal discount given: Rs. 20";
        }
      }

      const testService = new TestMetroCardService();

      expect(() => testService.printSummary()).not.toThrow();
      expect(testService.printSummary()).toBe(
        "Total collections: Rs. 100\nTotal discount given: Rs. 20"
      );
    });
  });

  describe("interface contract", () => {
    it("should have all required methods defined", () => {
      expect(typeof service.executeCommands).toBe("function");
      expect(typeof service.initializeBalance).toBe("function");
      expect(typeof service.processCheckIn).toBe("function");
      expect(typeof service.printSummary).toBe("function");
    });

    it("should enforce implementation in concrete classes", () => {
      class IncompleteMetroCardService extends MetroCardService {
        executeCommands() {
          return "implemented";
        }
        // Missing other implementations
      }

      const incompleteService = new IncompleteMetroCardService();

      expect(() => incompleteService.executeCommands()).not.toThrow();
      expect(() =>
        incompleteService.initializeBalance(["CARD001", "100"])
      ).toThrow("Method initializeBalance() must be implemented.");
      expect(() =>
        incompleteService.processCheckIn(["CARD001", "ADULT", "AIRPORT"])
      ).toThrow("Method processCheckIn() must be implemented.");
      expect(() => incompleteService.printSummary()).toThrow(
        "Method printSummary() must be implemented."
      );
    });
  });

  describe("error handling", () => {
    it("should throw Error instances for all methods", () => {
      const methods = [
        { name: "executeCommands", args: [[]] },
        { name: "initializeBalance", args: [["CARD001", "100"]] },
        { name: "processCheckIn", args: [["CARD001", "ADULT", "AIRPORT"]] },
        { name: "printSummary", args: [] },
      ];

      methods.forEach(({ name, args }) => {
        try {
          service[name](...args);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toContain(
            `Method ${name}() must be implemented.`
          );
        }
      });
    });

    it("should have consistent error message format", () => {
      const expectedMessages = [
        "Method executeCommands() must be implemented.",
        "Method initializeBalance() must be implemented.",
        "Method processCheckIn() must be implemented.",
        "Method printSummary() must be implemented.",
      ];

      const methods = [
        {
          method: "executeCommands",
          args: [[]],
          expectedMsg: expectedMessages[0],
        },
        {
          method: "initializeBalance",
          args: [["CARD001", "100"]],
          expectedMsg: expectedMessages[1],
        },
        {
          method: "processCheckIn",
          args: [["CARD001", "ADULT", "AIRPORT"]],
          expectedMsg: expectedMessages[2],
        },
        { method: "printSummary", args: [], expectedMsg: expectedMessages[3] },
      ];

      methods.forEach(({ method, args, expectedMsg }) => {
        expect(() => service[method](...args)).toThrow(expectedMsg);
      });
    });
  });

  describe("method behavior", () => {
    it("should not modify input parameters", () => {
      const commands = [{ command: "BALANCE", token: ["CARD001", "100"] }];
      const tokens = ["CARD001", "100"];

      const originalCommands = JSON.parse(JSON.stringify(commands));
      const originalTokens = [...tokens];

      try {
        service.executeCommands(commands);
      } catch (error) {
        expect(commands).toEqual(originalCommands);
      }

      try {
        service.initializeBalance(tokens);
      } catch (error) {
        expect(tokens).toEqual(originalTokens);
      }
    });

    it("should handle method calls with extra parameters", () => {
      expect(() => service.executeCommands([], "extra", "params")).toThrow(
        "Method executeCommands() must be implemented."
      );

      expect(() =>
        service.initializeBalance(["CARD001", "100"], "extra")
      ).toThrow("Method initializeBalance() must be implemented.");

      expect(() =>
        service.processCheckIn(["CARD001", "ADULT", "AIRPORT"], "extra")
      ).toThrow("Method processCheckIn() must be implemented.");
    });
  });
});
