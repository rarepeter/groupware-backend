import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  InternalServerErrorHttpException,
  UnauthorizedHttpException,
} from '../../api-http-exceptions/ApiHttpExceptions';
import { FirestoreService } from '../../firestore/firestore.service';
import { AuthService } from '../../auth/auth.service';
import { RequestWithAuth } from './request-with-auth.interface';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  isProduction: boolean;
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private authService: AuthService,
    private db: FirestoreService,
  ) {
    this.isProduction = config.get('NODE_ENV') === 'prod';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const response = context.switchToHttp().getResponse<Response>();
    const authToken = request.cookies['auth_token'];

    if (!authToken) throw new UnauthorizedHttpException();

    try {
      const token = await this.jwtService.verifyAsync(authToken);

      const userAuthToken = await this.db.getUserAuthToken(token.sub);

      if (userAuthToken !== authToken) throw new UnauthorizedHttpException();

      const user = await this.db.getUser(token.sub);

      if (user === null) throw new UnauthorizedHttpException();

      request.user = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        userId: user.userId,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedHttpException();
    }
  }
}
