import { Inject, Injectable } from "@nestjs/common";
import { UnidadTerritorialUsuarioRol } from "src/academico/entidades/unidadTerritorialUsuarioRol.entity";
import { Repository } from "typeorm";

@Injectable()
export class UnidadTerritorialUsuarioRolService{
    constructor(
        @Inject('UNIDAD_TERRITORIAL_USUARIO_ROL')
        private unidadTerritorialUsuarioRol: Repository<UnidadTerritorialUsuarioRol>
    ){}

    async findByUsuarioRolId(usuario_rol_id): Promise<UnidadTerritorialUsuarioRol[]>
    {
        return this.unidadTerritorialUsuarioRol.find({
            relations:{
                unidadTerritorial:true
            },
            where:{
                usuarioRolId: usuario_rol_id
            }
        })
    }
}