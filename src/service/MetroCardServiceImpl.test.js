import { jest } from "@jest/globals";

// Mock the validator to avoid validation issues during testing
jest.unstable_mockModule("../util/CommandValidatorImpl.js", () => ({
  default: jest.fn().mockImplementation(() => ({
    validateCommand: jest.fn(), // Mock method that does nothing
  })),
}));

// Import after mocking
const { default: MetroCardServiceImpl } = await import(
  "./MetroCardServiceImpl.js"
);

describe("MetroCardServiceImpl", () => {
  let service;

  beforeEach(() => {
    service = new MetroCardServiceImpl();
    jest.clearAllMocks();
  });

  describe("executeCommands", () => {
    it("sets balance correctly", () => {
      const commands = [{ command: "BALANCE", token: ["MC1", "500"] }];
      const output = service.executeCommands(commands);
      expect(
        service.summary.passengerMap.get("MC1").balanceInTheMetroCard
      ).toBe(500);
      expect(output).toBe(""); // No output expected for just balance setup
    });

    it("checks in and deducts fare for ADULT at CENTRAL", () => {
      const commands = [
        { command: "BALANCE", token: ["MC1", "600"] },
        { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] },
        { command: "PRINT_SUMMARY", token: [] },
      ];
      const output = service.executeCommands(commands);

      // Central fare: 200 for adult, no discount on first journey
      expect(
        service.summary.passengerMap.get("MC1").balanceInTheMetroCard
      ).toBe(400);
      expect(output).toContain("TOTAL_COLLECTION CENTRAL 200 0");
      expect(output).toContain("ADULT 1");
    });

    it("applies 50% discount on second journey", () => {
      const commands = [
        { command: "BALANCE", token: ["MC1", "600"] },
        { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] }, // First journey: 200
        { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] }, // Second journey: 100 (50% discount)
        { command: "PRINT_SUMMARY", token: [] },
      ];
      const output = service.executeCommands(commands);

      // First journey: 200, Second journey: 100 (with 50% discount)
      expect(
        service.summary.passengerMap.get("MC1").balanceInTheMetroCard
      ).toBe(300);
      expect(output).toContain("TOTAL_COLLECTION CENTRAL 300 100"); // Total: 300, Discount: 100
      expect(output).toContain("ADULT 2");
    });

    it("handles different passenger types correctly", () => {
      const commands = [
        { command: "BALANCE", token: ["MC1", "600"] },
        { command: "BALANCE", token: ["MC2", "200"] },
        { command: "BALANCE", token: ["MC3", "100"] },
        { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] }, // 200
        { command: "CHECK_IN", token: ["MC2", "SENIOR_CITIZEN", "CENTRAL"] }, // 100
        { command: "CHECK_IN", token: ["MC3", "KID", "CENTRAL"] }, // 50
        { command: "PRINT_SUMMARY", token: [] },
      ];
      const output = service.executeCommands(commands);

      expect(
        service.summary.passengerMap.get("MC1").balanceInTheMetroCard
      ).toBe(400);
      expect(
        service.summary.passengerMap.get("MC2").balanceInTheMetroCard
      ).toBe(100);
      expect(
        service.summary.passengerMap.get("MC3").balanceInTheMetroCard
      ).toBe(50);
      expect(output).toContain("TOTAL_COLLECTION CENTRAL 350 0");
      expect(output).toContain("ADULT 1");
      expect(output).toContain("SENIOR_CITIZEN 1");
      expect(output).toContain("KID 1");
    });

    it("handles insufficient balance with service fee", () => {
      const commands = [
        { command: "BALANCE", token: ["MC1", "50"] }, // Balance: 50, Adult fare: 200
        { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] },
        { command: "PRINT_SUMMARY", token: [] },
      ];
      const output = service.executeCommands(commands);

      // Insufficient balance: 50, Required: 200, Balance needed: 150
      // Service fee: ceil(0.02 * 150) = 3
      // Total collected: 50 + 150 + 3 = 203
      expect(
        service.summary.passengerMap.get("MC1").balanceInTheMetroCard
      ).toBe(0);
      expect(output).toContain("TOTAL_COLLECTION CENTRAL 203 0");
      expect(output).toContain("ADULT 1");
    });

    it("handles multiple check-ins at different stations", () => {
      const commands = [
        { command: "BALANCE", token: ["MC1", "600"] },
        { command: "BALANCE", token: ["MC2", "300"] },
        { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] },
        { command: "CHECK_IN", token: ["MC2", "KID", "AIRPORT"] },
        { command: "PRINT_SUMMARY", token: [] },
      ];
      const output = service.executeCommands(commands);

      expect(
        service.summary.passengerMap.get("MC1").balanceInTheMetroCard
      ).toBe(400);
      expect(
        service.summary.passengerMap.get("MC2").balanceInTheMetroCard
      ).toBe(250);
      expect(output).toContain("TOTAL_COLLECTION CENTRAL 200 0");
      expect(output).toContain("TOTAL_COLLECTION AIRPORT 50 0");
      expect(output).toContain("ADULT 1");
      expect(output).toContain("KID 1");
    });

    it("prints summary correctly with no transactions", () => {
      const commands = [
        { command: "BALANCE", token: ["MC1", "200"] },
        { command: "PRINT_SUMMARY", token: [] },
      ];
      const output = service.executeCommands(commands);

      expect(output).toContain("TOTAL_COLLECTION CENTRAL 0 0");
      expect(output).toContain("TOTAL_COLLECTION AIRPORT 0 0");
    });

    it("sorts passenger types by highest total charge", () => {
      const commands = [
        { command: "BALANCE", token: ["MC1", "1000"] },
        { command: "BALANCE", token: ["MC2", "1000"] },
        { command: "CHECK_IN", token: ["MC1", "KID", "CENTRAL"] }, // 50
        { command: "CHECK_IN", token: ["MC2", "ADULT", "CENTRAL"] }, // 200
        { command: "PRINT_SUMMARY", token: [] },
      ];
      const output = service.executeCommands(commands);

      // Should be sorted by total charge (ADULT: 200, KID: 50)
      const lines = output.split("\n");
      const adultIndex = lines.findIndex((line) => line.includes("ADULT"));
      const kidIndex = lines.findIndex((line) => line.includes("KID"));
      expect(adultIndex).toBeLessThan(kidIndex);
    });

    it("handles multiple passengers of same type", () => {
      const commands = [
        { command: "BALANCE", token: ["MC1", "1000"] },
        { command: "BALANCE", token: ["MC2", "1000"] },
        { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] },
        { command: "CHECK_IN", token: ["MC2", "ADULT", "CENTRAL"] },
        { command: "PRINT_SUMMARY", token: [] },
      ];
      const output = service.executeCommands(commands);

      expect(output).toContain("ADULT 2");
      expect(output).toContain("TOTAL_COLLECTION CENTRAL 400 0");
    });

    it("throws error for unregistered metro card", () => {
      const commands = [
        { command: "CHECK_IN", token: ["MC999", "ADULT", "CENTRAL"] },
      ];

      expect(() => service.executeCommands(commands)).toThrow(
        "Metrocard User Not Registered"
      );
    });
  });

  describe("initializeBalance", () => {
    it("creates passenger with correct balance", () => {
      const passenger = service.initializeBalance(["MC1", "500"]);

      expect(passenger.id).toBe("MC1");
      expect(passenger.balanceInTheMetroCard).toBe(500);
      expect(passenger.journeyCount).toBe(0);
      expect(service.summary.passengerMap.get("MC1")).toBe(passenger);
    });
  });

  describe("updateBalance", () => {
    beforeEach(() => {
      service.initializeBalance(["MC1", "300"]);
    });

    it("deducts fare from balance correctly", () => {
      const journeyCharge = service.updateBalance("MC1", 200);

      expect(journeyCharge.discount).toBe(0);
      expect(journeyCharge.costOfJourney).toBe(200);
      expect(
        service.summary.passengerMap.get("MC1").balanceInTheMetroCard
      ).toBe(100);
      expect(service.summary.passengerMap.get("MC1").journeyCount).toBe(1);
    });

    it("applies 50% discount on second journey", () => {
      // First journey
      service.updateBalance("MC1", 200);
      // Second journey
      const journeyCharge = service.updateBalance("MC1", 200);

      expect(journeyCharge.discount).toBe(100); // 50% of 200
      expect(journeyCharge.costOfJourney).toBe(100);
      expect(
        service.summary.passengerMap.get("MC1").balanceInTheMetroCard
      ).toBe(0);
      expect(service.summary.passengerMap.get("MC1").journeyCount).toBe(2);
    });

    it("handles insufficient balance with service fee", () => {
      const journeyCharge = service.updateBalance("MC1", 500); // Balance: 300, Fare: 500

      // Balance required: 200, Service fee: ceil(0.02 * 200) = 4
      // Total collected: 300 + 200 + 4 = 504
      expect(journeyCharge.discount).toBe(0);
      expect(journeyCharge.costOfJourney).toBe(504);
      expect(
        service.summary.passengerMap.get("MC1").balanceInTheMetroCard
      ).toBe(0);
    });
  });
});
