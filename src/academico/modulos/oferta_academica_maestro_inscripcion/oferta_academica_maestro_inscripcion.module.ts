import { Module } from '@nestjs/common';
import { OfertaAcademicaMaestroInscripcionController } from './oferta_academica_maestro_inscripcion.controller';
import { OfertaAcademicaMaestroInscripcionService } from './oferta_academica_maestro_inscripcion.service';

@Module({
  controllers: [OfertaAcademicaMaestroInscripcionController],
  providers: [OfertaAcademicaMaestroInscripcionService]
})
export class OfertaAcademicaMaestroInscripcionModule {}
