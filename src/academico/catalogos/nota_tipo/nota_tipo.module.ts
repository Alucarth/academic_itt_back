import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotaTipo } from 'src/academico/entidades/notaTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { NotaTipoController } from './nota_tipo.controller';
import { NotaTipoService } from './nota_tipo.service';

@Module({
  imports:[
    DatabaseModule, TypeOrmModule.forFeature([
     NotaTipo      
        ]),
    ],
  controllers: [NotaTipoController],
  providers: [NotaTipoService, RespuestaSigedService]
})
export class NotaTipoModule {}
