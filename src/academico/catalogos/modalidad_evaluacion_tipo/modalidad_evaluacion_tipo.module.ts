import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModalidadEvaluacionTipo } from 'src/academico/entidades/modalidadEvaluacionTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { ModalidadEvaluacionTipoController } from './modalidad_evaluacion_tipo.controller';
import { ModalidadEvaluacionTipoService } from './modalidad_evaluacion_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([ModalidadEvaluacionTipo])],
  controllers: [ModalidadEvaluacionTipoController],
  providers: [ModalidadEvaluacionTipoService, RespuestaSigedService]
})
export class ModalidadEvaluacionTipoModule {}
