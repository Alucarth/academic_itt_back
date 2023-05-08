import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NivelAcademicoTipo } from 'src/academico/entidades/nivelAcademicoTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { NivelAcademicoTipoController } from './nivel_academico_tipo.controller';
import { NivelAcademicoTipoService } from './nivel_academico_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([NivelAcademicoTipo])],
  controllers: [NivelAcademicoTipoController],
  providers: [NivelAcademicoTipoService]
})
export class NivelAcademicoTipoModule {}
