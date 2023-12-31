import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JurisdiccionGeografica } from 'src/academico/entidades/jurisdiccionGeografica.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { UnidadTerritorialRepository } from '../unidad_territorial/unidad_territorial.repository';
import { JurisdiccionGeograficaController } from './jurisdiccion_geografica.controller';
import { JurisdiccionGeograficaRepository } from './jurisdiccion_geografica.repository';
import { JurisdiccionGeograficaService } from './jurisdiccion_geografica.service';

@Module({
  imports:[DatabaseModule,
  TypeOrmModule.forFeature([
    JurisdiccionGeografica
  ])],
  controllers: [JurisdiccionGeograficaController],
  providers: [JurisdiccionGeograficaService,
  JurisdiccionGeograficaRepository,
  UnidadTerritorialRepository,
  RespuestaSigedService]
})
export class JurisdiccionGeograficaModule {}
