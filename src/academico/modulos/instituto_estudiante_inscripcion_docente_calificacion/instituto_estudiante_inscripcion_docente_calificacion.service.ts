import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitutoEstudianteInscripcion } from 'src/academico/entidades/InstitutoEstudianteInscripcion.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager, Repository } from 'typeorm';
import { AulaRepository } from '../aula/aula.repository';
import { CreateInstitutoInscripcionDocenteCalificacionDto } from './dto/createInstitutoInscripcionDocenteCalificacion.dto';
import { InstitutoEstudianteInscripcionDocenteCalificacionRepository } from './instituto_estudiante_inscripcion_docente_calificacion.repository';

@Injectable()
export class InstitutoEstudianteInscripcionDocenteCalificacionService {
    constructor(
        @Inject(InstitutoEstudianteInscripcionDocenteCalificacionRepository)
        private inscDocenteCalificacionRepositorio: InstitutoEstudianteInscripcionDocenteCalificacionRepository,
        
        @Inject(AulaRepository) 
        private aulaRepository: AulaRepository,
        
        private _serviceResp: RespuestaSigedService
      ) {}
      async getAll() {
        const aulas = await this.inscDocenteCalificacionRepositorio.findAll();
        return aulas;
      }
      async getAllCalificacionesByAulaId(id:number){
        const aulas = await this.inscDocenteCalificacionRepositorio.findAllCalificacionesByAulaId(id);
        if(aulas.length > 0){
            return this._serviceResp.respuestaHttp201(
                aulas,
                'Existen resultados encontrados !!',
                '',
            );
        }
        return this._serviceResp.respuestaHttp404(
            "",
            'No se encontraron resultados!!',
            '',
        );

    }
    async getAllCalificacionesByInscripcionId(id:number){
        const aulas = await this.inscDocenteCalificacionRepositorio.findAllCalificacionesByInscripcionId(id);
        if(aulas.length > 0){
            return this._serviceResp.respuestaHttp201(
                aulas,
                'Existen resultados encontrados !!',
                '',
            );
        }
        return this._serviceResp.respuestaHttp404(
            "",
            'No se encontraron resultados!!',
            '',
        );

    }
    async getAllCalificacionesByInscripcionModalidadId(id:number,modalidad:number){
        const aulas = await this.inscDocenteCalificacionRepositorio.findAllCalificacionesByInscripcionModalidadId(id, modalidad);
        if(aulas.length > 0){
            return this._serviceResp.respuestaHttp201(
                aulas,
                'Existen resultados encontrados !!',
                '',
            );
        }
        return this._serviceResp.respuestaHttp404(
            "",
            'No se encontraron resultados!!',
            '',
        );

    }
    
    async getAllCalificacionesPromedioAnualByAulaId(id:number){
        const notas = await this.inscDocenteCalificacionRepositorio.findAllPromedioAnualByAulaId(id);
        if(notas.length > 0){
            return this._serviceResp.respuestaHttp201(
                notas,
                'Existen resultados encontrados !!',
                '',
            );
        }
        return this._serviceResp.respuestaHttp404(
            "",
            'No se encontraron resultados!!',
            '',
        );

    }
    async getAllCalificacionesPromedioSemestralByAulaId(id:number){
        const notas = await this.inscDocenteCalificacionRepositorio.findAllPromedioSemestralByAulaId(id);
        if(notas.length > 0){
            return this._serviceResp.respuestaHttp201(
                notas,
                'Existen resultados encontrados !!',
                '',
            );
        }
        return this._serviceResp.respuestaHttp404(
            "",
            'No se encontraron resultados!!',
            '',
        );

    }
   
    async createUpdatePromedioCalificacionByAulaId (id:number, periodo:number) {
      
        //const datoAulaRegimen = await this.aulaRepository.getDatoAulaPeriodo(id);
        //sacamos el ultimo docente del aula
        const docente = await this.aulaRepository.getDatoAulaDocente(id);
        const resultado = [];
        if(periodo==55){ //anual
            
            const promediosAnuales = await this.inscDocenteCalificacionRepositorio.findAllPromedioAnualByAulaId(id);
            for(const item of promediosAnuales)
             {
                //console.log(item);
                const datoPromedio = await this.inscDocenteCalificacionRepositorio.findPromedioByDato(item,8);
           
                const op = async (transaction: EntityManager) => {
                //console.log(datoCalificacion);
                    if(datoPromedio){
                         const actualizados =  await this.inscDocenteCalificacionRepositorio.actualizarDatosCalificaciones(
                            datoPromedio.id,
                            item,
                            transaction
                        )
                        resultado.push(actualizados);
                    }
                    if(!datoPromedio){
                        const nuevos = await this.inscDocenteCalificacionRepositorio.crearOneInscripcionDocenteCalificacion(
                                1,
                                item,
                                8,
                                docente.aula_docente_id,
                                transaction
                            );
                            resultado.push(nuevos);
                     }
                }
                await this.inscDocenteCalificacionRepositorio.runTransaction(op);
             }
        }

        if(periodo<55){ //semestral
           // console.log("semestral");
            const promediosSemestrales = await this.inscDocenteCalificacionRepositorio.findAllPromedioSemestralByAulaId(id);
            
            for(const item of promediosSemestrales)
            {
                const datoPromedio = await this.inscDocenteCalificacionRepositorio.findPromedioByDato(item,7);
                
                const op = async (transaction: EntityManager) => {
                //console.log(datoCalificacion);
                    if(datoPromedio){
                        
                        const actualizados = await this.inscDocenteCalificacionRepositorio.actualizarDatosCalificaciones(
                            datoPromedio.id,
                            item,
                            transaction
                        )
                        resultado.push(actualizados);
                    }
                    if(!datoPromedio){
                        
                        const nuevos =  await this.inscDocenteCalificacionRepositorio.crearOneInscripcionDocenteCalificacion(
                                1,
                                item,
                                7,
                                docente.aula_docente_id,
                                transaction
                            );
                        resultado.push(nuevos);
                     }                  
                }
                    await this.inscDocenteCalificacionRepositorio.runTransaction(op);
             }
        }
        return resultado;
    }   

