import { Module } from '@nestjs/common';
import { CargoTipoController } from './cargo_tipo.controller';
import { CargoTipoService } from './cargo_tipo.service';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespuestaSigedService } from '../../../shared/respuesta.service'
import { CargoTipo } from 'src/academico/entidades/cargoTipo.entity'

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([CargoTipo])],
  controllers: [CargoTipoController],
  providers: [CargoTipoService, RespuestaSigedService]
})
export class CargoTipoModule {}
