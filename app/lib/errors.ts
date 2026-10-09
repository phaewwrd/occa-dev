export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super("VALIDATION", message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super("NOT_FOUND", message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super("CONFLICT", message, 409);
  }
}

export function toActionError(error: unknown): {
  code: string;
  message: string;
} {
  if (error instanceof AppError) {
    return { code: error.code, message: error.message };
  }
  return {
    code: "INTERNAL",
    message: "Something went wrong. Please try again.",
  };
}
