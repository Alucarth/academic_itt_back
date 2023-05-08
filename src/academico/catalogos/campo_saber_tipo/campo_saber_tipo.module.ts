import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampoSaberTipo } from 'src/academico/entidades/campoSaberTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { CampoSaberTipoController } from './campo_saber_tipo.controller';
import { CampoSaberTipoService } from './campo_saber_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([CampoSaberTipo])],
  controllers: [CampoSaberTipoController],
  providers: [CampoSaberTipoService]
})
export class CampoSaberTipoModule {}
