import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/users.entity';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { RespuestaSigedService } from '../shared/respuesta.service'
import { PersonaService } from './persona/persona.service';
import { Persona  } from './entity/persona.entity';
import { AppTipo } from "../academico/entidades/appTipo.entity";
import { UsuarioUniTerrRol } from "./entity/usuarioUniTerrRol.entity";
import { JwtService } from "@nestjs/jwt";
import { SegipModule } from "src/segip/segip.module";

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Persona]),
    TypeOrmModule.forFeature([AppTipo]),
    TypeOrmModule.forFeature([UsuarioUniTerrRol]),
    SegipModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, RespuestaSigedService, PersonaService, JwtService],
  exports: [UsersService, PersonaService],
})
export class UsersModule {}
