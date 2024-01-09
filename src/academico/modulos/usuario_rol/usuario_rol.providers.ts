import { UsuarioRol } from "src/academico/entidades/usuarioRol.entity";
import { DataSource } from "typeorm";

export const usuarioRolProviders = [
    {
        provide: 'USUARIO_ROL_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(UsuarioRol),
        inject: ['DATA_SOURCE']
    }
]