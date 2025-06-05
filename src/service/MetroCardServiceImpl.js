import MetroCardService from "./MetroCardService.js";
import CommandValidatorImpl from "../util/CommandValidatorImpl.js";
import STATIC from "../constants/static.js";

/**
 * Service class that simulates MetroCard operations such as balance initialization,
 * check-in processing, and generating journey summaries.
 */
class MetroCardServiceImpl extends MetroCardService {
  /**
   * Initializes the MetroCard service state.
   */
  constructor() {
    super();
    /**
     * Summary data containing passengers, check-ins, order info, and total collections/discounts.
     * @type {Object}
     */
    this.summary = {
      passengerMap: new Map(), // Map<String, Passenger>
      checkInList: [], // Array of PassengerCheckIn objects
      orderByTypeAirport: [], // List of passenger types in order for AIRPORT
      orderByTypeCentral: [], // List of passenger types in order for CENTRAL
      totalAmountAirport: 0,
      totalDiscountAirport: 0,
      totalAmountCentral: 0,
      totalDiscountCentral: 0,
      getPassengerMap() {
        return this.passengerMap;
      },
      getCheckInList() {
        return this.checkInList;
      },
      getOrderByTypeAirport() {
        return this.orderByTypeAirport;
      },
      getOrderByTypeCentral() {
        return this.orderByTypeCentral;
      },
      getTotalAmountAirport() {
        return this.totalAmountAirport;
      },
      setTotalAmountAirport(val) {
        this.totalAmountAirport = val;
      },
      getTotalDiscountAirport() {
        return this.totalDiscountAirport;
      },
      setTotalDiscountAirport(val) {
        this.totalDiscountAirport = val;
      },
      getTotalAmountCentral() {
        return this.totalAmountCentral;
      },
      setTotalAmountCentral(val) {
        this.totalAmountCentral = val;
      },
      getTotalDiscountCentral() {
        return this.totalDiscountCentral;
      },
      setTotalDiscountCentral(val) {
        this.totalDiscountCentral = val;
      },
    };
  }

  /**
   * Executes a list of input commands sequentially.
   * @param {Array<{command: string, token: string[]}>} args - List of command objects with tokens.
   * @returns {string} The output generated from commands, typically from PRINT_SUMMARY.
   * @throws {Error} Throws if an invalid command is encountered.
   */
  executeCommands(args) {
    let output = "";
    for (const input of args) {
      // Validate the input command using CommandValidatorImpl (assumed implemented elsewhere)
      const inputCheck = new CommandValidatorImpl();
      inputCheck.validateCommand(input);

      switch (input.command) {
        case "BALANCE":
          this.initializeBalance(input.token);
          break;

        case "CHECK_IN":
          this.processCheckIn(input.token);
          break;

        case "PRINT_SUMMARY":
          output = this.printSummary();
          console.log(output);
          break;

        default:
          throw new Error(
            "Invalid Input Commands, please check the input command."
          );
      }
    }
    return output;
  }

  /**
   * Initializes a passenger's metrocard balance and registers them.
   * @param {string[]} tokens - Tokens containing [passengerId, initialBalance].
   * @returns {Object} The created passenger object.
   */
  initializeBalance(tokens) {
    const id = tokens[0];
    const balance = parseInt(tokens[1], 10);

    const passenger = {
      id,
      balanceInTheMetroCard: balance,
      journeyCount: 0,
    };

    this.summary.getPassengerMap().set(id, passenger);
    return passenger;
  }

  /**
   * Processes a passenger check-in by recording the journey and updating balances.
   * @param {string[]} tokens - Tokens containing [metroCardNumber, passengerType, fromStation].
   */
  processCheckIn(tokens) {
    const checkedIn = this.initializeCheckList(tokens);
    const journeyCharge = this.updateBalance(
      checkedIn.metroCardNumber,
      checkedIn.charge
    );
    checkedIn.journeyCharge = journeyCharge;

    if (
      checkedIn.fromStation === "AIRPORT" &&
      !this.summary.getOrderByTypeAirport().includes(checkedIn.passengerType)
    ) {
      this.summary.getOrderByTypeAirport().push(checkedIn.passengerType);
    }

    if (
      checkedIn.fromStation === "CENTRAL" &&
      !this.summary.getOrderByTypeCentral().includes(checkedIn.passengerType)
    ) {
      this.summary.getOrderByTypeCentral().push(checkedIn.passengerType);
    }

    this.summary.getCheckInList().push(checkedIn);
  }

  /**
   * Generates a summary report of all check-ins and station statistics.
   * @returns {string} Formatted summary string.
   */
  printSummary() {
    return this.calculateStationStatistics(this.summary.getCheckInList());
  }

  /**
   * Calculates statistics grouped by station and passenger type.
   * @param {Array<Object>} checkedIn - List of passenger check-in objects.
   * @returns {string} Formatted summary output.
   */
  calculateStationStatistics(checkedIn) {
    // Group by passenger type for AIRPORT station
    const passengerAtAirport = this.groupBy(
      checkedIn.filter((c) => c.fromStation === "AIRPORT"),
      "passengerType"
    );
    const airportStats = this.calcEachStationStatistics(
      "AIRPORT",
      passengerAtAirport
    );
    const airportSummary = this.createSummary("AIRPORT", airportStats);

    // Group by passenger type for CENTRAL station
    const passengerAtCentral = this.groupBy(
      checkedIn.filter((c) => c.fromStation === "CENTRAL"),
      "passengerType"
    );
    const centralStats = this.calcEachStationStatistics(
      "CENTRAL",
      passengerAtCentral
    );
    const centralSummary = this.createSummary("CENTRAL", centralStats);

    // Construct output string
    let output = "";
    output += `TOTAL_COLLECTION CENTRAL ${this.summary.getTotalAmountCentral()} ${this.summary.getTotalDiscountCentral()}\n`;
    output += "PASSENGER_TYPE_SUMMARY\n";
    output += centralSummary;
    output += `TOTAL_COLLECTION AIRPORT ${this.summary.getTotalAmountAirport()} ${this.summary.getTotalDiscountAirport()}\n`;
    output += "PASSENGER_TYPE_SUMMARY\n";
    output += airportSummary;

    return output;
  }

