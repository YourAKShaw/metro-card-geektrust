/**
 * Represents a summary of passengers' journeys, tracking fares, discounts,
 * and ordered passenger types separately for Airport and Central stations.
 */
class Summary {
  /**
   * Creates a new PassengerSummary instance with initial empty collections and zero totals.
   */
  constructor() {
    /**
     * Map of metro card numbers (IDs) to Passenger objects.
     * @type {Map<string, Object>}  // Replace Object with your Passenger class/type if available
     */
    this.passengerMap = new Map();

    /**
     * List of all check-in events by passengers.
     * @type {Array<Object>} // Replace Object with your PassengerCheckIn class/type if available
     */
    this.checkInList = [];

    /**
     * Total fare amount collected from passengers starting at Airport station.
     * @type {number}
     */
    this.totalAmountAirport = 0;

    /**
     * Total fare amount collected from passengers starting at Central station.
     * @type {number}
     */
    this.totalAmountCentral = 0;

    /**
     * Total discount amount given to passengers starting at Airport station.
     * @type {number}
     */
    this.totalDiscountAirport = 0;

    /**
     * Total discount amount given to passengers starting at Central station.
     * @type {number}
     */
    this.totalDiscountCentral = 0;

    /**
     * Ordered list of passenger types for Airport station.
     * @type {string[]}
     */
    this.orderByTypeAirport = [];

    /**
     * Ordered list of passenger types for Central station.
     * @type {string[]}
     */
    this.orderByTypeCentral = [];
  }

  /**
   * Gets the total fare amount collected from Airport station passengers.
   * @returns {number}
   */
  getTotalAmountAirport() {
    return this.totalAmountAirport;
  }

  /**
   * Sets the total fare amount collected from Airport station passengers.
   * @param {number} amount
   */
  setTotalAmountAirport(amount) {
    this.totalAmountAirport = amount;
  }

  /**
   * Gets the total fare amount collected from Central station passengers.
   * @returns {number}
   */
  getTotalAmountCentral() {
    return this.totalAmountCentral;
  }

  /**
   * Sets the total fare amount collected from Central station passengers.
   * @param {number} amount
   */
  setTotalAmountCentral(amount) {
    this.totalAmountCentral = amount;
  }

  /**
   * Gets the total discount amount given to passengers starting at Airport station.
   * @returns {number}
   */
  getTotalDiscountAirport() {
    return this.totalDiscountAirport;
  }

  /**
   * Sets the total discount amount given to passengers starting at Airport station.
   * @param {number} discount
   */
  setTotalDiscountAirport(discount) {
    this.totalDiscountAirport = discount;
  }

  /**
   * Gets the total discount amount given to passengers starting at Central station.
   * @returns {number}
   */
  getTotalDiscountCentral() {
    return this.totalDiscountCentral;
  }

  /**
   * Sets the total discount amount given to passengers starting at Central station.
   * @param {number} discount
   */
  setTotalDiscountCentral(discount) {
    this.totalDiscountCentral = discount;
  }

  /**
   * Gets the map of metro card numbers to Passenger objects.
   * @returns {Map<string, Object>}
   */
  getPassengerMap() {
    return this.passengerMap;
  }

  /**
   * Sets the passenger map.
   * @param {Map<string, Object>} map
   */
  setPassengerMap(map) {
    this.passengerMap = map;
  }

  /**
   * Gets the list of all passenger check-ins.
   * @returns {Array<Object>}
   */
  getCheckInList() {
    return this.checkInList;
  }

  /**
   * Sets the list of all passenger check-ins.
   * @param {Array<Object>} list
   */
  setCheckInList(list) {
    this.checkInList = list;
  }

  /**
   * Gets the ordered list of passenger types for Airport station.
   * @returns {string[]}
   */
  getOrderByTypeAirport() {
    return this.orderByTypeAirport;
  }

  /**
   * Sets the ordered list of passenger types for Airport station.
   * @param {string[]} orderList
   */
  setOrderByTypeAirport(orderList) {
    this.orderByTypeAirport = orderList;
  }

  /**
   * Gets the ordered list of passenger types for Central station.
   * @returns {string[]}
   */
  getOrderByTypeCentral() {
    return this.orderByTypeCentral;
  }

  /**
   * Sets the ordered list of passenger types for Central station.
   * @param {string[]} orderList
   */
  setOrderByTypeCentral(orderList) {
    this.orderByTypeCentral = orderList;
  }
}

export default Summary;
