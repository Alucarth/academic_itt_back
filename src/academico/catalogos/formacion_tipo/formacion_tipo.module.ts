import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { FormacionTipo } from 'src/academico/entidades/formacionTipo.entity';
import { FormacionTipoController } from './formacion_tipo.controller';
import { FormacionTipoService } from './formacion_tipo.service';
import { RespuestaSigedService } from '../../../shared/respuesta.service'

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([FormacionTipo])],
  controllers: [FormacionTipoController],
  providers: [FormacionTipoService, RespuestaSigedService]
})
export class FormacionTipoModule {}
