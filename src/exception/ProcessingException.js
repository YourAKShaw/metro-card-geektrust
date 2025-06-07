/**
 * Custom error class to handle processing-related exceptions.
 */
class ProcessingException extends Error {
  /**
   * Creates a new ProcessingException instance.
   * @param {string} [message] - Optional error message.
   */
  constructor(message) {
    super(message);
    this.name = "ProcessingException";
    Error.captureStackTrace?.(this, ProcessingException);
  }
}

export default ProcessingException;
