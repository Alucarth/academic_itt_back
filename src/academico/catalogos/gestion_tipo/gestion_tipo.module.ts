import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GestionTipo } from 'src/academico/entidades/gestionTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { GestionTipoController } from './gestion_tipo.controller';
import { GestionTipoService } from './gestion_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([GestionTipo])],
  controllers: [GestionTipoController],
  providers: [GestionTipoService]
})
export class GestionTipoModule {}
