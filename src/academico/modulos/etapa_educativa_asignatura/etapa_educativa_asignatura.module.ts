import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtapaEducativaAsignatura } from 'src/academico/entidades/etapaEducativaAsignatura.entity';
import { DatabaseModule } from 'src/database/database.module';
import { EtapaEducativaAsignaturaController } from './etapa_educativa_asignatura.controller';
import { EtapaEducativaAsignaturaService } from './etapa_educativa_asignatura.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([EtapaEducativaAsignatura])],
  controllers: [EtapaEducativaAsignaturaController],
  providers: [EtapaEducativaAsignaturaService]
})
export class EtapaEducativaAsignaturaModule {}
