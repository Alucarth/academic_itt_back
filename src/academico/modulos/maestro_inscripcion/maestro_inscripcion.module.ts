import { Module } from '@nestjs/common';
import { MaestroInscripcionController } from './maestro_inscripcion.controller';
import { MaestroInscripcionService } from './maestro_inscripcion.service';

@Module({
  controllers: [MaestroInscripcionController],
  providers: [MaestroInscripcionService]
})
export class MaestroInscripcionModule {}
