import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { jwtConstants } from '../constants/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { RolesGuard } from './guards/roles.guard';
import { User } from '../users/entity/users.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'process';
import { JWT_SECRET } from 'src/config/constants';
import { usuarioRolProviders } from 'src/academico/modulos/usuario_rol/usuario_rol.providers';
import { UsuarioRolService } from 'src/academico/modulos/usuario_rol/usuario_rol.service';
import { UsuarioRolModule } from 'src/academico/modulos/usuario_rol/usuario_rol.module';
import { DatabaseModule } from 'src/database/database.module';
import { usuarioRolInstitucionEducativaProviders } from 'src/academico/modulos/usuario_rol_institucion_educativa/usuario_rol_institucion_educativa.providers';
import { UsuarioRolInstitucionEducativaService } from 'src/academico/modulos/usuario_rol_institucion_educativa/usuario_rol_institucion_educativa.service';
// import { UsuarioRolModule } from 'src/academico/modulos/usuario_rol/usuario_rol.module';
// import { UsuarioRolService } from 'src/academico/modulos/usuario_rol/usuario_rol.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    DatabaseModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      //imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(JWT_SECRET),
        // privateKey: configService.get("JWT_SECRET"),
        //secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: 28800, //3600
        },
      }),

    }),
    forwardRef(() => UsersModule),
  ],
  providers: [...usuarioRolProviders, ...usuarioRolInstitucionEducativaProviders, AuthService, LocalStrategy, JwtStrategy, RolesGuard, UsuarioRolService,UsuarioRolInstitucionEducativaService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
