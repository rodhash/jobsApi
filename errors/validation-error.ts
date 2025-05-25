
export class ValidationError extends Error {
  constructor(public errors: Record<string, any>) {
    super("Validation Error")
    this.name = "ValidationError"
  }
}

