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
   
    async createUpdatePromedioCalificacionByAulaId (id:number, periodo:number, docente:number) {
      
        //const datoAulaRegimen = await this.aulaRepository.getDatoAulaPeriodo(id);
        //sacamos el ultimo docente del aula
        //const docente = await this.aulaRepository.getDatoAulaDocente(id);
        const resultado = [];
        if(periodo==55){ //anual
            
            const promediosAnuales = await this.inscDocenteCalificacionRepositorio.findAllPromedioAnualByAulaId(id);
            for(const item of promediosAnuales)
             {
                //console.log(item);
                const datoPromedio = await this.inscDocenteCalificacionRepositorio.findPromedioByDato(
                    item.nota_tipo_id, 
                    item.periodo_tipo_id, 
                    item.instituto_estudiante_inscripcion_id,
                8);
           
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
                                docente,
                                item.nota_tipo_id,
                                transaction
                            );
                            resultado.push(nuevos);
                     }
                }
                await this.inscDocenteCalificacionRepositorio.runTransaction(op);
             }
             if(resultado.length>0)
                await this.createUpdateSumaCalificacionByAulaId(id, 7,docente);
        }

        if(periodo<55){ //semestral
           // console.log("semestral");
            const promediosSemestrales = await this.inscDocenteCalificacionRepositorio.findAllPromedioSemestralByAulaId(id);
            
            for(const item of promediosSemestrales)
            {
                const datoPromedio = await this.inscDocenteCalificacionRepositorio.findPromedioByDato(
                    item.nota_tipo_id, 
                    item.periodo_tipo_id, 
                    item.instituto_estudiante_inscripcion_id,
                8);
                
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
                                docente,
                                item.nota_tipo_id,
                                transaction
                            );
                        resultado.push(nuevos);
                     }                  
                }
                    await this.inscDocenteCalificacionRepositorio.runTransaction(op);
             }
             if(resultado.length>0)
                await this.createUpdateSumaCalificacionByAulaId(id, 8,docente);
        }

        return resultado;
    }   

    async createUpdateSumaCalificacionByAulaId (id:number, modalidad:number, docente:number) {
      
        //const datoAulaRegimen = await this.aulaRepository.getDatoAulaPeriodo(id);
        //sacamos el ultimo docente del aula
      //  const docente = await this.aulaRepository.getDatoAulaDocente(id);
        //let modalidad_tipo = 0;
        /*switch (modalidad) {
            case (1): modalidad_tipo = 9; break;
            case (2): modalidad_tipo = 10; break;
            case (3): modalidad_tipo = 12; break;
            case (4): modalidad_tipo = 13; break;
            case (5): modalidad_tipo = 14; break;
            case (6): modalidad_tipo = 15; break;
            case (7): modalidad_tipo = 11; break;
            case (8): modalidad_tipo = 16; break;
          }*/
          let modalidad_tipo = modalidad;
        const resultado = [];
        //ontenemos la suma de las notas de todos los estudiantes de esa aula bajo la modalidad
        const sumaPromedios = await this.inscDocenteCalificacionRepositorio.findAllSubtotalByAulaId(id, modalidad);
        for(const item of sumaPromedios)
        {
           //console.log(item);
           const dato = await this.inscDocenteCalificacionRepositorio.findPromedioByDato(
            7, 
            item.periodo_tipo_id, 
            item.instituto_estudiante_inscripcion_id,
            modalidad_tipo);
      
           const op = async (transaction: EntityManager) => {
           //console.log(datoCalificacion);
               if(dato){
                    const actualizados =  await this.inscDocenteCalificacionRepositorio.actualizarDatosCalificaciones(
                       dato.id,
                       item,
                       transaction
                   )
                   resultado.push(actualizados);
               }
               if(!dato){
                
                   const nuevos = await this.inscDocenteCalificacionRepositorio.crearOneInscripcionDocenteCalificacion(
                           1,
                           item,
                           modalidad_tipo,
                           docente,
                           7,
                           transaction
                       );
                       resultado.push(nuevos);
                }
           }
           await this.inscDocenteCalificacionRepositorio.runTransaction(op);
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
                          item.nota_tipo_id,
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
 //modulo para insertar las notas
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
                          item.nota_tipo_id,
                          transaction
                      );
                  resultado.push(nuevos);
               }
            
          }
            await this.inscDocenteCalificacionRepositorio.runTransaction(op);
       }
       if(resultado.length>0){
        //insertamos la suma
            await this.createUpdateSumaCalificacionByAulaId(dto[0].aula_id, dto[0].modalidad_evaluacion_tipo_id,dto[0].aula_docente_id);
       }
       console.log(resultado.length)

       return resultado;
        
 }
 async crearInscripcionDocenteCalificacionGlobal (dto: CreateInstitutoInscripcionDocenteCalificacionDto[]) {
     
          const notas = await this.crearNotasModalidad(dto); //registramos las calificaciones remitidos por array
          //const subtotales = await this.createUpdateSumaCalificacionByAulaId(dto[0].aula_id, dto[0].modalidad_evaluacion_tipo_id);
          const promedios = await this.createUpdatePromedioCalificacionByAulaId(dto[0].aula_id, dto[0].periodo_tipo_id, dto[0].aula_docente_id );
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
