import { Inject, Injectable } from '@nestjs/common';
import { resourceUsage } from 'process';
import { OfertaAcademica } from 'src/academico/entidades/ofertaAcademica.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager, Repository } from 'typeorm';
import { EstudianteInscripcionOfertaAcademicaRepository } from '../estudiante_inscripcion_oferta_academica/estudiante_inscripcion_oferta_academica.repository';
import { CreateEstudianteInscripcionDto } from './dto/createEstudianteInscripcion.dto';
import { CreateEstudianteInscripcionOfertaDto } from './dto/createEstudianteInscripcionOferta.dto';
import { EstudianteInscripcionRepository } from './estudiante_inscripcion.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitutoEstudianteInscripcion } from 'src/academico/entidades/InstitutoEstudianteInscripcion.entity';

@Injectable()
export class EstudianteInscripcionService {
    constructor(
        @Inject(EstudianteInscripcionRepository)
        private estudianteInscripcionRepositorio: EstudianteInscripcionRepository,
        @InjectRepository(InstitutoEstudianteInscripcion)
        private _institutoEstudianteInscripcionRepository: Repository <InstitutoEstudianteInscripcion>,

        @Inject(EstudianteInscripcionOfertaAcademicaRepository)
        private estudianteInscripcionOfertaAcademicaRepositorio: EstudianteInscripcionOfertaAcademicaRepository,

        private _serviceResp: RespuestaSigedService, 
    ){}
    async findAllEstudiantes(){
        return await this.estudianteInscripcionRepositorio.getAllEstudiantes();
    }
    async findEstudianteInscripcion(id:number){
        console.log('2');
        return await this.estudianteInscripcionRepositorio.getEstudianteInscripcionById(id);
    }
    async findEstudianteInscripcioCurso(idpersona:number,idcurso:number){
        
        return await this.estudianteInscripcionRepositorio.getEstudianteInscripcionByCurso(idpersona, idcurso);
    }

    async createEstudianteInscripcion (dto: CreateEstudianteInscripcionDto) {
        const dato = this.findEstudianteInscripcioCurso(dto.personaId, dto.institucionEducativaCursoId);
        if(!dato){
         const dato = await this.estudianteInscripcionRepositorio.createInscripcion(dto);
         return dato;
         
        }
        return dato
    }
    
    async checkInscription(aula_id, matricula_estudiante_id)
    {
        return await this._institutoEstudianteInscripcionRepository.findOne({
            where: { aulaId: aula_id, matriculaEstudianteId: matricula_estudiante_id}
        })
    }
   

    async createEstudianteInscripcionOferta (dto: CreateEstudianteInscripcionOfertaDto) {
            const dato = {
                personaId:dto.personaId,
                institucionEducativaCursoId:dto.institucionEducativaCursoId,
                usuarioId:1
            }
            const nuevaInscripcion =  await this.createEstudianteInscripcion(dato);
            
        console.log(nuevaInscripcion);
        if(nuevaInscripcion.id){

            const inscripcionOfertas =   await this.estudianteInscripcionOfertaAcademicaRepositorio.getInscripcionAsignaturas(nuevaInscripcion.id)

            const nuevasOfertas = await this.verificaInscripcionOfertas(inscripcionOfertas, dto.ofertas);
            
            if(nuevasOfertas.length > 0){
                const crearResult = await this.estudianteInscripcionOfertaAcademicaRepositorio.createInscripcionOfertaAcademica(
                    nuevaInscripcion.id, 
                    nuevasOfertas, 
                );
                if(crearResult){
                    return this._serviceResp.respuestaHttp201(
                        crearResult,
                        'Registro de curso y oferta Creado !!',
                        '',
                    );
                }else{
                    return this._serviceResp.respuestaHttp500(
                        '',
                        'Existe un problema',
                        '',
                    );
                }
            }
        }
        
       return true;
    }
    verificaInscripcionOfertas(inscripcionOfertas, ofertas) {

        const nuevos = ofertas.filter((oferta) =>
          inscripcionOfertas.every((ofertaAcademica) => ofertaAcademica.ofertaAcademica.id != oferta.id)
        )

        return nuevos;
        
      }
}
