import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValoracionTipo } from 'src/academico/entidades/valoracionTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { ValoracionTipoController } from './valoracion_tipo.controller';
import { ValoracionTipoService } from './valoracion_tipo.service';

@Module({
  imports:[
    DatabaseModule, TypeOrmModule.forFeature([
     ValoracionTipo      
        ]),
    ],
  controllers: [ValoracionTipoController],
  providers: [ValoracionTipoService, RespuestaSigedService]
})
export class ValoracionTipoModule {}
