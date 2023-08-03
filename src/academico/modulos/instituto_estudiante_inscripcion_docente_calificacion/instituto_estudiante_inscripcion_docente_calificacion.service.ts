import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitutoEstudianteInscripcion } from 'src/academico/entidades/InstitutoEstudianteInscripcion.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager, Repository } from 'typeorm';
import { AulaRepository } from '../aula/aula.repository';
import { CreateInstitutoInscripcionDocenteCalificacionDto } from './dto/createInstitutoInscripcionDocenteCalificacion.dto';
import { InstitutoEstudianteInscripcionDocenteCalificacionRepository } from './instituto_estudiante_inscripcion_docente_calificacion.repository';
import { User as UserEntity } from 'src/users/entity/users.entity';
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
   
    async createUpdatePromedioCalificacionByAulaId (id:number, periodo:number, docente:number, user:UserEntity) {
      
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
                    7);
           
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
                        let valoracion = 1;
                        if(item.modalidad_evaluacion_tipo_id==9){ //cuando es recuperacion
                            valoracion = 5;
                        }
                        const nuevos = await this.inscDocenteCalificacionRepositorio.crearOneInscripcionDocenteCalificacion(
                                user.id,
                                item,
                                7,
                                docente,
                                item.nota_tipo_id,
                                valoracion,
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
                const datoPromedio = await this.inscDocenteCalificacionRepositorio.findPromedioByDato(
                    item.nota_tipo_id, 
                    item.periodo_tipo_id, 
                    item.instituto_estudiante_inscripcion_id,
                7);
                
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
                        let valoracion = 1;
                        if(item.modalidad_evaluacion_tipo_id==9){ //cuando es recuperacion
                            valoracion = 5;
                        }
                        
                        const nuevos =  await this.inscDocenteCalificacionRepositorio.crearOneInscripcionDocenteCalificacion(
                                user.id,
                                item,
                                7,
                                docente,
                                item.nota_tipo_id,
                                valoracion,
                                transaction
                            );
                        resultado.push(nuevos);
                     }                  
                }
                    await this.inscDocenteCalificacionRepositorio.runTransaction(op);
             }
        }
            await this.createUpdateSumaCalificacionByAulaId(id, 7,docente, user.id); // insertamos nota final
        return resultado;
    }   
    
    async createUpdateRecuperatorioFinalByAulaId (id:number, periodo_tipo:number, modalidad:number, docente:number) {
        const resultado = [];
        const recuperatorios = await this.inscDocenteCalificacionRepositorio.findAllRecuperatotiosByAulaId(id);

        for(const item of recuperatorios)
        {
           //console.log(item); actualizamos la nota promedio poniendole el minimo de 61
           const dato = await this.inscDocenteCalificacionRepositorio.findPromedioByDato(
            7, 
            item.periodo_tipo_id, 
            item.instituto_estudiante_inscripcion_id,
            7);
          
           const op = async (transaction: EntityManager) => {
           //console.log(datoCalificacion);
           let item = {
            'cuantitativa' : 61
           }
               if(dato){
                    const actualizados =  await this.inscDocenteCalificacionRepositorio.actualizarDatosCalificaciones(
                       dato.id,
                       item,
                       transaction
                   )
                   resultado.push(actualizados);
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
   

 //modulo para sumar las notas parcilas de teoria y practica
 async createUpdateSumaCalificacionByAulaId (id:number, modalidad_tipo:number, docente:number, usuarioId:number) {
    const resultado = [];

    //obtenemos la suma de las notas de todos los estudiantes de esa aula bajo la modalidad
    const sumaPromedios = await this.inscDocenteCalificacionRepositorio.findAllSubtotalByAulaId(id, modalidad_tipo);

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
            let valoracion = 1; //nota normal
            if(item.modalidad_evaluacion_tipo_id == 9){ //cuando es recuperacion
                valoracion = 5; // nota 
            }
            
               const nuevos = await this.inscDocenteCalificacionRepositorio.crearOneInscripcionDocenteCalificacion(
                       usuarioId,
                       item,
                       modalidad_tipo,
                       docente,
                       7,
                       valoracion,
                       transaction
                   );
                   resultado.push(nuevos);
            }
       }
       await this.inscDocenteCalificacionRepositorio.runTransaction(op);
    }

    return resultado;
} 
 //modulo para insertar las notas
 async crearNotasModalidad (dto: CreateInstitutoInscripcionDocenteCalificacionDto[], user:UserEntity) {
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
                let valoracion = 1;
                if(item.modalidad_evaluacion_tipo_id == 9){ //cuando es recuperacion
                    valoracion = 5;
                }
                const nuevos =  await this.inscDocenteCalificacionRepositorio.crearOneInscripcionDocenteCalificacion(
                          user.id,
                          item,
                          item.modalidad_evaluacion_tipo_id,
                          item.aula_docente_id,
                          item.nota_tipo_id,
                          valoracion,
                          transaction
                      );
                  resultado.push(nuevos);
               }
            
          }
            await this.inscDocenteCalificacionRepositorio.runTransaction(op);
       }
       if(resultado.length>0){
        //insertamos la suma de las notas parciales normales
            await this.createUpdateSumaCalificacionByAulaId(
                dto[0].aula_id, 
                dto[0].modalidad_evaluacion_tipo_id,
                dto[0].aula_docente_id, 
                user.id);
       }
       console.log(resultado.length)
       return resultado;
 }


 async crearInscripcionDocenteCalificacionGlobal (dto: CreateInstitutoInscripcionDocenteCalificacionDto[], user:UserEntity) {
     
          const notas = await this.crearNotasModalidad(dto, user); //registramos las calificaciones y sus sumas remitido por array

            if ( dto[0].modalidad_evaluacion_tipo_id == 9){ //si son notas recuperatorias
                await this.createUpdateRecuperatorioFinalByAulaId(dto[0].aula_id, dto[0].periodo_tipo_id, dto[0].modalidad_evaluacion_tipo_id, dto[0].aula_docente_id );
            }else{ // si son notas normales
                await this.createUpdatePromedioCalificacionByAulaId(dto[0].aula_id, dto[0].periodo_tipo_id, dto[0].aula_docente_id, user );
            }
           
          await this.updateEstadosFinalesByAulaId(dto[0].aula_id);

         if(notas.length>0){
                return this._serviceResp.respuestaHttp201(
                    notas,
                    'Calificaciones y Promedios  actualizados correctamente !!',
                    '',
                );
        }
        return this._serviceResp.respuestaHttp500(
            "",
            'No se pudo guardar la información !!',
            '',
        );
 }



}
