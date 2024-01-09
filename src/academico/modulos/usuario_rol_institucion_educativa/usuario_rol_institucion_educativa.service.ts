import { Inject, Injectable } from "@nestjs/common";
import { UsuarioRolInstitucionEducativa } from "src/academico/entidades/usuarioRolInsituticionEducativa.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsuarioRolInstitucionEducativaService{
    constructor(
        @Inject('USUARIO_ROL_INSITUCION_EDUCATIVA_REPOSITORY')
        private usuarioRolInstitucionEducativaRepository: Repository<UsuarioRolInstitucionEducativa>
    ){}

    async findAll(): Promise<UsuarioRolInstitucionEducativa[]>{
        return this.usuarioRolInstitucionEducativaRepository.find({                   
        })
    }

    async findByUsuarioRolId(usuario_rol_id): Promise<UsuarioRolInstitucionEducativa[]>{
        return this.usuarioRolInstitucionEducativaRepository.find(
            {   relations:{
                institucionEducativaSucursal:{
                    institucionEducativa:true
                }
                },
                where:{
                    usuarioRolId: usuario_rol_id
                }
            }
        )
    }

}