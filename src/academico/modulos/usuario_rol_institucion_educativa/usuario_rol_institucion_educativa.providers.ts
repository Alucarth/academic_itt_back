import { UsuarioRolInstitucionEducativa } from "src/academico/entidades/usuarioRolInsituticionEducativa.entity";
import { DataSource } from "typeorm";

export const usuarioRolInstitucionEducativaProviders = [
    {
        provide: 'USUARIO_ROL_INSITUCION_EDUCATIVA_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(UsuarioRolInstitucionEducativa),
        inject: ['DATA_SOURCE']
    }
]