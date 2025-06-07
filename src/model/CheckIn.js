import StaticConstants from "../constants/static.js";
import JourneyCharge from "./JourneyCharge.js";

/**
 * Represents a passenger's metro card check-in event,
 * including passenger type, origin station, and fare charges.
 */
class CheckIn {
  /**
   * Creates a new CheckIn instance for a passenger.
   *
   * @param {string} metroCardNumber - Unique identifier of the passenger's metro card.
   * @param {string} passengerType - Type of passenger; expected values: "ADULT", "SENIOR_CITIZEN", "KID".
   * @param {string} fromStation - The station from which the passenger is checking in.
   */
  constructor(metroCardNumber, passengerType, fromStation) {
    /**
     * @type {string}
     * @description The metro card number associated with the passenger.
     */
    this.metroCardNumber = metroCardNumber;

    /**
     * @type {string}
     * @description The passenger category/type.
     */
    this.passengerType = passengerType;

    /**
     * @type {string}
     * @description The starting station of the journey.
     */
    this.fromStation = fromStation;

    /**
     * @type {number|null}
     * @description The fare charged based on passenger type.
     */
    this.charge = null;

    /**
     * @type {JourneyCharge|null}
     * @description The detailed journey charge info, possibly including discount and final cost.
     */
    this.journeyCharge = null;

    // Initialize the charge based on passenger type
    this.setCharge(passengerType);
  }

  /**
   * Gets the metro card number.
   * @returns {string} The metro card number.
   */
  getMetroCardNumber() {
    return this.metroCardNumber;
  }

  /**
   * Sets or updates the metro card number.
   * @param {string} metroCardNumber - The new metro card number.
   */
  setMetroCardNumber(metroCardNumber) {
    this.metroCardNumber = metroCardNumber;
  }

  /**
   * Gets the passenger type.
   * @returns {string} The passenger type.
   */
  getPassengerType() {
    return this.passengerType;
  }

  /**
   * Sets or updates the passenger type and recalculates the charge accordingly.
   * @param {string} passengerType - The new passenger type (e.g., "ADULT").
   */
  setPassengerType(passengerType) {
    this.passengerType = passengerType;
    this.setCharge(passengerType);
  }

  /**
   * Gets the starting station of the journey.
   * @returns {string} The origin station name.
   */
  getFromStation() {
    return this.fromStation;
  }

  /**
   * Sets or updates the starting station.
   * @param {string} fromStation - The new origin station.
   */
  setFromStation(fromStation) {
    this.fromStation = fromStation;
  }

  /**
   * Gets the fare charge for the journey based on passenger type.
   * @returns {number|null} The fare charge amount or null if undefined.
   */
  getCharge() {
    return this.charge;
  }

  /**
   * Sets the fare charge based on the passenger type using static constants.
   * If the passenger type is unknown, charge is set to null.
   *
   * @param {string} passengerType - The passenger category to determine the fare.
   */
  setCharge(passengerType) {
    if (passengerType === "ADULT") {
      this.charge = StaticConstants.ADULT;
    } else if (passengerType === "SENIOR_CITIZEN") {
      this.charge = StaticConstants.SENIOR_CITIZEN;
    } else if (passengerType === "KID") {
      this.charge = StaticConstants.KID;
    } else {
      this.charge = null;
    }
  }

  /**
   * Gets the journey charge details.
   * @returns {JourneyCharge|null} The journey charge object or null if not set.
   */
  getJourneyCharge() {
    return this.journeyCharge;
  }

  /**
   * Sets or updates the journey charge details.
   *
   * @param {JourneyCharge} journeyCharge - An instance containing detailed journey charge info.
   */
  setJourneyCharge(journeyCharge) {
    this.journeyCharge = journeyCharge;
  }

  /**
   * Compares this CheckIn instance with another to determine equality.
   * Equality is based on metro card number, passenger type, from station, and charge amount.
   *
   * @param {CheckIn} obj - Another CheckIn instance to compare.
   * @returns {boolean} True if equal, otherwise false.
   */
  equals(obj) {
    if (this === obj) return true;
    if (!obj || !(obj instanceof CheckIn)) return false;
    return (
      this.passengerType === obj.passengerType &&
      this.fromStation === obj.fromStation &&
      this.metroCardNumber === obj.metroCardNumber &&
      this.charge === obj.charge
    );
  }
}

export default CheckIn;