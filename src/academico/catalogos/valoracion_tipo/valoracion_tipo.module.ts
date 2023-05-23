import { Module } from '@nestjs/common';
import { ValoracionTipoController } from './valoracion_tipo.controller';
import { ValoracionTipoService } from './valoracion_tipo.service';

@Module({
  controllers: [ValoracionTipoController],
  providers: [ValoracionTipoService]
})
export class ValoracionTipoModule {}
