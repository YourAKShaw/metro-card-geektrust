import StationStatsSummary from "./StationStatsSummary.js";

describe("StationStatsSummary", () => {
  it("should initialize fields correctly with constructor", () => {
    const stats = new StationStatsSummary("ADULT");
    expect(stats.getPassengerType()).toBe("ADULT");
    expect(stats.getCount()).toBe(0);
    expect(stats.getTotalCharge()).toBe(0);
    expect(stats.getTotalDiscount()).toBe(0);
    expect(stats.getOrderByType()).toBeNull();
  });

  it("should set and get count", () => {
    const stats = new StationStatsSummary("KID");
    stats.setCount(5);
    expect(stats.getCount()).toBe(5);
  });

  it("should set and get passenger type", () => {
    const stats = new StationStatsSummary("SENIOR_CITIZEN");
    stats.setPassengerType("ADULT");
    expect(stats.getPassengerType()).toBe("ADULT");
  });

  it("should set and get total charge", () => {
    const stats = new StationStatsSummary("ADULT");
    stats.setTotalCharge(1000);
    expect(stats.getTotalCharge()).toBe(1000);
  });

  it("should set and get total discount", () => {
    const stats = new StationStatsSummary("KID");
    stats.setTotalDiscount(150);
    expect(stats.getTotalDiscount()).toBe(150);
  });

  it("should set and get order by type", () => {
    const stats = new StationStatsSummary("ADULT");
    stats.setOrderByType(2);
    expect(stats.getOrderByType()).toBe(2);
  });

  it("should check equality correctly (true case)", () => {
    const stats1 = new StationStatsSummary("ADULT");
    const stats2 = new StationStatsSummary("ADULT");
    stats1.setCount(3);
    stats2.setCount(3);
    stats1.setTotalCharge(500);
    stats2.setTotalCharge(500);
    stats1.setTotalDiscount(75);
    stats2.setTotalDiscount(75);
    expect(stats1.equals(stats2)).toBe(true);
  });

  it("should check equality correctly (false case)", () => {
    const stats1 = new StationStatsSummary("ADULT");
    const stats2 = new StationStatsSummary("KID");
    expect(stats1.equals(stats2)).toBe(false);

    stats2.setPassengerType("ADULT");
    stats2.setCount(1);
    expect(stats1.equals(stats2)).toBe(false);
  });

  it("should return false when compared with non-StationStatsSummary object", () => {
    const stats = new StationStatsSummary("ADULT");
    expect(stats.equals({})).toBe(false);
    expect(stats.equals(null)).toBe(false);
  });

  it("should return true when compared with itself", () => {
    const stats = new StationStatsSummary("ADULT");
    expect(stats.equals(stats)).toBe(true);
  });
});
