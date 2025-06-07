/**
 * Represents a passenger with a metro card, balance, and journey count.
 */
class Passenger {
  /**
   * @param {string} metroCardNumber - The unique metro card ID.
   * @param {number} balanceInTheMetroCard - Initial balance on the metro card.
   */
  constructor(metroCardNumber, balanceInTheMetroCard) {
    this.metroCardNumber = metroCardNumber;
    this.balanceInTheMetroCard = balanceInTheMetroCard;
    this.journeyCount = 0;
  }

  /** @returns {number} Number of journeys made */
  getJourneyCount() {
    return this.journeyCount;
  }

  /** @param {number} journeyCount */
  setJourneyCount(journeyCount) {
    this.journeyCount = journeyCount;
  }

  /** @returns {string} Metro card number */
  getMetroCardNumber() {
    return this.metroCardNumber;
  }

  /** @param {string} metroCardNumber */
  setMetroCardNumber(metroCardNumber) {
    this.metroCardNumber = metroCardNumber;
  }

  /** @returns {number} Balance on the metro card */
  getBalanceInTheMetroCard() {
    return this.balanceInTheMetroCard;
  }

  /** @param {number} balanceInTheMetroCard */
  setBalanceInTheMetroCard(balanceInTheMetroCard) {
    this.balanceInTheMetroCard = balanceInTheMetroCard;
  }
}

export default Passenger;
