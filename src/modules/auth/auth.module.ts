import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PublicStrategy } from './public.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (apiConfigService: ApiConfigService) => ({
        // privateKey: apiConfigService.authConfig.privateKey,
        // publicKey: apiConfigService.authConfig.publicKey,
        secret: apiConfigService.authConfig.secretKey,
        signOptions: {
          algorithm: 'RS256',
          expiresIn: apiConfigService.authConfig.jwtExpirationTime,
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
      }),
      inject: [ApiConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PublicStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
