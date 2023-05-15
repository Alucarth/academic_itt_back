import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutoPlanEstudioCarrera } from 'src/academico/entidades/institutoPLanEstudioCarrera.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { InstitutoPlanEstudioCarreraController } from './instituto_plan_estudio_carrera.controller';
import { InstitutoPlanEstudioCarreraRepository } from './instituto_plan_estudio_carrera.repository';
import { InstitutoPlanEstudioCarreraService } from './instituto_plan_estudio_carrera.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([
    InstitutoPlanEstudioCarrera
  ])],
  controllers: [InstitutoPlanEstudioCarreraController],
  providers: [InstitutoPlanEstudioCarreraService,
    InstitutoPlanEstudioCarreraRepository,
    RespuestaSigedService]
})
export class InstitutoPlanEstudioCarreraModule {}
