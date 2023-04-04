import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtapaEducativa } from 'src/academico/entidades/etapaEducativa.entity';
import { EtapaEducativaTipo } from 'src/academico/entidades/etapaEducativaTipo.entity';
import { EducacionTipo } from 'src/academico/entidades/educacionTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { EtapaEducativaController } from './etapa_educativa.controller';
import { EtapaEducativaService } from './etapa_educativa.service';
import { RespuestaSigedService } from "../../../shared/respuesta.service";

@Module({
  imports: [DatabaseModule, 
    TypeOrmModule.forFeature([EtapaEducativa]),
    TypeOrmModule.forFeature([EtapaEducativaTipo]),
    TypeOrmModule.forFeature([EducacionTipo]),
  ],
  controllers: [EtapaEducativaController],
  providers: [EtapaEducativaService, RespuestaSigedService],
})
export class EtapaEducativaModule {}
