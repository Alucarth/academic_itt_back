import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
import { PlanEstudioCarrera } from 'src/academico/entidades/planEstudioCarrera.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { CarreraAutorizadaRepository } from '../carrera_autorizada/carrera_autorizada.repository';
import { PlanEstudioCarreraController } from './plan_estudio_carrera.controller';
import { PlanEstudioCarreraRepository } from './plan_estudio_carrera.repository';
import { PlanEstudioCarreraService } from './plan_estudio_carrera.service';

@Module({
  imports:[
    DatabaseModule,
      TypeOrmModule.forFeature([
      PlanEstudioCarrera, 
      CarreraAutorizada, 
      
        ]),
   ],
  controllers: [PlanEstudioCarreraController],
  providers: [PlanEstudioCarreraService,
    PlanEstudioCarreraRepository,
    CarreraAutorizadaRepository,
    RespuestaSigedService
  ]
})
export class PlanEstudioCarreraModule {}
