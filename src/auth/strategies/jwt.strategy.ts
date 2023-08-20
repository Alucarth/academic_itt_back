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
    const { id: id } = payload;
    //console.log("*******validate***********");
   // console.log("payload sub", payload.sub);
    const duser = await this.userService.getOne(id);
   // console.log("usuario desde vaidate",duser)
    if(!duser){
      console.log("no hay usuario desde jwt-srategy");
      throw new UnauthorizedException();

    }
    console.log("si existe usuario desde jwt-srategy");
    return duser;
    /*return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };*/
  }
}
