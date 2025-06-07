/**
 * Represents statistical summary data for a station,
 * including passenger count, total charges, discounts, and ordering info.
 */
class StationStatsSummary {
  /**
   * Creates a new StationStatsSummary instance for a given passenger type,
   * initializing counts and totals to zero.
   * @param {string} passengerType - Type of passenger (e.g., "ADULT", "KID", etc.)
   */
  constructor(passengerType) {
    /**
     * Number of passengers for this type.
     * @type {number}
     */
    this.count = 0;

    /**
     * Passenger type (e.g., "ADULT", "SENIOR_CITIZEN", "KID").
     * @type {string}
     */
    this.passengerType = passengerType;

    /**
     * Total fare charged to passengers of this type.
     * @type {number}
     */
    this.totalCharge = 0;

    /**
     * Total discount given to passengers of this type.
     * @type {number}
     */
    this.totalDiscount = 0;

    /**
     * Order rank or priority for sorting passenger types.
     * @type {number|null}
     */
    this.orderByType = null;
  }

  /**
   * Gets the order rank of this passenger type.
   * @returns {number|null}
   */
  getOrderByType() {
    return this.orderByType;
  }

  /**
   * Sets the order rank of this passenger type.
   * @param {number} order
   */
  setOrderByType(order) {
    this.orderByType = order;
  }

  /**
   * Gets the passenger count.
   * @returns {number}
   */
  getCount() {
    return this.count;
  }

  /**
   * Sets the passenger count.
   * @param {number} count
   */
  setCount(count) {
    this.count = count;
  }

  /**
   * Gets the passenger type.
   * @returns {string}
   */
  getPassengerType() {
    return this.passengerType;
  }

  /**
   * Sets the passenger type.
   * @param {string} type
   */
  setPassengerType(type) {
    this.passengerType = type;
  }

  /**
   * Gets the total fare charged.
   * @returns {number}
   */
  getTotalCharge() {
    return this.totalCharge;
  }

  /**
   * Sets the total fare charged.
   * @param {number} charge
   */
  setTotalCharge(charge) {
    this.totalCharge = charge;
  }

  /**
   * Gets the total discount given.
   * @returns {number}
   */
  getTotalDiscount() {
    return this.totalDiscount;
  }

  /**
   * Sets the total discount given.
   * @param {number} discount
   */
  setTotalDiscount(discount) {
    this.totalDiscount = discount;
  }

  /**
   * Checks equality with another StationStatsSummary instance.
   * @param {StationStatsSummary} obj
   * @returns {boolean} True if all fields match exactly.
   */
  equals(obj) {
    if (this === obj) return true;
    if (!obj || !(obj instanceof StationStatsSummary)) return false;

    return (
      this.count === obj.count &&
      this.passengerType === obj.passengerType &&
      this.totalCharge === obj.totalCharge &&
      this.totalDiscount === obj.totalDiscount
    );
  }
}

export default StationStatsSummary;
