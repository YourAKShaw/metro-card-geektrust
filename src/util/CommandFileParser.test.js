import MetroCardServiceImpl from "../service/MetroCardServiceImpl.js";

describe("MetroCardServiceImpl", () => {
  let service;

  beforeEach(() => {
    service = new MetroCardServiceImpl();
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

      // Assuming CENTRAL fare for ADULT is 200 (this should match implementation)
      expect(
        service.summary.passengerMap.get("MC1").balanceInTheMetroCard
      ).toBe(400);
      expect(output).toContain("TOTAL_COLLECTION CENTRAL 200 0");
      expect(output).toContain("ADULT 1");
    });

    it("applies 50% discount on second journey for same passenger", () => {
      const commands = [
        { command: "BALANCE", token: ["MC1", "600"] },
        { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] }, // First journey: full fare
        { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] }, // Second journey: 50% discount
        { command: "PRINT_SUMMARY", token: [] },
      ];
      const output = service.executeCommands(commands);

      // First journey: 200, Second journey: 100 (with 50% discount)
      // Total collected: 300, Total discount: 100
      expect(
        service.summary.passengerMap.get("MC1").balanceInTheMetroCard
      ).toBe(300);
      expect(output).toContain("TOTAL_COLLECTION CENTRAL 300 100");
      expect(output).toContain("ADULT 2");
    });

    it("handles different passenger types with correct fares", () => {
      const commands = [
        { command: "BALANCE", token: ["MC1", "600"] },
        { command: "BALANCE", token: ["MC2", "300"] },
        { command: "BALANCE", token: ["MC3", "200"] },
        { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] }, // Assuming 200
        { command: "CHECK_IN", token: ["MC2", "SENIOR_CITIZEN", "CENTRAL"] }, // Assuming 100
        { command: "CHECK_IN", token: ["MC3", "KID", "CENTRAL"] }, // Assuming 50
        { command: "PRINT_SUMMARY", token: [] },
      ];
      const output = service.executeCommands(commands);

      expect(
        service.summary.passengerMap.get("MC1").balanceInTheMetroCard
      ).toBe(400);
      expect(
        service.summary.passengerMap.get("MC2").balanceInTheMetroCard
      ).toBe(200);
      expect(
        service.summary.passengerMap.get("MC3").balanceInTheMetroCard
      ).toBe(150);
      expect(output).toContain("TOTAL_COLLECTION CENTRAL 350 0");
      expect(output).toContain("ADULT 1");
      expect(output).toContain("SENIOR_CITIZEN 1");
      expect(output).toContain("KID 1");
    });

    it("handles insufficient balance with correct service fee calculation", () => {
      const commands = [
        { command: "BALANCE", token: ["MC1", "150"] }, // Balance: 150, Adult fare: 200
        { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] },
        { command: "PRINT_SUMMARY", token: [] },
      ];
      const output = service.executeCommands(commands);

      // Balance: 150, Required: 200, Shortfall: 50
      // Service fee: Math.ceil(0.02 * 50) = Math.ceil(1) = 1
      // Total amount charged: 150 (existing) + 50 (shortfall) + 1 (service fee) = 201
      expect(
        service.summary.passengerMap.get("MC1").balanceInTheMetroCard
      ).toBe(0);
      expect(output).toContain("TOTAL_COLLECTION CENTRAL 201 0");
      expect(output).toContain("ADULT 1");
    });

    it("handles multiple check-ins at different stations", () => {
      const commands = [
        { command: "BALANCE", token: ["MC1", "600"] },
        { command: "BALANCE", token: ["MC2", "300"] },
        { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] }, // 200
        { command: "CHECK_IN", token: ["MC2", "KID", "AIRPORT"] }, // Assuming 50 for KID at AIRPORT
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

      // Should show 0 collections for all stations even with no transactions
      expect(output).toContain("TOTAL_COLLECTION CENTRAL 0 0");
      expect(output).toContain("TOTAL_COLLECTION AIRPORT 0 0");
      // Should not contain any passenger type summaries since no journeys were made
      expect(output).not.toContain("ADULT");
      expect(output).not.toContain("KID");
      expect(output).not.toContain("SENIOR_CITIZEN");
    });

    it("sorts passenger types by highest total collection amount", () => {
      const commands = [
        { command: "BALANCE", token: ["MC1", "1000"] },
        { command: "BALANCE", token: ["MC2", "1000"] },
        { command: "BALANCE", token: ["MC3", "1000"] },
        { command: "CHECK_IN", token: ["MC1", "KID", "CENTRAL"] }, // 50
        { command: "CHECK_IN", token: ["MC2", "ADULT", "CENTRAL"] }, // 200
        { command: "CHECK_IN", token: ["MC3", "SENIOR_CITIZEN", "CENTRAL"] }, // 100
        { command: "PRINT_SUMMARY", token: [] },
      ];
      const output = service.executeCommands(commands);

      // Should be sorted by total charge: ADULT (200) > SENIOR_CITIZEN (100) > KID (50)
      const lines = output
        .split("\n")
        .filter(
          (line) =>
            line.includes("ADULT") ||
            line.includes("SENIOR_CITIZEN") ||
            line.includes("KID")
        );

      // Find the order of passenger types in the output
      const adultIndex = lines.findIndex((line) => line.includes("ADULT"));
      const seniorIndex = lines.findIndex((line) =>
        line.includes("SENIOR_CITIZEN")
      );
      const kidIndex = lines.findIndex((line) => line.includes("KID"));

      // ADULT should come before SENIOR_CITIZEN, which should come before KID
      expect(adultIndex).toBeLessThan(seniorIndex);
      expect(seniorIndex).toBeLessThan(kidIndex);
    });

    it("handles multiple passengers of same type correctly", () => {
      const commands = [
        { command: "BALANCE", token: ["MC1", "1000"] },
        { command: "BALANCE", token: ["MC2", "1000"] },
        { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] }, // 200
        { command: "CHECK_IN", token: ["MC2", "ADULT", "CENTRAL"] }, // 200
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
        /metro.*card.*not.*registered/i
      );
    });

    it("handles discount correctly for multiple journeys by same passenger", () => {
      const commands = [
        { command: "BALANCE", token: ["MC1", "1000"] },
        { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] }, // 200 (no discount)
        { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] }, // 100 (50% discount)
        { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] }, // 200 (no discount - 3rd journey)
        { command: "PRINT_SUMMARY", token: [] },
      ];
      const output = service.executeCommands(commands);

      // Total collection: 200 + 100 + 200 = 500
      // Total discount: 100 (only on 2nd journey)
      expect(output).toContain("TOTAL_COLLECTION CENTRAL 500 100");
      expect(output).toContain("ADULT 3");
    });

    it("handles mixed passenger types with discounts", () => {
      const commands = [
        { command: "BALANCE", token: ["MC1", "1000"] },
        { command: "BALANCE", token: ["MC2", "1000"] },
        { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] }, // 200
        { command: "CHECK_IN", token: ["MC2", "KID", "CENTRAL"] }, // 50
        { command: "CHECK_IN", token: ["MC1", "ADULT", "CENTRAL"] }, // 100 (discount)
        { command: "CHECK_IN", token: ["MC2", "KID", "CENTRAL"] }, // 25 (discount)
        { command: "PRINT_SUMMARY", token: [] },
      ];
      const output = service.executeCommands(commands);

      // Total: 200 + 50 + 100 + 25 = 375
      // Discount: 100 + 25 = 125
      expect(output).toContain("TOTAL_COLLECTION CENTRAL 375 125");
      expect(output).toContain("ADULT 2");
      expect(output).toContain("KID 2");
    });
  });

  describe("initializeBalance", () => {
    it("creates passenger with correct initial state", () => {
      const passenger = service.initializeBalance(["MC1", "500"]);

      expect(passenger.id).toBe("MC1");
      expect(passenger.balanceInTheMetroCard).toBe(500);
      expect(passenger.journeyCount).toBe(0);
      expect(service.summary.passengerMap.get("MC1")).toBe(passenger);
    });

    it("handles string balance conversion correctly", () => {
      const passenger = service.initializeBalance(["MC2", "750"]);
      expect(passenger.balanceInTheMetroCard).toBe(750);
      expect(typeof passenger.balanceInTheMetroCard).toBe("number");
    });
  });

  describe("updateBalance", () => {
    beforeEach(() => {
      service.initializeBalance(["MC1", "500"]);
    });

    it("deducts fare from balance correctly on first journey", () => {
      const journeyCharge = service.updateBalance("MC1", 200);

      expect(journeyCharge.discount).toBe(0);
      expect(journeyCharge.costOfJourney).toBe(200);
      expect(
        service.summary.passengerMap.get("MC1").balanceInTheMetroCard
      ).toBe(300);
      expect(service.summary.passengerMap.get("MC1").journeyCount).toBe(1);
    });

    it("applies 50% discount on second journey only", () => {
      // First journey - no discount
      service.updateBalance("MC1", 200);

      // Second journey - 50% discount
      const secondJourneyCharge = service.updateBalance("MC1", 200);

      expect(secondJourneyCharge.discount).toBe(100); // 50% of 200
      expect(secondJourneyCharge.costOfJourney).toBe(100);
      expect(service.summary.passengerMap.get("MC1").journeyCount).toBe(2);
      expect(
        service.summary.passengerMap.get("MC1").balanceInTheMetroCard
      ).toBe(200); // 500 - 200 - 100
    });

    it("does not apply discount on third journey", () => {
      // First journey
      service.updateBalance("MC1", 100);
      // Second journey with discount
      service.updateBalance("MC1", 100);
      // Third journey - no discount
      const thirdJourneyCharge = service.updateBalance("MC1", 100);

      expect(thirdJourneyCharge.discount).toBe(0);
      expect(thirdJourneyCharge.costOfJourney).toBe(100);
      expect(service.summary.passengerMap.get("MC1").journeyCount).toBe(3);
    });

    it("handles insufficient balance with correct service fee", () => {
      // Set lower balance
      service.summary.passengerMap.get("MC1").balanceInTheMetroCard = 150;

      const journeyCharge = service.updateBalance("MC1", 200); // Need 200, have 150

      // Shortfall: 50, Service fee: Math.ceil(0.02 * 50) = 1
      // Total cost: 150 (existing) + 50 (shortfall) + 1 (fee) = 201
      expect(journeyCharge.discount).toBe(0);
      expect(journeyCharge.costOfJourney).toBe(201);
      expect(
        service.summary.passengerMap.get("MC1").balanceInTheMetroCard
      ).toBe(0);
    });

    it("handles insufficient balance with discount applied", () => {
      // Set up for second journey (discount applicable)
      service.updateBalance("MC1", 100); // First journey
      service.summary.passengerMap.get("MC1").balanceInTheMetroCard = 80;

      const journeyCharge = service.updateBalance("MC1", 200); // Second journey with discount

      // Discounted fare: 100, Current balance: 80, Shortfall: 20
      // Service fee: Math.ceil(0.02 * 20) = 1
      // Total cost: 80 + 20 + 1 = 101
      expect(journeyCharge.discount).toBe(100); // Discount still applies
      expect(journeyCharge.costOfJourney).toBe(101);
      expect(
        service.summary.passengerMap.get("MC1").balanceInTheMetroCard
      ).toBe(0);
    });
  });
});
