import { Module } from '@nestjs/common';
import { CarreraGrupoTipoController } from './carrera_grupo_tipo.controller';
import { CarreraGrupoTipoService } from './carrera_grupo_tipo.service';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarreraGrupoTipo } from 'src/academico/entidades/carreraGrupoTipo.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([CarreraGrupoTipo])],
  controllers: [CarreraGrupoTipoController],
  providers: [CarreraGrupoTipoService]
})
export class CarreraGrupoTipoModule {}
