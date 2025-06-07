import Summary from "./Summary.js";

describe("Summary", () => {
  it("should initialize with default values", () => {
    const summary = new Summary();
    expect(summary.getTotalAmountAirport()).toBe(0);
    expect(summary.getTotalAmountCentral()).toBe(0);
    expect(summary.getTotalDiscountAirport()).toBe(0);
    expect(summary.getTotalDiscountCentral()).toBe(0);
    expect(summary.getPassengerMap()).toBeInstanceOf(Map);
    expect(summary.getCheckInList()).toEqual([]);
    expect(summary.getOrderByTypeAirport()).toEqual([]);
    expect(summary.getOrderByTypeCentral()).toEqual([]);
  });

  it("should set and get total amount for Airport", () => {
    const summary = new Summary();
    summary.setTotalAmountAirport(1500);
    expect(summary.getTotalAmountAirport()).toBe(1500);
  });

  it("should set and get total amount for Central", () => {
    const summary = new Summary();
    summary.setTotalAmountCentral(2200);
    expect(summary.getTotalAmountCentral()).toBe(2200);
  });

  it("should set and get total discount for Airport", () => {
    const summary = new Summary();
    summary.setTotalDiscountAirport(100);
    expect(summary.getTotalDiscountAirport()).toBe(100);
  });

  it("should set and get total discount for Central", () => {
    const summary = new Summary();
    summary.setTotalDiscountCentral(250);
    expect(summary.getTotalDiscountCentral()).toBe(250);
  });

  it("should set and get passengerMap", () => {
    const summary = new Summary();
    const map = new Map([["MC1", { name: "John" }]]);
    summary.setPassengerMap(map);
    expect(summary.getPassengerMap()).toEqual(map);
  });

  it("should set and get checkInList", () => {
    const summary = new Summary();
    const checkInList = [{ card: "MC1", station: "AIRPORT" }];
    summary.setCheckInList(checkInList);
    expect(summary.getCheckInList()).toEqual(checkInList);
  });

  it("should set and get orderByTypeAirport", () => {
    const summary = new Summary();
    summary.setOrderByTypeAirport(["ADULT", "KID"]);
    expect(summary.getOrderByTypeAirport()).toEqual(["ADULT", "KID"]);
  });

  it("should set and get orderByTypeCentral", () => {
    const summary = new Summary();
    summary.setOrderByTypeCentral(["SENIOR_CITIZEN", "KID"]);
    expect(summary.getOrderByTypeCentral()).toEqual(["SENIOR_CITIZEN", "KID"]);
  });
});
