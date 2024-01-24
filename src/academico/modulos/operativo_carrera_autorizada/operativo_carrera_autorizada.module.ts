import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperativoCarreraAutorizada } from 'src/academico/entidades/operativoCarreraAutorizada.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { OperativoCarreraAutorizadaController } from './operativo_carrera_autorizada.controller';
import { OperativoCarreraAutorizadaRepository } from './operativo_carrera_autorizada.repository';
import { OperativoCarreraAutorizadaService } from './operativo_carrera_autorizada.service';
import { CarreraAutorizadaResolucion } from 'src/academico/entidades/carreraAutorizadaResolucion.entity';
import { PeriodoTipo } from 'src/academico/entidades/periodoTipo.entity';
import { ModalidadEvaluacionTipo } from 'src/academico/entidades/modalidadEvaluacionTipo.entity';
import { EventoTipo } from 'src/academico/entidades/eventoTipo.entity';

@Module({
  imports:[
    DatabaseModule, TypeOrmModule.forFeature([
         OperativoCarreraAutorizada,
         CarreraAutorizadaResolucion,
         PeriodoTipo,
         ModalidadEvaluacionTipo,
         EventoTipo
        ]),
   ],
  controllers: [OperativoCarreraAutorizadaController],
  providers: [OperativoCarreraAutorizadaService,
    OperativoCarreraAutorizadaRepository,
  RespuestaSigedService],
  exports: [OperativoCarreraAutorizadaService]
})
export class OperativoCarreraAutorizadaModule {}
