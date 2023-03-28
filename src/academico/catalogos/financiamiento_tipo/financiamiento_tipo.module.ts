import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { FinanciamientoTipoController } from './financiamiento_tipo.controller';
import { FinanciamientoTipoService } from './financiamiento_tipo.service';
import { RespuestaSigedService } from '../../../shared/respuesta.service'
import { FinanciamientoTipo } from 'src/academico/entidades/financiamientoTipo.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([FinanciamientoTipo])],
  controllers: [FinanciamientoTipoController],
  providers: [FinanciamientoTipoService, RespuestaSigedService]
})
export class FinanciamientoTipoModule {}
