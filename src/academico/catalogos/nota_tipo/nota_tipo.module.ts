import { Module } from '@nestjs/common';
import { NotaTipoController } from './nota_tipo.controller';
import { NotaTipoService } from './nota_tipo.service';

@Module({
  controllers: [NotaTipoController],
  providers: [NotaTipoService]
})
export class NotaTipoModule {}
