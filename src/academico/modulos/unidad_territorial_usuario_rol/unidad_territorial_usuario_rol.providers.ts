import { UnidadTerritorialUsuarioRol } from "src/academico/entidades/unidadTerritorialUsuarioRol.entity";
import { DataSource } from "typeorm";

export const unidadTerritorialUsuarioRolProviders = [
    {
        provide: 'UNIDAD_TERRITORIAL_USUARIO_ROL',
        useFactory: (dataSource: DataSource)=>dataSource.getRepository(UnidadTerritorialUsuarioRol),
        inject: ['DATA_SOURCE']
    }
]