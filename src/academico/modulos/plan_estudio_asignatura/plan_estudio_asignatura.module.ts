import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEstudioAsignatura } from 'src/academico/entidades/planEstudioAsignatura.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { CarreraAutorizadaRepository } from '../carrera_autorizada/carrera_autorizada.repository';
import { PlanEstudioAsignaturaController } from './plan_estudio_asignatura.controller';
import { PlanEstudioAsignaturaRepository } from './plan_estudio_asignatura.repository';
import { PlanEstudioAsignaturaService } from './plan_estudio_asignatura.service';

@Module({
  imports:[
    DatabaseModule, TypeOrmModule.forFeature([
      PlanEstudioAsignatura, 
        ]),
        ],
  controllers: [PlanEstudioAsignaturaController],
  providers: [PlanEstudioAsignaturaService,
    PlanEstudioAsignaturaRepository,
    CarreraAutorizadaRepository,
  RespuestaSigedService]
})
export class PlanEstudioAsignaturaModule {}
