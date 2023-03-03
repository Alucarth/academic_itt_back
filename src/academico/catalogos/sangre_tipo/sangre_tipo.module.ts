import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SangreTipo } from 'src/academico/entidades/sangreTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { SangreTipoController } from './sangre_tipo.controller';
import { SangreTipoService } from './sangre_tipo.service';

@Module({
  imports : [DatabaseModule, TypeOrmModule.forFeature([SangreTipo])],
  controllers: [SangreTipoController],
  providers: [SangreTipoService]
})
export class SangreTipoModule {}
