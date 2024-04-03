import { MatriculaEstudiante } from './../../entidades/matriculaEstudiante.entity';
import { User } from './../../../users/entity/users.entity';
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MatriculaEstudianteArchivo } from "src/academico/entidades/matriculaEstudianteArchivo.entity";
import { Repository } from "typeorm";
import { CreateMatriculaEstudianteArchivo } from "./dto/CreateMatriculaEstudianteArchivo.dto";
import { CreateMatriculaEstudianteHistorial } from './dto/CreateMatriculaEstudianteHistorial.dto';
import { MatriculaEstudianteHistorial } from 'src/academico/entidades/matriculaEstudianteHistorial.entity';

@Injectable()
export class MatriculaEstudianteService{
    constructor(
        @InjectRepository(MatriculaEstudiante)
        private matriculaEstudianteRepository: Repository<MatriculaEstudiante>,
        @InjectRepository(MatriculaEstudianteArchivo)
        private matriculaEstudianteArchivoRepository: Repository<MatriculaEstudianteArchivo>,
        @InjectRepository(MatriculaEstudianteHistorial)
        private matriculaEstudianteHistorialRepository: Repository<MatriculaEstudianteHistorial>

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
                institutoPlanEstudioCarrera:{
                    carreraAutorizada:{
                        carreraTipo: true
                    }
                },
                estadoInstituto: true,
            },
            where: { id: matricula_estudiante_id }
        })

        const files = await this.matriculaEstudianteArchivoRepository.find({
            relations:{
                archivoTipo: true
            },
            where: { matriculaEstudianteId: matricula_estudiante_id}
        }) 

        return { matricula_estudiante, files}
    }

    async getList(estado_instituto_id: number, departamento_id: number)
    {
        const matriculados = await this.matriculaEstudianteRepository.query(`
            select ut5.lugar as departamento,ut5.id as departamento_id, ie.institucion_educativa, ies.id as institucion_educativa_sucursal_id, me.id as matricula_estudiante_id, me.fecha_registro ,ct.carrera , ei.estado, p.carnet_identidad, p.complemento , p.nombre, p.paterno, p.materno 
            from institucion_educativa ie  
            inner join jurisdiccion_geografica jg on ie.jurisdiccion_geografica_id = jg .id 
            inner join unidad_territorial ut on jg.localidad_unidad_territorial_2001_id = ut.id 
            inner join unidad_territorial ut2 on ut.unidad_territorial_id  = ut2.id
            inner join unidad_territorial ut3 on ut2.unidad_territorial_id  = ut3.id
            inner join unidad_territorial ut4 on ut3.unidad_territorial_id  = ut4.id
            inner join unidad_territorial ut5 on ut4.unidad_territorial_id = ut5.id
            inner join institucion_educativa_sucursal ies on ies.institucion_educativa_id  = ie.id
            inner join institucion_educativa_estudiante iee on iee.institucion_educativa_sucursal_id  = ies.id
            inner join persona p on p.id = iee.persona_id 
            inner join matricula_estudiante me on me.institucion_educativa_estudiante_id = iee.id
            inner join instituto_plan_estudio_carrera ipec on ipec.id = me.instituto_plan_estudio_carrera_id 
            inner join carrera_autorizada ca  on ca.id = ipec.carrera_autorizada_id 
            inner join carrera_tipo ct  on ct.id = ca.carrera_tipo_id  
            inner join estado_instituto ei on ei.id = me.estado_instituto_id 
            where ut5.id = ${departamento_id} and me.estado_instituto_id = ${estado_instituto_id};
        `)
        return matriculados
    }

    async saveArchivoTipo (payload: CreateMatriculaEstudianteArchivo, user: User)
    {
        return await this.matriculaEstudianteArchivoRepository.save(payload)
    }

    async sendDDE(matricula_estudiante_id: number, payload: CreateMatriculaEstudianteArchivo[],user: User)
    {
        const matricula_estudiante = await this.matriculaEstudianteRepository.findOne({
            where:{ id: matricula_estudiante_id}
        }) 
        let files = []

        if(matricula_estudiante)
        {
            await Promise.all(payload.map( async (item) => {
                let file = await this.matriculaEstudianteArchivoRepository.findOne({
                    where:{
                        matriculaEstudianteId: item.matriculaEstudianteId,
                        archivoTipoId: item.archivoTipoId,
                        gestionTipoId: item.gestionTipoId
                    }
                })

                if(file) //id exist update data files
                {
                    file.descripcion = item.descripcion
                    file.urlPath = item.urlPath
                    file.usuarioId = user.id
                    file = await this.matriculaEstudianteArchivoRepository.save(file)

                }else{

                    item.usuarioId = user.id
                    item.gestionTipoId = matricula_estudiante.gestionTipoId
                    file = await this.matriculaEstudianteArchivoRepository.save(item)
                }
                files.push(file)
            }))
        }
        let historial = null 
        if(files.length>0) //if has document update state
        {
            // 6 ENVIADO A LA DDE
            historial = this.updateState(matricula_estudiante_id, 6, "Se envia solicitud de Transitabilidad para aprobación por la DDE", user.id )
        }
        return { matricula_estudiante, files, historial}
    }

    async updateState(matricula_estudiante_id:number, estado_instituto_id: number, observacion: string, user_id: number)
    {
        const matricula_estudiante = await this.matriculaEstudianteRepository.findOne({
            where:{ id: matricula_estudiante_id}
        })
        let historial = null

        if(matricula_estudiante)
        {
            matricula_estudiante.estadoInstitutoId = estado_instituto_id
            await this.matriculaEstudianteRepository.save(matricula_estudiante)
            
            //generar historial
    
            historial = new CreateMatriculaEstudianteHistorial()
            historial.estadoInstitutoId = estado_instituto_id
            historial.matriculaEstudianteId = matricula_estudiante.id
            historial.observacion = observacion
            historial.usuarioId = user_id

            await this.matriculaEstudianteHistorialRepository.save(historial)

        }

        return historial
    }   


}