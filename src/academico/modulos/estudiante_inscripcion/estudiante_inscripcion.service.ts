import { Inject, Injectable } from '@nestjs/common';
import { resourceUsage } from 'process';
import { OfertaAcademica } from 'src/academico/entidades/ofertaAcademica.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager } from 'typeorm';
import { EstudianteInscripcionOfertaAcademicaRepository } from '../estudiante_inscripcion_oferta_academica/estudiante_inscripcion_oferta_academica.repository';
import { CreateEstudianteInscripcionDto } from './dto/createEstudianteInscripcion.dto';
import { CreateEstudianteInscripcionOfertaDto } from './dto/createEstudianteInscripcionOferta.dto';
import { EstudianteInscripcionRepository } from './estudiante_inscripcion.repository';

@Injectable()
export class EstudianteInscripcionService {
    constructor(
        @Inject(EstudianteInscripcionRepository)
        private estudianteInscripcionRepositorio: EstudianteInscripcionRepository,

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
    
    async createEstudianteInscripcionOfertaNoFunciona (dto: CreateEstudianteInscripcionOfertaDto) {

        const op = async (transaction: EntityManager) => {

          const nuevaInscripcion =  await this.estudianteInscripcionRepositorio.createEstudianteInscripcionOferta(
            dto,
            transaction
          )
          
          const crearResult = await this.estudianteInscripcionRepositorio.runTransaction(op)
          
          if(nuevaInscripcion?.id){
              console.log(nuevaInscripcion.id);    
              //Obtener todas las asignaturas
              if(dto.ofertas.length > 0){
                  //Crear la oferta academica 
                  const resultado = await this.estudianteInscripcionOfertaAcademicaRepositorio.createEstudianteInscripcionOfertaAcademica(
                      1, 
                      nuevaInscripcion.id, 
                      dto.ofertas, 
                      transaction
                  );   
              }    
          }
          return nuevaInscripcion;
        }
        const crearResult = await this.estudianteInscripcionRepositorio.runTransaction(op)

          if(crearResult){
            return this._serviceResp.respuestaHttp201(
                crearResult,
                'Registro de curso y oferta Creado !!',
                '',
            );
          }
       

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
