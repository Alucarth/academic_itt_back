import { Module } from '@nestjs/common';
import { EducacionTipoController } from './educacion_tipo.controller';

@Module({
  controllers: [EducacionTipoController]
})
export class EducacionTipoModule {}
