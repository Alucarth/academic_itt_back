import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntervaloGestionTipo } from 'src/academico/entidades/intervaloGestionTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { IntervaloGestionTipoController } from './intervalo_gestion_tipo.controller';
import { IntervaloGestionTipoService } from './intervalo_gestion_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([IntervaloGestionTipo])],
  controllers: [IntervaloGestionTipoController],
  providers: [IntervaloGestionTipoService]
})
export class IntervaloGestionTipoModule {}
