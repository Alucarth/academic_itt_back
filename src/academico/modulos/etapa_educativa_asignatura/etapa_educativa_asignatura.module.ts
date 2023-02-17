import { Module } from '@nestjs/common';
import { EtapaEducativaAsignaturaController } from './etapa_educativa_asignatura.controller';
import { EtapaEducativaAsignaturaService } from './etapa_educativa_asignatura.service';

@Module({
  controllers: [EtapaEducativaAsignaturaController],
  providers: [EtapaEducativaAsignaturaService]
})
export class EtapaEducativaAsignaturaModule {}
