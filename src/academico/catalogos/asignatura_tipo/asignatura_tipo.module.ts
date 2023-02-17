import { Module } from '@nestjs/common';
import { AsignaturaTipoController } from './asignatura_tipo.controller';
import { AsignaturaTipoService } from './asignatura_tipo.service';

@Module({
  controllers: [AsignaturaTipoController],
  providers: [AsignaturaTipoService]
})
export class AsignaturaTipoModule {}
