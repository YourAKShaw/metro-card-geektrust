const MetroCardServiceImpl = require("./MetroCardServiceImpl.js");

describe("MetroCardServiceImpl", () => {
  let service;

  beforeEach(() => {
    service = new MetroCardServiceImpl();
  });

  describe("executeCommands", () => {
    it("sets balance correctly", () => {
      const commands = ["BALANCE MC1 500"];
      const output = service.executeCommands(commands);
      expect(service.cards.get("MC1").balance).toBe(500);
      expect(output).toBe(""); // No output expected for just balance setup
    });

    it("checks in and deducts fare for ADULT at CENTRAL without discount", () => {
      const commands = [
        "BALANCE MC1 600",
        "CHECK_IN MC1 ADULT CENTRAL",
        "PRINT_SUMMARY",
      ];
      const output = service.executeCommands(commands);

      // Central fare: 200 adult no discount
      expect(service.cards.get("MC1").balance).toBe(400);
      expect(output).toContain("TOTAL_COLLECTION CENTRAL 200 0");
      expect(output).toContain("ADULT 1");
    });

    it("applies senior citizen discount correctly at CENTRAL", () => {
      const commands = [
        "BALANCE MC2 500",
        "CHECK_IN MC2 SENIOR_CITIZEN CENTRAL",
        "PRINT_SUMMARY",
      ];
      const output = service.executeCommands(commands);

      // Adult fare 200, senior discount 50%
      expect(service.cards.get("MC2").balance).toBe(400);
      expect(output).toContain("TOTAL_COLLECTION CENTRAL 100 100"); // discount 100
      expect(output).toContain("SENIOR_CITIZEN 1");
    });

    it("handles multiple check-ins at different stations with correct fare and discount", () => {
      const commands = [
        "BALANCE MC1 600",
        "BALANCE MC3 50",
        "CHECK_IN MC1 ADULT CENTRAL",
        "CHECK_IN MC3 KID AIRPORT",
        "PRINT_SUMMARY",
      ];
      const output = service.executeCommands(commands);

      // Central Adult: 200, Airport Kid: 53 (with 50% discount)
      expect(service.cards.get("MC1").balance).toBe(400);
      expect(service.cards.get("MC3").balance).toBe(24);
      expect(output).toContain("TOTAL_COLLECTION CENTRAL 200 0");
      expect(output).toContain("TOTAL_COLLECTION AIRPORT 53 53");
      expect(output).toContain("ADULT 1");
      expect(output).toContain("KID 1");
    });

    it("does not allow check-in if balance is insufficient", () => {
      const commands = [
        "BALANCE MC4 40",
        "CHECK_IN MC4 ADULT AIRPORT", // fare 106
        "PRINT_SUMMARY",
      ];
      const output = service.executeCommands(commands);

      // Balance remains unchanged, no fare collected
      expect(service.cards.get("MC4").balance).toBe(40);
      expect(output).toContain("TOTAL_COLLECTION AIRPORT 0 0");
      expect(output).not.toContain("ADULT");
    });

    it("prints summary correctly with no transactions", () => {
      const commands = ["BALANCE MC5 200", "PRINT_SUMMARY"];
      const output = service.executeCommands(commands);

      expect(output).toContain("TOTAL_COLLECTION CENTRAL 0 0");
      expect(output).toContain("TOTAL_COLLECTION AIRPORT 0 0");
    });

    it("throws error on invalid command format", () => {
      const commands = ["BALANCE MC1"];
      expect(() => service.executeCommands(commands)).toThrow();
    });

    it("handles multiple passengers of same type", () => {
      const commands = [
        "BALANCE MC1 1000",
        "CHECK_IN MC1 ADULT CENTRAL",
        "CHECK_IN MC1 ADULT CENTRAL",
        "PRINT_SUMMARY",
      ];
      const output = service.executeCommands(commands);

      expect(output).toContain("ADULT 2");
      expect(service.cards.get("MC1").balance).toBe(600);
    });
  });
});
