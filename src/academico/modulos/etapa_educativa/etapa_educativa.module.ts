import { Module } from '@nestjs/common';
import { EtapaEducativaController } from './etapa_educativa.controller';
import { EtapaEducativaService } from './etapa_educativa.service';

@Module({
  controllers: [EtapaEducativaController],
  providers: [EtapaEducativaService]
})
export class EtapaEducativaModule {}
