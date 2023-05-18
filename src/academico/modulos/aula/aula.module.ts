import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aula } from 'src/academico/entidades/aula.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { AulaController } from './aula.controller';
import { AulaRepository } from './aula.repository';
import { AulaService } from './aula.service';

@Module({
  imports:[
    DatabaseModule, TypeOrmModule.forFeature([
         Aula 
        ]),
    ],
  controllers: [AulaController],
  providers: [AulaService,
    AulaRepository, 
    RespuestaSigedService
  ]
})
export class AulaModule {}
