
export class MongoError extends Error {
  constructor(public code: number, public keyValue: Record<string, any>) {
    super("MongoDB Error")
    this.name = "MongoError"
  }
}

export class CastError extends Error {
  constructor(public value: string) {
    super(`Invalid id ${value}`)
    this.name = "CastError"
  }
}

