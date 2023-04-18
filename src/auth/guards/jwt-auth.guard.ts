import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../publicRoutes/public';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.token;
    console.log("token:", request.headers.token);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!token) {
      throw new UnauthorizedException();
    }
   

    try {
      const payload = await this.jwtService.decode(token);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      console.log("payload:", payload)
      //request["user"] = payload;
      if(!payload){
        throw new UnauthorizedException();  
      }

    } catch {
      throw new UnauthorizedException();
    }

    return true;

    /*if (isPublic) {
      return true;
    }*/

    //return super.canActivate(context);
  }


}
