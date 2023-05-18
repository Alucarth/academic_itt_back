import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager } from 'typeorm';
import { CreateOfertaCurricularDto } from './dto/createOfertaCurricular.dto';
import { OfertaCurricularRepository } from './oferta_curricular.repository';

@Injectable()
export class OfertaCurricularService {
    constructor(
        
        @Inject(OfertaCurricularRepository) 
        private ofertaCurricularRepository: OfertaCurricularRepository,

       
        private _serviceResp: RespuestaSigedService, 
        
    ){}

    async getAll(){
        const cursos = await this.ofertaCurricularRepository.getAll()
        return cursos
    }

    async getAllByCarreraId(id:number){
        const cursos = await this.ofertaCurricularRepository.getAllByCarreraId(id)
        return cursos
    }
/*
    async createOfertaCurricular (dto: CreateOfertaCurricularDto) {
       
  
            const op = async (transaction: EntityManager) => {
              const nuevaOferta =  await this.ofertaCurricularRepository.createOfertaCurricular(
                dto,
                transaction
              )
  
              if(nuevaOferta?.id){
                  console.log(nuevaOferta.id);    
                aulas
      
                  if(asignaturas.length > 0){
                      //Crear la oferta academica 
                      await this.ofertaAcademicaRepository.crearOfertaAcademica(
                          1, 
                          nuevoCurso.id, 
                          asignaturas, 
                          transaction
                      );
                  }
              }
              return nuevoCurso;
            }
  
            const crearResult = await this.institucionEducativaCursoRepository.runTransaction(op)
  
            if(crearResult){
              return this._serviceResp.respuestaHttp201(
                  crearResult.id,
                  'Registro de curso y oferta Creado !!',
                  '',
              );
            }
            return this._serviceResp.respuestaHttp500(
              "",
              'No se pudo guardar la información !!',
              '',
          );
      }*/
}
