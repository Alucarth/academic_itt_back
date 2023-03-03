import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadTerritorialTipo } from 'src/academico/entidades/unidadTerritorialTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { UnidadTerritorialTipoController } from './unidad_territorial_tipo.controller';
import { UnidadTerritorialTipoService } from './unidad_territorial_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([UnidadTerritorialTipo])],
  controllers: [UnidadTerritorialTipoController],
  providers: [UnidadTerritorialTipoService]
})
export class UnidadTerritorialTipoModule {}
