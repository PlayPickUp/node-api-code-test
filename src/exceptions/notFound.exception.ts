import HttpException from './http.exception';

export default class NotFoundException extends HttpException {
  statusCode: number;
  message: string;
  error: string | null;

  constructor(message: string, error?: string) {
    super(404, message);

    this.statusCode = 404;
    this.message = message;
    this.error = error || null;
  }
}
