import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SegipTipo } from 'src/academico/entidades/segipTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { SegipTipoController } from './segip_tipo.controller';
import { SegipTipoService } from './segip_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([SegipTipo])],
  controllers: [SegipTipoController],
  providers: [SegipTipoService]
})
export class SegipTipoModule {}
