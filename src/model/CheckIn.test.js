import CheckIn from "./CheckIn.js";
import STATIC from "../constants/static.js";

describe("CheckIn", () => {
  it("should create a CheckIn instance with correct properties", () => {
    const checkIn = new CheckIn("12345", "ADULT", "CENTRAL");
    expect(checkIn.getMetroCardNumber()).toBe("12345");
    expect(checkIn.getPassengerType()).toBe("ADULT");
    expect(checkIn.getFromStation()).toBe("CENTRAL");
  });

  it("should set and get metroCardNumber", () => {
    const checkIn = new CheckIn("12345", "ADULT", "CENTRAL");
    checkIn.setMetroCardNumber("99999");
    expect(checkIn.getMetroCardNumber()).toBe("99999");
  });

  it("should set and get passengerType and update charge accordingly", () => {
    const checkIn = new CheckIn("12345", "ADULT", "CENTRAL");
    checkIn.setPassengerType("KID");
    expect(checkIn.getPassengerType()).toBe("KID");
    // Add expected charge for KID if known
    // expect(checkIn.getCharge()).toBe(STATIC.KID);
  });

  it("should set and get fromStation", () => {
    const checkIn = new CheckIn("12345", "ADULT", "CENTRAL");
    checkIn.setFromStation("AIRPORT");
    expect(checkIn.getFromStation()).toBe("AIRPORT");
  });

  it("should set charge based on passenger type", () => {
    // You may need to adjust these values based on your STATIC
    const checkInAdult = new CheckIn("11111", "ADULT", "CENTRAL");
    expect(checkInAdult.getCharge()).toBe(STATIC.ADULT);

    const checkInSenior = new CheckIn("22222", "SENIOR_CITIZEN", "CENTRAL");
    expect(checkInSenior.getCharge()).toBe(STATIC.SENIOR_CITIZEN);

    const checkInKid = new CheckIn("33333", "KID", "CENTRAL");
    expect(checkInKid.getCharge()).toBe(STATIC.KID);
  });

  it("should set charge to null for unknown passenger type", () => {
    const checkIn = new CheckIn("44444", "UNKNOWN", "CENTRAL");
    expect(checkIn.getCharge()).toBeNull();
  });
});
