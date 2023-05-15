import { Module } from '@nestjs/common';
import { InscripcionController } from './inscripcion.controller';
import { InscripcionService } from './inscripcion.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "src/database/database.module";
import { RespuestaSigedService } from "src/shared/respuesta.service";

import { PersonaService } from "src/academico/modulos/persona/persona.service";
import { PersonaModule } from '../persona/persona.module';

@Module({
  imports: [DatabaseModule, PersonaModule],
  controllers: [InscripcionController],
  providers: [InscripcionService, RespuestaSigedService],
})
export class InscripcionModule {}
