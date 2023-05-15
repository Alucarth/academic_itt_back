import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
import { InstitutoPlanEstudioCarrera } from 'src/academico/entidades/institutoPlanEstudioCarrera.entity';
import { PlanEstudioCarrera } from 'src/academico/entidades/planEstudioCarrera.entity';
import { PlanEstudioResolucion } from 'src/academico/entidades/planEstudioResolucion.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { CarreraAutorizadaRepository } from '../carrera_autorizada/carrera_autorizada.repository';
import { InstitutoPlanEstudioCarreraRepository } from '../instituto_plan_estudio_carrera/instituto_plan_estudio_carrera.repository';
import { PlanEstudioCarreraRepository } from '../plan_estudio_carrera/plan_estudio_carrera.repository';
import { PlanEstudioResolucionController } from './plan_estudio_resolucion.controller';
import { PlanEstudioResolucionRepository } from './plan_estudio_resolucion.repository';
import { PlanEstudioResolucionService } from './plan_estudio_resolucion.service';

@Module({
  imports:[
    DatabaseModule, TypeOrmModule.forFeature([
      PlanEstudioResolucion, 
      CarreraAutorizada,
      PlanEstudioCarrera,
      InstitutoPlanEstudioCarrera,
        ]),
        ],
  controllers: [PlanEstudioResolucionController],
  providers: [PlanEstudioResolucionService,
    PlanEstudioResolucionRepository,
    CarreraAutorizadaRepository,
    PlanEstudioCarreraRepository,
    InstitutoPlanEstudioCarreraRepository,
  RespuestaSigedService]
})
export class PlanEstudioResolucionModule {}
