import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager } from 'typeorm';
import { EtapaEducativaAsignaturaRepository } from '../etapa_educativa_asignatura/etapa_educativa_asignatura.repository';
import { InstitucionEducativaSucursalRepository } from '../institucion_educativa_sucursal/institucion_educativa_sucursal.repository';
import { InstitucionEducativaSucursalService } from '../institucion_educativa_sucursal/institucion_educativa_sucursal.service';
import { OfertaAcademicaRepository } from '../oferta_academica/oferta_academica.repository';
import { CreateInstitucionEducativaCursoDto } from './dto/createInstitucionEducativaCurso.dto';
import { UpdateInstitucionEducativaCursoDto } from './dto/updateInstitucionEducativaCurso';
import { InstitucionEducativaCursoRepository } from './institucion_educativa_curso.repository';

@Injectable()
export class InstitucionEducativaCursoService {
    constructor(
        
        @Inject(InstitucionEducativaCursoRepository) 
        private institucionEducativaCursoRepository: InstitucionEducativaCursoRepository,

        @Inject(EtapaEducativaAsignaturaRepository)
        private etapaEducativaAsignaturaRepository: EtapaEducativaAsignaturaRepository,

        @Inject(OfertaAcademicaRepository)
        private ofertaAcademicaRepository: OfertaAcademicaRepository,

        @Inject(InstitucionEducativaSucursalRepository)
        private institucionEducativaSucursalRepository: InstitucionEducativaSucursalRepository,
        private _serviceResp: RespuestaSigedService, 
        
    ){}

    async getAll(){
        const cursos = await this.institucionEducativaCursoRepository.getAll()
        return cursos
    }

    async getBySie(sie:number, gestion:number, periodo:number){
      const cursos = await this.institucionEducativaCursoRepository.getAllBySie(sie, gestion, periodo)
      return cursos
    }

    async getByEtapa(id:number, gestion:number, periodo:number){
      const cursos = await this.institucionEducativaCursoRepository.getAllByEtapa(id, gestion, periodo)
      return cursos
    }

    async createCurso (dto: CreateInstitucionEducativaCursoDto) {
      const sucursal =  await this.institucionEducativaSucursalRepository.findSucursalBySieGestion(dto.institucionEducativaId, dto.gestionTipoId);
      if(sucursal){
        dto.institucionEducativaSucursalId = sucursal.id;
      }
      console.log(dto);

          const op = async (transaction: EntityManager) => {
            const nuevoCurso =  await this.institucionEducativaCursoRepository.createCurso(
              dto,
              transaction
            )

            if(nuevoCurso?.id){
                console.log(nuevoCurso.id);    
                //Obtener todas las asignaturas
                const asignaturas  = await this.etapaEducativaAsignaturaRepository.findAsignaturasByEtapaId(dto.etapaEducativaId);
                console.log(asignaturas);   
    
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
    }

    async updateCurso (dto: UpdateInstitucionEducativaCursoDto) {

        const op = async (transaction: EntityManager) => {
          const updateCurso =  await this.institucionEducativaCursoRepository.updateCurso(
            dto,
            transaction
          )
          return updateCurso;
        }
        const crearResult = await this.institucionEducativaCursoRepository.runTransaction(op)
        if(crearResult){
            return this._serviceResp.respuestaHttp201(
                '',
                'Actualizados datos de Curso y Oferta  !!',
                '',
            );
          }  
    }

    async deleteCursoOferta(id: number) {
        const op = async (transaction: EntityManager) => {
            const deleteCurso =  await this.institucionEducativaCursoRepository.deleteCursoOferta(
              id,
              transaction
            )
            return deleteCurso;
          }
          const crearResult = await this.institucionEducativaCursoRepository.runTransaction(op)

          if(crearResult){
              return this._serviceResp.respuestaHttp201(
                  '',
                  'Borrados datos de Curso y Oferta  !!',
                  '',
              );
          }  
    }
    
}
