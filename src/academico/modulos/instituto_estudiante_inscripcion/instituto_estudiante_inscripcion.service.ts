import { CreateInstitutoInscripcionEstudianteArchivo } from './dto/create_instituto_inscripcion_estudiante_archivo.dto';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InstitutoEstudianteInscripcion } from "src/academico/entidades/InstitutoEstudianteInscripcion.entity";
import { InstitutoEstudianteInscripcionArchivo } from "src/academico/entidades/institutoEstudianteInscripcionArchivo.entity";
import { MoreThan, Repository } from "typeorm";

@Injectable()
export class InstitutoEstudianteInscripcionService{
    constructor(
        @InjectRepository(InstitutoEstudianteInscripcionArchivo)
        private institutoEstudianteInscripcionArchivo: Repository< InstitutoEstudianteInscripcionArchivo>,
        @InjectRepository(InstitutoEstudianteInscripcion)
        private institutoEstudianteInscripcion: Repository < InstitutoEstudianteInscripcion>
    ){}
    

    async getFiles(instituto_estudiante_inscripcion_id: number)
    {
        const files = await this.institutoEstudianteInscripcionArchivo.find(
            {
                relations:{
                    archivoTipo:true,
                },
                where:{ 
                        institutoEstudianteInscripcionId: instituto_estudiante_inscripcion_id
                      }
            }
        )

        return files
    }

    async getInscriptionById(instituto_estudiante_inscripcion_id: number)
    {
        const instituto_estudiante_inscripcion = await this.institutoEstudianteInscripcion.findOne({
            relations:{
                matriculaEstudiante: {
                    institucionEducativaEstudiante: {
                        persona:true,
                        institucionEducativaSucursal: {
                            institucionEducativa:true,
                        }
                    },
                    
                }

            },
            where: { id: instituto_estudiante_inscripcion_id}
        })

        const files = await this.getFiles(instituto_estudiante_inscripcion_id)


        return { instituto_estudiante_inscripcion, files }

    }

    async getInscriptions(inscripcion_tipo_id: number,estado_instituto_id: number)
    {
        const instituto_estudiante_inscripcions = await this.institutoEstudianteInscripcion.find({
            
            relations:{
                matriculaEstudiante: {
                    institucionEducativaEstudiante: {
                        persona:true,
                        institucionEducativaSucursal: {
                            institucionEducativa:true,
                        }
                    },
                    
                }
            },
            where:{ 
                    // inscripcionTipoId: inscripcion_tipo_id,
                    inscripcionTipoId: MoreThan(0)
                    // estadoInstitutoId: estado_instituto_id 
                    // estadoInstitutoId: MoreThan(0) 
                  },
        })

        return instituto_estudiante_inscripcions

    }

    async saveInscriptionFile(instituto_estudiante_inscripcion_id: number, payload: CreateInstitutoInscripcionEstudianteArchivo[])
    {
        const inscription = await this.institutoEstudianteInscripcion.findOne({
            where: {id: instituto_estudiante_inscripcion_id}
        })

        let files= []
        if(inscription)
        {
            Promise.all(payload.map( async (item)=>{
               
                const file = await this.institutoEstudianteInscripcionArchivo.save(item)
                files.push(file)
            }))
        }

        return {inscription, files}
    }   
}