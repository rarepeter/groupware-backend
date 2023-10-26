import { HttpException, HttpStatus } from '@nestjs/common';

type TExceptionResponseType =
  | 'forbidden'
  | 'internal_server_error'
  | 'not_enough_permissions'
  | 'unauthorized'
  | 'invalid_credentials'
  | 'invalid_otp_code'
  | 'invalid_seed'
  | 'general_validation_error';

interface IHttpExceptionResponse {
  type: TExceptionResponseType;
  message: string;
  solution: string;
}

export class ApiHttpException extends HttpException {
  constructor(data: IHttpExceptionResponse, statusCode: HttpStatus) {
    super({ statusCode, ...data }, statusCode);
  }
}

export class NotEnoughPermissionsHttpException extends ApiHttpException {
  constructor() {
    super(
      {
        type: 'not_enough_permissions',
        message: 'Nu aveți destule permisiuni pentru această operațiune.',
        solution: 'Contactați un administrator pentru acordarea permisiunii.',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class InternalServerErrorHttpException extends ApiHttpException {
  constructor() {
    super(
      {
        type: 'internal_server_error',
        message: 'A intervenit o eroare pe server.',
        solution: 'Vă rugăm să încercați din nou mai târziu.',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class ValidationErrorHttpException extends ApiHttpException {
  constructor() {
    super(
      {
        type: 'general_validation_error',
        message: 'A intervenit o eroare în timpul validării datelor.',
        solution:
          'Vă rugăm să încercați din nou mai târziu sau să contactați un administrator.',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class InvalidSeedApiHttpException extends ApiHttpException {
  constructor() {
    super(
      {
        type: 'invalid_seed',
        message: 'A intervenit o eroare pe server.',
        solution: 'Vă rugăm să încercați din nou mai târziu.',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class UnauthorizedHttpException extends ApiHttpException {
  constructor() {
    super(
      {
        type: 'unauthorized',
        message: 'Nu sunteți autentificat în aplicație.',
        solution: 'Vă rugăm să vă autentificați.',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidCredentialsHttpException extends ApiHttpException {
  constructor() {
    super(
      {
        type: 'invalid_credentials',
        message: 'Ați introdus datele incorecte de autentificare.',
        solution: 'Vă rugăm să încercați din nou.',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidOtpCodeHttpException extends ApiHttpException {
  constructor() {
    super(
      {
        type: 'invalid_otp_code',
        message: 'Ați introdus un cod de unică folosință greșit.',
        solution: 'Vă rugăm să încercați din nou.',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
