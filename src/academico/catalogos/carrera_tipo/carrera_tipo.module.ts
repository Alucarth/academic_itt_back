import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { CarreraTipoController } from './carrera_tipo.controller';
import { CarreraTipoService } from './carrera_tipo.service';
import { RespuestaSigedService } from "../../../shared/respuesta.service";

import { CarreraTipo } from 'src/academico/entidades/carrerraTipo.entity';
import { CarreraGrupoTipo } from 'src/academico/entidades/carreraGrupoTipo.entity';

@Module({
  imports: [DatabaseModule,
    TypeOrmModule.forFeature([CarreraTipo]),
    TypeOrmModule.forFeature([CarreraGrupoTipo]),  
  ],
  controllers: [CarreraTipoController],
  providers: [CarreraTipoService, RespuestaSigedService],
})
export class CarreraTipoModule {}