    async updateEstadosFinalesByAulaId (id:number) {
        console.log("update estados");
        const resultado = [];
        const estadosFinales = await this.inscDocenteCalificacionRepositorio.findAllEstadosFinalesByAulaId(id);
        if(estadosFinales.length > 0){
            for (const item of estadosFinales){
               const estados = await this.inscDocenteCalificacionRepositorio.actualizaEstadoMatricula(
                    item.instituto_estudiante_inscripcion_id,
                    item.estado);
                    resultado.push(estados);
            }
        }
        return resultado;
    }   
    
    
   
    
    //Registro de calificaciones en formato de array
    async crearInscripcionDocenteCalificacionArray (dto: CreateInstitutoInscripcionDocenteCalificacionDto[]) {
      
          const op = async (transaction: EntityManager) => {
              const nuevo = await this.inscDocenteCalificacionRepositorio.crearInscripcionDocenteCalificacion(
                  1, 
                  dto, 
                  transaction
              );
            return nuevo;
          }
          const crearResult = await this.inscDocenteCalificacionRepositorio.runTransaction(op)
          if(crearResult.length>0){
            return this._serviceResp.respuestaHttp201(
                crearResult,
                'Registro Creado !!',
                '',
            );
          }
          return this._serviceResp.respuestaHttp500(
            "",
            'No se pudo guardar la información !!',
            '',
        );
    }
   

   async crearInscripcionDocenteCalificacion (dto: CreateInstitutoInscripcionDocenteCalificacionDto[]) {
     
    console.log("calificaciones");
    const resultado = [];

        for (const item of dto) {
        
          //console.log(item);
          const datoCalificacion = await this.inscDocenteCalificacionRepositorio.findCalificacionesByDato(item);
     
          const op = async (transaction: EntityManager) => {
          //console.log(datoCalificacion);
              if(datoCalificacion){
                  await this.inscDocenteCalificacionRepositorio.actualizarDatosCalificaciones(
                      datoCalificacion.id,
                      item,
                      transaction
                  )
              }
              if(!datoCalificacion){
                 await this.inscDocenteCalificacionRepositorio.crearOneInscripcionDocenteCalificacion(
                              1,
                          item,
                          item.modalidad_evaluacion_tipo_id,
                          item.aula_docente_id,
                          transaction
                      );
               }
            
          }
            const crearResult = await this.inscDocenteCalificacionRepositorio.runTransaction(op);
            ///revisamos los promedios de los estudiantes en la ultima calificación
            console.log(crearResult);
           
       }

        console.log(resultado);
           return this._serviceResp.respuestaHttp201(
               dto,
               'Calificaciones creado y/o actualizado correctamente !!',
               '',
           );
     
 }
 async crearNotasModalidad (dto: CreateInstitutoInscripcionDocenteCalificacionDto[]) {
        console.log("calificaciones");
        const resultado = [];
         for (const item of dto) {
          const datoCalificacion = await this.inscDocenteCalificacionRepositorio.findCalificacionesByDato(item);
     
          const op = async (transaction: EntityManager) => {
          //console.log(datoCalificacion);
              if(datoCalificacion){
                 const actualizados =  await this.inscDocenteCalificacionRepositorio.actualizarDatosCalificaciones(
                      datoCalificacion.id,
                      item,
                      transaction
                  )
                  resultado.push(actualizados);
              }
              if(!datoCalificacion){
                const nuevos =  await this.inscDocenteCalificacionRepositorio.crearOneInscripcionDocenteCalificacion(
                              1,
                          item,
                          item.modalidad_evaluacion_tipo_id,
                          item.aula_docente_id,
                          transaction
                      );
                  resultado.push(nuevos);
               }
            
          }
            await this.inscDocenteCalificacionRepositorio.runTransaction(op);
       }
       console.log(resultado.length)
       return resultado;
        
 }
 async crearInscripcionDocenteCalificacionGlobal (dto: CreateInstitutoInscripcionDocenteCalificacionDto[]) {
     
          const notas = await this.crearNotasModalidad(dto);
          const promedios = await this.createUpdatePromedioCalificacionByAulaId(dto[0].aula_id,dto[0].periodo_tipo_id );
          await this.updateEstadosFinalesByAulaId(dto[0].aula_id);
         if(notas.length>0){
            if(promedios.length>0){
                return this._serviceResp.respuestaHttp201(
                    notas,
                    'Calificaciones y Promedios  actualizados correctamente !!',
                    '',
                );
            }else{
                return this._serviceResp.respuestaHttp201(
                    notas,
                    'Calificaciones registrados/actualizados correctamente !!',
                    '',
                );
            }
        }
        return this._serviceResp.respuestaHttp500(
            "",
            'No se pudo guardar la información !!',
            '',
        );
 }



}