  /**
   * Creates a summary string for the station from its statistics.
   * Also updates the total amount and discount in the summary.
   * @param {string} station - Station name ("AIRPORT" or "CENTRAL").
   * @param {Array<Object>} stationStats - List of station statistics objects.
   * @returns {string} Summary text for passenger types and their counts.
   */
  createSummary(station, stationStats) {
    let output = "";
    let totalCharge = 0,
      totalDiscount = 0;

    for (const stats of stationStats) {
      totalCharge += stats.totalCharge;
      totalDiscount += stats.totalDiscount;
      output += `${stats.passengerType} ${stats.count}\n`;
    }

    if (station === "AIRPORT") {
      this.summary.setTotalAmountAirport(totalCharge);
      this.summary.setTotalDiscountAirport(totalDiscount);
    } else if (station === "CENTRAL") {
      this.summary.setTotalAmountCentral(totalCharge);
      this.summary.setTotalDiscountCentral(totalDiscount);
    }

    return output;
  }

  /**
   * Calculates statistics for each passenger type at a station.
   * @param {string} fromStation - Station name ("AIRPORT" or "CENTRAL").
   * @param {Object} passengerAtStation - Object mapping passengerType to array of journeys.
   * @returns {Array<Object>} List of station statistics objects.
   */
  calcEachStationStatistics(fromStation, passengerAtStation) {
    const stationStatsList = [];
  
    for (const [passengerType, journeys] of Object.entries(passengerAtStation)) {
      const statistics = {
        passengerType,
        count: journeys.length,
        totalCharge: journeys.reduce((sum, journey) => sum + journey.journeyCharge.costOfJourney, 0),
        totalDiscount: journeys.reduce((sum, journey) => sum + journey.journeyCharge.discount, 0),
        orderByType: -1,
      };
  
      if (fromStation === "AIRPORT") {
        statistics.orderByType = this.summary.getOrderByTypeAirport().indexOf(passengerType);
      } else if (fromStation === "CENTRAL") {
        statistics.orderByType = this.summary.getOrderByTypeCentral().indexOf(passengerType);
      }
  
      stationStatsList.push(statistics);
    }
  
    return this.sortBasedOnHighestAmount(stationStatsList);
  }

  /**
   * Sorts station statistics descending by total charge, then ascending by passenger type order.
   * @param {Array<Object>} stationStatsList - List of station statistics to sort.
   * @returns {Array<Object>} Sorted list.
   */
  sortBasedOnHighestAmount(stationStatsList) {
    return stationStatsList.sort((a, b) => {
      if (b.totalCharge !== a.totalCharge) {
        return b.totalCharge - a.totalCharge;
      }
      return a.orderByType - b.orderByType;
    });
  }

  /**
   * Initializes a passenger check-in object from tokens.
   * @param {string[]} tokens - Tokens containing [metroCardNumber, passengerType, fromStation].
   * @returns {Object} PassengerCheckIn object.
   */
  initializeCheckList(tokens) {
    const [metroCardNumber, passengerType, fromStation] = tokens;
    const charge = STATIC[passengerType];
    return {
      metroCardNumber,
      passengerType,
      fromStation,
      charge,
      journeyCharge: null,
    };
  }

  /**
   * Updates passenger balance based on journey charge, applying discounts and service fees.
   * @param {string} id - Passenger metrocard number.
   * @param {number} charge - Charge for the journey.
   * @returns {Object} EachJourneyCharge object containing discount and total cost.
   * @throws {Error} Throws if passenger is not registered.
   */
  updateBalance(id, charge) {
    const passenger = this.summary.getPassengerMap().get(id);
    if (!passenger) {
      throw new Error("Metrocard User Not Registered");
    }
  
    passenger.journeyCount = (passenger.journeyCount || 0) + 1;
  
    let discount = 0;
    let totalAmountCollected = 0;
  
    // Apply 50% discount on every second journey
    if (passenger.journeyCount % 2 === 0) {
      discount = Math.floor(charge / 2);
      charge -= discount;
    }
  
    // Check for insufficient balance
    if (passenger.balanceInTheMetroCard < charge) {
      const balanceRequired = charge - passenger.balanceInTheMetroCard;
      const serviceFee = Math.ceil(0.02 * balanceRequired);
      totalAmountCollected = passenger.balanceInTheMetroCard + balanceRequired + serviceFee;
      passenger.balanceInTheMetroCard = 0;
    } else {
      passenger.balanceInTheMetroCard -= charge;
      totalAmountCollected = charge;
    }
  
    return {
      discount,
      costOfJourney: totalAmountCollected,
    };
  }

  /**
   * Helper method to group an array of objects by a specific key.
   * @param {Array<Object>} array - Array to group.
   * @param {string} key - Object key to group by.
   * @returns {Object} Grouped object with keys as group names and values as arrays of objects.
   */
  groupBy(array, key) {
    return array.reduce((result, item) => {
      (result[item[key]] = result[item[key]] || []).push(item);
      return result;
    }, {});
  }
}

export default MetroCardServiceImpl;