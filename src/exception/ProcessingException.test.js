import ProcessingException from "./ProcessingException.js";

describe("ProcessingException", () => {
  it("should be an instance of Error", () => {
    const err = new ProcessingException("Test error");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ProcessingException);
  });

  it('should set the name property to "ProcessingException"', () => {
    const err = new ProcessingException("Some message");
    expect(err.name).toBe("ProcessingException");
  });

  it("should store the message provided", () => {
    const err = new ProcessingException("Failed to process");
    expect(err.message).toBe("Failed to process");
  });

  it("should have a stack trace", () => {
    const err = new ProcessingException("Stack trace test");
    expect(err.stack).toContain("ProcessingException");
  });

  it("should work with no message", () => {
    const err = new ProcessingException();
    expect(err.message).toBe("");
    expect(err.name).toBe("ProcessingException");
  });
});
