/**
 * Represents the charges associated with a single journey.
 */
class JourneyCharge {
  /**
   * @param {number} discount - Discount applied to the journey.
   * @param {number} costOfJourney - Actual cost after discount.
   */
  constructor(discount, costOfJourney) {
    this.discount = discount;
    this.costOfJourney = costOfJourney;
  }

  /**
   * @returns {number} The discount for the journey.
   */
  getDiscount() {
    return this.discount;
  }

  /**
   * @param {number} discount
   */
  setDiscount(discount) {
    this.discount = discount;
  }

  /**
   * @returns {number} The cost of the journey.
   */
  getCostOfJourney() {
    return this.costOfJourney;
  }

  /**
   * @param {number} costOfJourney
   */
  setCostOfJourney(costOfJourney) {
    this.costOfJourney = costOfJourney;
  }
}

export default JourneyCharge;