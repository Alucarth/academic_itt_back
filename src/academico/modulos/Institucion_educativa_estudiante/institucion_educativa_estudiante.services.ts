import { Inject, Injectable } from "@nestjs/common";
import { InstitucionEducativaEstudiante } from "src/academico/entidades/InstitucionEducativaEstudiante.entity";
import { Repository } from "typeorm";

@Injectable()
export class InstitucionEducativaEstudianteService{
    constructor(
        @Inject('INSTITUCION_EDUCATIVA_ESTUDIANTE_REPOSITORY')
        private institucionEducativaEstudianteRespository: Repository <InstitucionEducativaEstudiante>
    ){}
    
    async findAll(): Promise<InstitucionEducativaEstudiante[]>
    {
        return await this.institucionEducativaEstudianteRespository.find()
    }
    
    async getEstudiantesBySucursal(institucion_educativa_sucursal_id: number): Promise<InstitucionEducativaEstudiante[]>
    {
        return await this.institucionEducativaEstudianteRespository.find({
            relations:{
                persona:true
            },
            where:{
                institucionEducativaSucursalId: institucion_educativa_sucursal_id
            }
        })
    }
}