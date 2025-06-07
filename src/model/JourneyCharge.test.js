import JourneyCharge from './JourneyCharge.js';

describe('JourneyCharge', () => {
  it('should create an instance with discount and costOfJourney', () => {
    const jc = new JourneyCharge(30, 170);
    expect(jc.getDiscount()).toBe(30);
    expect(jc.getCostOfJourney()).toBe(170);
  });

  it('should set and get discount', () => {
    const jc = new JourneyCharge(10, 100);
    jc.setDiscount(50);
    expect(jc.getDiscount()).toBe(50);
  });

  it('should set and get costOfJourney', () => {
    const jc = new JourneyCharge(0, 200);
    jc.setCostOfJourney(150);
    expect(jc.getCostOfJourney()).toBe(150);
  });

  it('should handle zero and negative values', () => {
    const jc = new JourneyCharge(0, 0);
    expect(jc.getDiscount()).toBe(0);
    expect(jc.getCostOfJourney()).toBe(0);

    jc.setDiscount(-10);
    jc.setCostOfJourney(-200);
    expect(jc.getDiscount()).toBe(-10);
    expect(jc.getCostOfJourney()).toBe(-200);
  });
});