import HttpException from './http.exception';

export default class BadRequestException extends HttpException {
  statusCode: number;
  message: string;
  error: string | null;

  constructor(message: string, error?: string) {
    super(400, message);

    this.statusCode = 400;
    this.message = message;
    this.error = error || null;
  }
}
