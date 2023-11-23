import { PlanEstudioCarrera } from './../../entidades/planEstudioCarrera.entity';
import { EstadoMatriculaTipo } from './../../entidades/estadoMatriculaTipo.entity';
import { ModalidadEvaluacionTipo } from 'src/academico/entidades/modalidadEvaluacionTipo.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitutoEstudianteInscripcion } from 'src/academico/entidades/InstitutoEstudianteInscripcion.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager, Repository } from 'typeorm';
import { AulaRepository } from '../aula/aula.repository';
import { CreateInstitutoInscripcionDocenteCalificacionDto } from './dto/createInstitutoInscripcionDocenteCalificacion.dto';
import { InstitutoEstudianteInscripcionDocenteCalificacionRepository } from './instituto_estudiante_inscripcion_docente_calificacion.repository';
import { User as UserEntity } from 'src/users/entity/users.entity';
import { Aula } from 'src/academico/entidades/aula.entity';
import { OperativoCarreraAutorizada } from 'src/academico/entidades/operativoCarreraAutorizada.entity';
import { InstitutoEstudianteInscripcionDocenteCalificacion } from 'src/academico/entidades/institutoEstudianteInscripcionDocenteCalificacion.entity';
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
@Injectable()
export class InstitutoEstudianteInscripcionDocenteCalificacionService {
    constructor(
        @Inject(InstitutoEstudianteInscripcionDocenteCalificacionRepository)
        private inscDocenteCalificacionRepositorio: InstitutoEstudianteInscripcionDocenteCalificacionRepository,
        
        @InjectRepository(Aula)
        private aulaRepository: Repository<Aula>,

        @InjectRepository(InstitutoEstudianteInscripcion)
        private institutoEstudianteInscripcionRepository: Repository<InstitutoEstudianteInscripcion>,

        @InjectRepository(OperativoCarreraAutorizada)
        private operativoCarreraRepository: Repository<OperativoCarreraAutorizada>,

        @InjectRepository(CarreraAutorizada)
        private carreraAutorizadaRepository: Repository<CarreraAutorizada>,

        @InjectRepository(InstitutoEstudianteInscripcionDocenteCalificacion)
        private calificacionesRepository: Repository<InstitutoEstudianteInscripcionDocenteCalificacion>,

        
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

 async registroNotaByAulaId(aula_id, carrera_autorizada_id)
 {
    const students = await this.institutoEstudianteInscripcionRepository.find(
        {
            relations: {
                matriculaEstudiante: {
                    institucionEducativaEstudiante:{
                        persona:true
                    },
                    
                },
                estadoMatriculaTipo: true,
            },
            select: {
                id: true,
                matriculaEstudiante: {
                    id: true,
                    institucionEducativaEstudiante: {
                        id: true,
                        persona: {
                            carnetIdentidad: true,
                            complemento: true,
                            nombre: true,
                            paterno: true,
                            materno:true
                        }
                    },
                    
                },
                estadoMatriculaTipo:{
                    id: true,
                    estadoMatricula: true,
                }
            },
            where: { aulaId: aula_id}, 
            take : 10,           
        }
    )

    const operativos = await this.operativoCarreraRepository.find({
        relations: {
            periodoTipo: true,
            eventoTipo: true,
            modalidadEvaluacionTipo: true,
        },
        select:{
            id: true,
            periodoTipo: {
                id: true,
                periodo: true,
            },
            eventoTipo: {
                id: true,
                evento: true,
            },
            modalidadEvaluacionTipo: {
                id:true,
                modalidadEvaluacion: true,
            }
        },  
        where: {
            carreraAutorizadaId:carrera_autorizada_id,
            eventoTipoId: 2,//calificaciones
        }

    })

    const carrera_autorizada = await this.carreraAutorizadaRepository.findOne({
        relations: {
            institucionEducativaSucursal: {
                institucionEducativa: true,
            },
            // areaTipo: true, //dato no correcto
            carreraTipo: true,
        },
        where: { id: carrera_autorizada_id }
    })

    const aula = await this.aulaRepository.findOne({
        relations:{
            paraleloTipo: true,
            ofertaCurricular:{
                planEstudioAsignatura:{
                    asignaturaTipo: true,
                    planEstudioCarrera:{
                        planEstudioResolucion: true,
                    },
                    regimenGradoTipo: true,
                },
                
            }
        },
        where: {id:aula_id}
    })

    console.log('aula', aula)
    console.log(carrera_autorizada)

    console.log(operativos)
    let ids = []
    for( const operativo  of operativos)
    {
        ids.push(operativo.modalidadEvaluacionTipo.id)
    }
    console.log('IDS ====>',ids)
    const registro_notas = []


    for(const student of students)
    {

        let calificaciones = await this.calificacionesRepository.find({
            relations: {
                notaTipo:true,
                modalidadEvaluacionTipo: true
            },
            select:{
                id:true,
                cuantitativa: true,
                notaTipo:{
                    id: true,
                    nota: true,
                },
                modalidadEvaluacionTipo: {
                    id: true,
                    modalidadEvaluacion: true
                }
            },
            where:{ institutoEstudianteInscripcionId: student.id },
            order:{
                modalidadEvaluacionTipoId : 'ASC',
                notaTipoId: 'ASC'
            }
        })
        let notas = []
        let count = 0
        for( const id of ids)
        {
            count = 0
            for(const calificacion of calificaciones)
            {
                if(calificacion.modalidadEvaluacionTipo.id == id)
                {
                    notas.push({
                        cuantitativa: calificacion.cuantitativa,
                        modalidad_evaluacion: calificacion.modalidadEvaluacionTipo.modalidadEvaluacion,
                        nota_tipo: calificacion.notaTipo.nota
                    })
                    count++;
                }
            }
            while(count < 3)
            {
                notas.push({
                    cuantitativa: '-' ,
                    modalidad_evaluacion: 'sin modalidad',
                    nota_tipo: 'sin nota'
                })
                count++
            }
        }
        // let calificaciones = await this.calificacionesRepository.createQueryBuilder
        
        // console.log('calificaciones', calificaciones)

        let registro = {
            ci: student.matriculaEstudiante.institucionEducativaEstudiante.persona.carnetIdentidad,
            nombre: `${student.matriculaEstudiante.institucionEducativaEstudiante.persona.paterno} ${student.matriculaEstudiante.institucionEducativaEstudiante.persona.materno} ${student.matriculaEstudiante.institucionEducativaEstudiante.persona.nombre} `,
            estado: student.estadoMatriculaTipo.estadoMatricula,
            notas: notas
        }

        registro_notas.push(registro)
    }

    return {
        operativos: operativos,
        estudiantes: registro_notas ,
        aula: aula,
        carrera_autorizada: carrera_autorizada,
    } 
 }


}
