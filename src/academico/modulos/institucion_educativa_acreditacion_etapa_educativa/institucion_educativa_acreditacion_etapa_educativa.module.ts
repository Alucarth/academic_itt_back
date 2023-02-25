import { Module } from '@nestjs/common';
import { InstitucionEducativaAcreditacionEtapaEducativaController } from './institucion_educativa_acreditacion_etapa_educativa.controller';
import { InstitucionEducativaAcreditacionEtapaEducativaService } from './institucion_educativa_acreditacion_etapa_educativa.service';

@Module({
  controllers: [InstitucionEducativaAcreditacionEtapaEducativaController],
  providers: [InstitucionEducativaAcreditacionEtapaEducativaService]
})
export class InstitucionEducativaAcreditacionEtapaEducativaModule {}
