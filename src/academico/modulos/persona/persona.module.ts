import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { Persona } from 'src/users/entity/persona.entity';
import { PersonaController } from './persona.controller';
import { PersonaRepository } from './persona.repository';
import { PersonaService } from './persona.service';
import { SegipModule } from "src/segip/segip.module";

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Persona]), SegipModule],
  controllers: [PersonaController],
  providers: [PersonaService, PersonaRepository, RespuestaSigedService],
  exports: [PersonaService],
})
export class PersonaModule {}
