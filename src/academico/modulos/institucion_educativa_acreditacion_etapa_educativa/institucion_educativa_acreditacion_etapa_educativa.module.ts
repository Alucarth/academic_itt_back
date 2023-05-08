import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitucionEducativaAcreditacionEtapaEducativa } from 'src/academico/entidades/institucionEducativaAcreditacionEtapaEducativa.entity';
import { DatabaseModule } from 'src/database/database.module';
import { InstitucionEducativaAcreditacionEtapaEducativaController } from './institucion_educativa_acreditacion_etapa_educativa.controller';
import { InstitucionEducativaAcreditacionEtapaEducativaService } from './institucion_educativa_acreditacion_etapa_educativa.service';

@Module({
  imports: [DatabaseModule, 
    TypeOrmModule.forFeature([InstitucionEducativaAcreditacionEtapaEducativa])],
  controllers: [InstitucionEducativaAcreditacionEtapaEducativaController],
  providers: [InstitucionEducativaAcreditacionEtapaEducativaService]
})
export class InstitucionEducativaAcreditacionEtapaEducativaModule {}
