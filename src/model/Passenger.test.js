import Passenger from "./Passenger.js";

describe("Passenger", () => {
  it("should create an instance with metro card number and initial balance", () => {
    const passenger = new Passenger("MC1", 500);
    expect(passenger.getMetroCardNumber()).toBe("MC1");
    expect(passenger.getBalanceInTheMetroCard()).toBe(500);
    expect(passenger.getJourneyCount()).toBe(0);
  });

  it("should set and get journey count", () => {
    const passenger = new Passenger("MC2", 100);
    passenger.setJourneyCount(3);
    expect(passenger.getJourneyCount()).toBe(3);
  });

  it("should set and get metro card number", () => {
    const passenger = new Passenger("MC3", 200);
    passenger.setMetroCardNumber("MC4");
    expect(passenger.getMetroCardNumber()).toBe("MC4");
  });

  it("should set and get balance in the metro card", () => {
    const passenger = new Passenger("MC5", 300);
    passenger.setBalanceInTheMetroCard(150);
    expect(passenger.getBalanceInTheMetroCard()).toBe(150);
  });

  it("should handle zero and negative values", () => {
    const passenger = new Passenger("MC6", 0);
    expect(passenger.getBalanceInTheMetroCard()).toBe(0);
    passenger.setBalanceInTheMetroCard(-100);
    expect(passenger.getBalanceInTheMetroCard()).toBe(-100);

    passenger.setJourneyCount(-1);
    expect(passenger.getJourneyCount()).toBe(-1);
  });
});
