import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegimenGradoTipo } from 'src/academico/entidades/regimenGradoTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { RegimenGradoTipoController } from './regimen_grado_tipo.controller';
import { RegimenGradoTipoService } from './regimen_grado_tipo.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([RegimenGradoTipo])],
  controllers: [RegimenGradoTipoController],
  providers: [RegimenGradoTipoService,
    RespuestaSigedService
  ]
})
export class RegimenGradoTipoModule {}
