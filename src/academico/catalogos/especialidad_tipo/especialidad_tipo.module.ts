import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EspecialidadTipo } from 'src/academico/entidades/especialidadTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { EspecialidadTipoController } from './especialidad_tipo.controller';
import { EspecialidadTipoService } from './especialidad_tipo.service';
import { RespuestaSigedService } from '../../../shared/respuesta.service'

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([EspecialidadTipo])],
  controllers: [EspecialidadTipoController],
  providers: [EspecialidadTipoService, RespuestaSigedService]
})
export class EspecialidadTipoModule {}
