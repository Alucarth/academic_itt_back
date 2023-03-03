import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CensoTipo } from 'src/academico/entidades/censoTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { CensoTipoController } from './censo_tipo.controller';
import { CensoTipoService } from './censo_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([CensoTipo])],
  controllers: [CensoTipoController],
  providers: [CensoTipoService]
})
export class CensoTipoModule {}
