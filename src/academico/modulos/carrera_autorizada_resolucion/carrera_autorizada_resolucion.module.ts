import { Module } from '@nestjs/common';
import { CarreraAutorizadaResolucionController } from './carrera_autorizada_resolucion.controller';
import { CarreraAutorizadaResolucionRepository } from './carrera_autorizada_resolucion.repository';
import { CarreraAutorizadaResolucionService } from './carrera_autorizada_resolucion.service';

@Module({
  controllers: [CarreraAutorizadaResolucionController],
  providers: [CarreraAutorizadaResolucionService,
  CarreraAutorizadaResolucionRepository]
})
export class CarreraAutorizadaResolucionModule {}
