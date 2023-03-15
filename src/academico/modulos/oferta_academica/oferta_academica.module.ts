import { Module } from '@nestjs/common';
import { OfertaAcademicaController } from './oferta_academica.controller';
import { OfertaAcademicaRepository } from './oferta_academica.repository';
import { OfertaAcademicaService } from './oferta_academica.service';

@Module({
  controllers: [OfertaAcademicaController],
  providers: [OfertaAcademicaService, OfertaAcademicaRepository]
})
export class OfertaAcademicaModule {}
