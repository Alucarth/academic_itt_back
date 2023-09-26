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
        return this.usuarioRolInstitucionEducativaRepository.find()
    }

}