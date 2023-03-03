import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdiomaTipo } from 'src/academico/entidades/idiomaTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { IdiomaTipoController } from './idioma_tipo.controller';
import { IdiomaTipoService } from './idioma_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([IdiomaTipo])],
  controllers: [IdiomaTipoController],
  providers: [IdiomaTipoService]
})
export class IdiomaTipoModule {}
