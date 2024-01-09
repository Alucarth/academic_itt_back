import { Inject, Injectable } from "@nestjs/common";
import { UsuarioRol } from "src/academico/entidades/usuarioRol.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsuarioRolService{
    constructor(
        @Inject('USUARIO_ROL_REPOSITORY')
        private usuarioRolRepository: Repository<UsuarioRol>
    ){}

    async findAll(): Promise<UsuarioRol[]> {
        return await this.usuarioRolRepository.find({})
    }

    async findOne(usuario_id: number): Promise<UsuarioRol>{
        return await this.usuarioRolRepository.findOne({
            relations:{
                rolTipo:true
            },
            where:{
                usuarioId: usuario_id
            }
        })
    }

    async findByUserId(usuario_id:number): Promise <UsuarioRol[]>{
        return await this.usuarioRolRepository.find({
            relations:{
                rolTipo:true
            },
            where:{
                usuarioId: usuario_id
            }
        })
    }
}