import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MatriculaEstudiante } from "src/academico/entidades/matriculaEstudiante.entity";
import { MatriculaEstudianteArchivo } from "src/academico/entidades/matriculaEstudianteArchivo.entity";
import { Repository } from "typeorm";

@Injectable()
export class MatriculaEstudianteService{
    constructor(
        @InjectRepository(MatriculaEstudiante)
        private matriculaEstudianteRepository: Repository<MatriculaEstudiante>,
        @InjectRepository(MatriculaEstudianteArchivo)
        private matriculaEstudianteArchivoRepository: Repository<MatriculaEstudianteArchivo>
    ) {}

    async findAll(): Promise <MatriculaEstudiante[]>
    {
        return await this.matriculaEstudianteRepository.find()
    }

    async getMatriculadosByPlan(plan_estudio_carrera_id: number): Promise <MatriculaEstudiante[]>
    {
        return await this.matriculaEstudianteRepository.find({
            relations: {
                institucionEducativaEstudiante:{
                    persona:true
                } 
            },
            where:{
                institutoPlanEstudioCarreraId: plan_estudio_carrera_id
            }
        })
    }

    async getMatriculaEstudiante(matricula_estudiante_id: number)
    {
        const matricula_estudiante = await this.matriculaEstudianteRepository.findOne({
            relations:{
                institucionEducativaEstudiante: { 
                    persona:true,
                    institucionEducativaSucursal: { 
                        institucionEducativa:true
                    }
                },
                estadoInstituto: true,
            },
            where: { id: matricula_estudiante_id }
        })

        const files = await this.matriculaEstudianteArchivoRepository.find({
            where: { matriculaEstudianteId: matricula_estudiante_id}
        }) 

        return { matricula_estudiante, files}
    }

    async getList(estado_instituto_id: number)
    {
        const matriculados = await this.matriculaEstudianteRepository.find({
            relations:{
                institucionEducativaEstudiante: { 
                    persona:true,
                    institucionEducativaSucursal: { 
                        institucionEducativa:true
                    }
                }
            },
            where: { estadoInstitutoId: estado_instituto_id }
        })
        return matriculados
    }

    // async 

}