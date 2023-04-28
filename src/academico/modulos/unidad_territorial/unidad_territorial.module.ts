import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadTerritorial } from 'src/academico/entidades/unidadTerritorial.entity';
import { DatabaseModule } from 'src/database/database.module';
import { UnidadTerritorialController } from './unidad_territorial.controller';
import { UnidadTerritorialRepository } from './unidad_territorial.repository';
import { UnidadTerritorialService } from './unidad_territorial.service';

@Module({
  imports:[
    DatabaseModule,
    TypeOrmModule.forFeature([
      UnidadTerritorial,
    ])
  ],
  controllers: [UnidadTerritorialController],
  providers: [
    UnidadTerritorialService,
    UnidadTerritorialRepository
  ]
})
export class UnidadTerritorialModule {}
