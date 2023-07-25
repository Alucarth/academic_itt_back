import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from '../../constants/constants';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET } from 'src/config/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService,
    private config:ConfigService
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      //secretOrKey: jwtConstants.secret,
      secretOrKey: config.get<string>(JWT_SECRET),
  });
}

  async validate(payload: any) {
    const { sub: id } = payload;
    const user = await this.userService.getOne(id);
    if(!user){
      console.log("no hay usuario desde jwt-srategy");
      throw new UnauthorizedException();

    }
    console.log("si existe usuario desde jwt-srategy");
    return user;
    /*return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };*/
  }
}
