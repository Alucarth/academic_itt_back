import { Module } from '@nestjs/common';
import { PlanEstudioCarreraSeguimientoController } from './plan_estudio_carrera_seguimiento.controller';
import { PlanEstudioCarreraSeguimientoService } from './plan_estudio_carrera_seguimiento.service';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEstudioCarreraSeguimiento } from 'src/academico/entidades/planEstudioCarreraSeguimiento.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([
    PlanEstudioCarreraSeguimiento
    ])
  ],
  controllers: [PlanEstudioCarreraSeguimientoController],
  providers: [PlanEstudioCarreraSeguimientoService, RespuestaSigedService]
})
export class PlanEstudioCarreraSeguimientoModule {}
