import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
import { PlanEstudioResolucion } from 'src/academico/entidades/planEstudioResolucion.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { CarreraAutorizadaRepository } from '../carrera_autorizada/carrera_autorizada.repository';
import { PlanEstudioResolucionController } from './plan_estudio_resolucion.controller';
import { PlanEstudioResolucionRepository } from './plan_estudio_resolucion.repository';
import { PlanEstudioResolucionService } from './plan_estudio_resolucion.service';

@Module({
  imports:[
    DatabaseModule, TypeOrmModule.forFeature([
      PlanEstudioResolucion, 
      CarreraAutorizada
        ]),
        ],
  controllers: [PlanEstudioResolucionController],
  providers: [PlanEstudioResolucionService,
    PlanEstudioResolucionRepository,
    CarreraAutorizadaRepository,
  RespuestaSigedService]
})
export class PlanEstudioResolucionModule {}
