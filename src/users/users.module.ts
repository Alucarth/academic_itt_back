import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/users.entity';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { RespuestaSigedService } from '../shared/respuesta.service'
import { PersonaService } from './persona/persona.service';
import { Persona  } from './entity/persona.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User]),  TypeOrmModule.forFeature([Persona])],
  controllers: [UsersController],
  providers: [UsersService, RespuestaSigedService, PersonaService],
  exports: [UsersService, PersonaService],
})

export class UsersModule {}
