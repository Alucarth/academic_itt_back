import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";

export const Users = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log("-----inicio decorator------");
    const user = request.user;
    console.log("-------fin decorator----");

    return data ? user && user[data] : user;
  },
);
