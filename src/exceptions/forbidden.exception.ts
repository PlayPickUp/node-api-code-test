import HttpException from "./http.exception";

export default class ForbiddenException extends HttpException {
  statusCode: number
  message: string;
  error: string | null;

  constructor(message: string, error?: string) {
    super(403, message);

    this.statusCode = 403;
    this.message = message;
    this.error = error || null;
  }
}
