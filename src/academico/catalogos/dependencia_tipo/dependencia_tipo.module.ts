import { Module } from '@nestjs/common';
import { DependenciaTipoController } from './dependencia_tipo.controller';
import { DependenciaTipoService } from './dependencia_tipo.service';

@Module({
  controllers: [DependenciaTipoController],
  providers: [DependenciaTipoService]
})
export class DependenciaTipoModule {}
