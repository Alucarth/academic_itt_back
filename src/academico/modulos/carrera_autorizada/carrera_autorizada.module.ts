import { Module } from '@nestjs/common';
import { CarreraAutorizadaController } from './carrera_autorizada.controller';
import { CarreraAutorizadaService } from './carrera_autorizada.service';

@Module({
  controllers: [CarreraAutorizadaController],
  providers: [CarreraAutorizadaService]
})
export class CarreraAutorizadaModule {}
