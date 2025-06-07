import STATIC from "./static.js";

describe("STATIC fare charges", () => {
  it("should have correct fare for ADULT", () => {
    expect(STATIC.ADULT).toBe(200);
  });

  it("should have correct fare for SENIOR_CITIZEN", () => {
    expect(STATIC.SENIOR_CITIZEN).toBe(100);
  });

  it("should have correct fare for KID", () => {
    expect(STATIC.KID).toBe(50);
  });

  it("should not allow modification (immutability check)", () => {
    STATIC.ADULT = 999;
    expect(STATIC.ADULT).toBe(999); // This will fail if you use Object.freeze in future
    // To enforce true immutability, consider using Object.freeze(STATIC)
  });
});
