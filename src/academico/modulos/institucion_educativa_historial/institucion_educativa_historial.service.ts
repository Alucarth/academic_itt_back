import { CreateInstitucionEducativaHistorialDto } from './dto/createInstitucionEducativaHistorial.dto';
import { User } from './../../../users/entity/users.entity';

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InstitucionEducativaHistorial } from "src/academico/entidades/institucionEducativaHistorial.entity";
import { Repository } from "typeorm";
import { InstitucionEducativa } from 'src/academico/entidades/institucionEducativa.entity';
import { InstitucionEducativaAcreditacion } from 'src/academico/entidades/institucionEducativaAcreditacion.entity';

@Injectable()
export class InstitucionEducativaHistorialService{
    constructor(
        @InjectRepository(InstitucionEducativaHistorial)
        private institucionEducativaHistorialRepository: Repository <InstitucionEducativaHistorial>,
        @InjectRepository(InstitucionEducativa)
        private institucionEducativaRepository: Repository<InstitucionEducativa>,
        @InjectRepository(InstitucionEducativaAcreditacion)
        private institucionEducativaAcreditacionRepository: Repository <InstitucionEducativaAcreditacion>
    ){}

    async getInstituteHistory (institucion_educativa_id: number) 
    {
        return this.institucionEducativaHistorialRepository.find({
            relations:{
                fromDependenciaTipo:true,
                toDependenciaTipo: true,
                usuario: { persona:true },
            },
            where: { institucionEducativaId: institucion_educativa_id}
        })
    }

    async createInstitutionHistory(payload: CreateInstitucionEducativaHistorialDto, user: User )
    {
        payload.usuarioId = user.id
        const history = await this.institucionEducativaHistorialRepository.save(payload)

        const institution = await this.institucionEducativaRepository.findOne({
            where: {id: history.institucionEducativaId}
        })

        if(institution)
        {
            institution.institucionEducativa = history.toDenominacion
            await this.institucionEducativaRepository.save(institution)
        }

        const acreditacion = await this.institucionEducativaAcreditacionRepository.findOne({
            where: { institucionEducativaId: history.institucionEducativaId }
        })

        if(acreditacion) 
        {
            acreditacion.dependenciaTipoId = history.toDependenciaTipoId
            await this.institucionEducativaAcreditacionRepository.save(acreditacion)
        }

        return history
    }

    
}