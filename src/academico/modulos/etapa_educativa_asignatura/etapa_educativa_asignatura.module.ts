import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtapaEducativaAsignatura } from 'src/academico/entidades/etapaEducativaAsignatura.entity';
import { DatabaseModule } from 'src/database/database.module';
import { EtapaEducativaAsignaturaController } from './etapa_educativa_asignatura.controller';
import { EtapaEducativaAsignaturaRepository } from './etapa_educativa_asignatura.repository';
import { EtapaEducativaAsignaturaService } from './etapa_educativa_asignatura.service';
import { EtapaEducativa } from "../../entidades/etapaEducativa.entity";
import { AsignaturaTipo } from "../../entidades/asignaturaTipo.entity";
import { IntervaloTiempoTipo } from "../../entidades/intervaloTiempoTipo.entity";
import { EspecialidadTipo } from "../../entidades/especialidadTipo.entity";
import { PlanEstudio } from "../../entidades/planEstudio.entity";
import { CampoSaberTipo } from "../../entidades/campoSaberTipo.entity";
import { RespuestaSigedService } from "../../../shared/respuesta.service";

@Module({
  providers: [
    EtapaEducativaAsignaturaService,
    EtapaEducativaAsignaturaRepository,
    RespuestaSigedService,
  ],
  exports: [EtapaEducativaAsignaturaService],
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([EtapaEducativaAsignatura]),
    TypeOrmModule.forFeature([EtapaEducativa]),
    TypeOrmModule.forFeature([AsignaturaTipo]),
    TypeOrmModule.forFeature([IntervaloTiempoTipo]),
    TypeOrmModule.forFeature([PlanEstudio]),
    TypeOrmModule.forFeature([EspecialidadTipo]),
    TypeOrmModule.forFeature([CampoSaberTipo]),
  ],
  controllers: [EtapaEducativaAsignaturaController],
})
export class EtapaEducativaAsignaturaModule {}
