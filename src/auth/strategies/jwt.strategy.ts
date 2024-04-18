// import { ExtractJwt, Strategy } from 'passport-jwt';

// import { ConfigService } from '@nestjs/config';
// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private config: ConfigService) {
//     const secretOrKey = config.get<string>('accessSecret');
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey,
//     });
//   }

//   async validate(payload: any) {
//     return { userId: payload.sub, username: payload.username };
//   }
// }
