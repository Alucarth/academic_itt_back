import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtapaEducativaAsignatura } from 'src/academico/entidades/etapaEducativaAsignatura.entity';
import { DatabaseModule } from 'src/database/database.module';
import { EtapaEducativaAsignaturaController } from './etapa_educativa_asignatura.controller';
import { EtapaEducativaAsignaturaRepository } from './etapa_educativa_asignatura.repository';
import { EtapaEducativaAsignaturaService } from './etapa_educativa_asignatura.service';

@Module({
  providers: [
    EtapaEducativaAsignaturaService, 
    EtapaEducativaAsignaturaRepository],
  exports: [EtapaEducativaAsignaturaService],
  imports: [DatabaseModule, TypeOrmModule.forFeature([EtapaEducativaAsignatura])],
  controllers: [EtapaEducativaAsignaturaController],

})
export class EtapaEducativaAsignaturaModule {}
