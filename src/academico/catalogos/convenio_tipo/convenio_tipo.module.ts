import { Module } from '@nestjs/common';
import { ConvenioTipoController } from './convenio_tipo.controller';
import { ConvenioTipoService } from './convenio_tipo.service';

@Module({
  controllers: [ConvenioTipoController],
  providers: [ConvenioTipoService]
})
export class ConvenioTipoModule {}
