import { CreateInstitucionEducativaHistorialDto } from './dto/createInstitucionEducativaHistorial.dto';
import { User } from './../../../users/entity/users.entity';

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InstitucionEducativaHistorial } from "src/academico/entidades/institucionEducativaHistorial.entity";
import { Repository } from "typeorm";

@Injectable()
export class InstitucionEducativaHistorialService{
    constructor(
        @InjectRepository(InstitucionEducativaHistorial)
        private institucionEducativaHistorialRepository: Repository <InstitucionEducativaHistorial>,
    ){}

    async getInstituteHistory (institucion_educativa_id: number) 
    {
        return this.institucionEducativaHistorialRepository.find({
            where: { institucionEducativaId: institucion_educativa_id}
        })
    }

    async createInstitutionHistory(payload: CreateInstitucionEducativaHistorialDto, user: User )
    {
        payload.usuarioId = user.id

        return this.institucionEducativaHistorialRepository.save(payload)
    }

    
}