import { Module } from '@nestjs/common';
import { CarreraAutorizadaResolucionController } from './carrera_autorizada_resolucion.controller';
import { CarreraAutorizadaResolucionService } from './carrera_autorizada_resolucion.service';

@Module({
  controllers: [CarreraAutorizadaResolucionController],
  providers: [CarreraAutorizadaResolucionService]
})
export class CarreraAutorizadaResolucionModule {}
