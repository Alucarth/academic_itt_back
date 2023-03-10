import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperativoEtapaEducativa } from 'src/academico/entidades/operativoEtapaEducativa.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { OperativoEtapaEducativaController } from './operativo_etapa_educativa.controller';
import { OperativoEtapaEducativaService } from './operativo_etapa_educativa.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([OperativoEtapaEducativa])],
  controllers: [OperativoEtapaEducativaController],
  providers: [OperativoEtapaEducativaService, RespuestaSigedService]
})
export class OperativoEtapaEducativaModule {}
