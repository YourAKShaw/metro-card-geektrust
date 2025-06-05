/**
 * Fare charges for different passenger types (in currency units).
 * 
 * @constant
 * @type {{ ADULT: number, SENIOR_CITIZEN: number, KID: number }}
 * @property {number} ADULT - Fare for adult passengers.
 * @property {number} SENIOR_CITIZEN - Discounted fare for senior citizens.
 * @property {number} KID - Fare for children.
 */
const STATIC = {
  ADULT: 200,
  SENIOR_CITIZEN: 100,
  KID: 50,
};

export default STATIC;