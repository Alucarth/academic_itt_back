import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
//import { JwtAuthGuard } from 'src/auth/guards';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
//import { ACGuard } from 'nest-access-control';

//export function Auth(...roles: Role[]) {
export function Auth() {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
  //  UseRoles(...roles),
    ApiBearerAuth(),
  );
}