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
    async crearPromedioCalificacionByAulaId (id:number, regimen:number) {
      
        //const datoAulaRegimen = await this.aulaRepository.getDatoAulaPeriodo(id);
        //sacamos el ultimo docente del aula
        const docente = await this.aulaRepository.getDatoAulaDocente(id);

        if(regimen==55){ //anual
            const promediosAnuales = await this.inscDocenteCalificacionRepositorio.findAllPromedioAnualByAulaId(id);
            if(promediosAnuales.length>0){
                const op = async (transaction: EntityManager) => {
                  //  const datoPromedio = 

                    const promedios = await this.inscDocenteCalificacionRepositorio.crearPromedios(
                        1, 
                        promediosAnuales, 
                        docente.docente_id,
                        8,
                        transaction
                    );
                    return promedios;
                }
                const crearResult = await this.inscDocenteCalificacionRepositorio.runTransaction(op)
            }
        }
        if(regimen<55){ //semestral
            const promediosSemestrales = await this.inscDocenteCalificacionRepositorio.findAllPromedioSemestralByAulaId(id);
            if(promediosSemestrales.length>0){
                const op = async (transaction: EntityManager) => {
                  //  const datoPromedio = 

                    const promedios = await this.inscDocenteCalificacionRepositorio.crearPromedios(
                        1, 
                        promediosSemestrales, 
                        docente.docente_id,
                        7,
                        transaction
                    );
                    return promedios;
                }
                const crearResult = await this.inscDocenteCalificacionRepositorio.runTransaction(op)
            }
        }
       return "exito";
    }     
    async createUpdatePromedioCalificacionByAulaId (id:number, periodo:number) {
      
        //const datoAulaRegimen = await this.aulaRepository.getDatoAulaPeriodo(id);
        //sacamos el ultimo docente del aula
        const docente = await this.aulaRepository.getDatoAulaDocente(id);

        if(periodo==55){ //anual
            console.log("anual");
            const promediosAnuales = await this.inscDocenteCalificacionRepositorio.findAllPromedioAnualByAulaId(id);
            promediosAnuales.forEach(async item => {
                //console.log(item);
                const datoPromedio = await this.inscDocenteCalificacionRepositorio.findPromedioByDato(item,8);
           
                const op = async (transaction: EntityManager) => {
                //console.log(datoCalificacion);
                    if(datoPromedio){
                           await this.inscDocenteCalificacionRepositorio.actualizarDatosCalificaciones(
                            datoPromedio.id,
                            1,
                            item,
                            transaction
                        )
                    }
                    if(!datoPromedio){
                          await this.inscDocenteCalificacionRepositorio.crearOneInscripcionDocenteCalificacion(
                                1,
                                item,
                                8,
                                docente.aula_docente_id,
                                transaction
                            );
                     }
                  
                }
                const crearResult = await this.inscDocenteCalificacionRepositorio.runTransaction(op);
                console.log(crearResult);
             });
           
        }

        if(periodo<55){ //semestral
           // console.log("semestral");
            const promediosSemestrales = await this.inscDocenteCalificacionRepositorio.findAllPromedioSemestralByAulaId(id);
            console.log(promediosSemestrales);
            promediosSemestrales.forEach(async item => {
                const datoPromedio = await this.inscDocenteCalificacionRepositorio.findPromedioByDato(item,7);
                console.log(datoPromedio);
                const op = async (transaction: EntityManager) => {
                //console.log(datoCalificacion);
                    if(datoPromedio){
                        console.log("actualiza sem");
                           await this.inscDocenteCalificacionRepositorio.actualizarDatosCalificaciones(
                            datoPromedio.id,
                            1,
                            item,
                            transaction
                        )
                    }
                    if(!datoPromedio){
                        console.log("nuevo sem");
                          await this.inscDocenteCalificacionRepositorio.crearOneInscripcionDocenteCalificacion(
                                1,
                                item,
                                7,
                                docente.aula_docente_id,
                                transaction
                            );
                     }
                  
                }
                    const crearResult = await this.inscDocenteCalificacionRepositorio.runTransaction(op);

                  console.log(crearResult);
             });
           
        }
        return this._serviceResp.respuestaHttp201(
            "",
            'Promedios actualizados correctamente!!',
            '',
        );
    }   

    async updateEstadosFinalesByAulaId (id:number) {
        console.log("update estados");

        const estadosFinales = await this.inscDocenteCalificacionRepositorio.findAllEstadosFinalesByAulaId(id);
        if(estadosFinales.length > 0){
            estadosFinales.forEach(async item => {
                await this.inscDocenteCalificacionRepositorio.actualizaEstadoMatricula(
                    item.instituto_estudiante_inscripcion_id,
                    item.estado);
                }
            );
        }
        return this._serviceResp.respuestaHttp201(
            "",
            'Estados Finales actualizados!!',
            '',
        );
    }   
    
    
   
    verificaCalificaciones(calificaciones, dto) {

        const nuevos = dto.filter(d =>
            calificaciones.some(p =>  d.instituto_estudiante_inscripcion_id == p.institutoEstudianteInscripcionId &&  d.nota_tipo_id!=p.notaTipoId)
           // calificaciones.every((p) =>  (p.institutoEstudianteInscripcionId == d.instituto_estudiante_inscripcion_id ) )
         );
         const existentes = dto.filter((d) =>
         calificaciones.some(p =>  d.instituto_estudiante_inscripcion_id == p.institutoEstudianteInscripcionId &&  d.nota_tipo_id==p.notaTipoId)
         );
         const activos = calificaciones
         .map((c) =>
         dto.every(
             (d) =>
               d.instituto_estudiante_inscripcion_id == c.institutoEstudianteInscripcionId && d.nota_tipo_id != c.notaTipoId
           )    
         )
        return  nuevos;
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

         dto.forEach(async item => {
        
          //console.log(item);
          const datoCalificacion = await this.inscDocenteCalificacionRepositorio.findCalificacionesByDato(item);
     
          const op = async (transaction: EntityManager) => {
          //console.log(datoCalificacion);
              if(datoCalificacion){
                  await this.inscDocenteCalificacionRepositorio.actualizarDatosCalificaciones(
                      datoCalificacion.id,
                      1,
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
           
       });

        console.log(resultado);
           return this._serviceResp.respuestaHttp201(
               dto,
               'Calificaciones creado y/o actualizado correctamente !!',
               '',
           );
     
 }



}
