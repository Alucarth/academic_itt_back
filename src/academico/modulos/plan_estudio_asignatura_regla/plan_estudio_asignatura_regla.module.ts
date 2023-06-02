import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEstudioAsignaturaRegla } from 'src/academico/entidades/planEstudioAsignaturaRegla.entity';
import { DatabaseModule } from 'src/database/database.module';
import { PlanEstudioAsignaturaReglaController } from './plan_estudio_asignatura_regla.controller';
import { PlanEstudioAsignaturaReglaRepository } from './plan_estudio_asignatura_regla.repository';
import { PlanEstudioAsignaturaReglaService } from './plan_estudio_asignatura_regla.service';

@Module({
  imports:[
    DatabaseModule, TypeOrmModule.forFeature([
        PlanEstudioAsignaturaRegla
        ]),
    ],
  controllers: [PlanEstudioAsignaturaReglaController],
  providers: [PlanEstudioAsignaturaReglaService,
    PlanEstudioAsignaturaReglaRepository]
})
export class PlanEstudioAsignaturaReglaModule {}
