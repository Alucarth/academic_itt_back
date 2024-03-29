import { NotFoundException } from '@nestjs/common';
import { IntervaloGestionTipo } from './../../entidades/intervaloGestionTipo.entity';
import { PlanEstudioCarrera } from './../../entidades/planEstudioCarrera.entity';
import { EstadoMatriculaTipo } from './../../entidades/estadoMatriculaTipo.entity';
import { ModalidadEvaluacionTipo } from 'src/academico/entidades/modalidadEvaluacionTipo.entity';
import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitutoEstudianteInscripcion } from 'src/academico/entidades/InstitutoEstudianteInscripcion.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager, In, Repository } from 'typeorm';
import { AulaRepository } from '../aula/aula.repository';
import { CreateInstitutoInscripcionDocenteCalificacionDto, NewInstitutoInscripcionDocenteCalificacionDto } from './dto/createInstitutoInscripcionDocenteCalificacion.dto';
import { InstitutoEstudianteInscripcionDocenteCalificacionRepository } from './instituto_estudiante_inscripcion_docente_calificacion.repository';
import { User, User as UserEntity } from 'src/users/entity/users.entity';
import { Aula } from 'src/academico/entidades/aula.entity';
import { OperativoCarreraAutorizada } from 'src/academico/entidades/operativoCarreraAutorizada.entity';
import { InstitutoEstudianteInscripcionDocenteCalificacion } from 'src/academico/entidades/institutoEstudianteInscripcionDocenteCalificacion.entity';
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
import { Persona } from 'src/users/entity/persona.entity';
import { MasiveCreateTeacherCalification } from './dto/masiveCreateTeacherCalification.dto';
import { CreateTeacherCalification } from './dto/CreateTeacherCalification.dto';
import { log } from 'console';
import { OfertaCurricular } from 'src/academico/entidades/ofertaCurricular.entity';
import { NewOfertaCurricularDTO } from '../oferta_curricular/dto/newOfertaCurricular.dto';
import { NewAulaDTO } from '../aula/dto/newAula.dto';
import { CreateInstitutoEstudianteInscripcion } from './dto/createInstitutoEstudianteInscripcion .dto';
import { MaestroInscripcion } from 'src/academico/entidades/maestroInscripcion.entity';
import { AulaDocente } from 'src/academico/entidades/aulaDocente.entity';
import { CreateAulaDocenteDto, NewAulaDocenteDto } from '../aula_docente/dto/createAulaDocente.dto';
import { HomologadosGestionEstudiante } from 'src/academico/entidades/homologadosGestionEstudiante.entity';
import { fromPascal } from 'postgres';
import { CreateHomologationGestionEstudiante } from './dto/createHomologationGestionEstudiante.dto';
@Injectable()
export class InstitutoEstudianteInscripcionDocenteCalificacionService {
    constructor(
        @Inject(InstitutoEstudianteInscripcionDocenteCalificacionRepository)
        private inscDocenteCalificacionRepositorio: InstitutoEstudianteInscripcionDocenteCalificacionRepository,
        
        @InjectRepository(Aula)
        private aulaRepository: Repository<Aula>,

        @InjectRepository(InstitutoEstudianteInscripcion)
        private institutoEstudianteInscripcionRepository: Repository<InstitutoEstudianteInscripcion>,

        @InjectRepository(OfertaCurricular)
        private ofertaCurricularRepository: Repository<OfertaCurricular>,

        @InjectRepository(OperativoCarreraAutorizada)
        private operativoCarreraRepository: Repository<OperativoCarreraAutorizada>,

        @InjectRepository(CarreraAutorizada)
        private carreraAutorizadaRepository: Repository<CarreraAutorizada>,

        @InjectRepository(MaestroInscripcion)
        private maestroInscripcionRepository: Repository<MaestroInscripcion>,

        @InjectRepository(AulaDocente)
        private aulaDocenteRepository: Repository<AulaDocente>,

        @InjectRepository(InstitutoEstudianteInscripcionDocenteCalificacion)
        private teacherCalificationRepository: Repository<InstitutoEstudianteInscripcionDocenteCalificacion>,

        @InjectRepository(HomologadosGestionEstudiante)
        private homologadosGestionEstudianteRepository: Repository<HomologadosGestionEstudiante>,

        @InjectRepository(Persona)
        private personaRepository: Repository<Persona>,

        
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
           console.log('actualizar registros',item); //actualizamos la nota promedio poniendole el minimo de 61
           const dato = await this.inscDocenteCalificacionRepositorio.findPromedioByDato(
            7, 
            item.periodo_tipo_id, 
            item.instituto_estudiante_inscripcion_id,
            7);
            console.log(dato)
           console.log('cuantitativa ',item.cuantitativa);
           let total = parseFloat(item.total)
         
            if(total>=61 && total <=100) /* condicional para actualizar registro de recuperatorio*/
            {
                /*iniando transaccion */
                const op = async (transaction: EntityManager) => {
                console.log('dato ', dato);
             //    console.log(item)
                
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
                /** finalizando transaccion */
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

        await Promise.all( dto.map(async (item) => {
            const datoCalificacion =  await this.inscDocenteCalificacionRepositorio.findCalificacionesByDato(item);

            const op = async (transaction: EntityManager) => {
              //console.log(datoCalificacion);
              if (datoCalificacion) {
                const actualizados =
                  await this.inscDocenteCalificacionRepositorio.actualizarDatosCalificaciones(
                    datoCalificacion.id,
                    item,
                    transaction
                  );
                resultado.push(actualizados);
              }
              if (!datoCalificacion) {
                let valoracion = 1;
                if (item.modalidad_evaluacion_tipo_id == 9) {
                  //cuando es recuperacion
                  valoracion = 5;
                }
                const nuevos = await this.inscDocenteCalificacionRepositorio.crearOneInscripcionDocenteCalificacion(
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
            };
            await this.inscDocenteCalificacionRepositorio.runTransaction(op);
          })
        );
       
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

//REGISTRO DE NOTAS AQUI
 async crearInscripcionDocenteCalificacionGlobal (dto: CreateInstitutoInscripcionDocenteCalificacionDto[], user:UserEntity) {

        console.log('dto',dto);
          const notas = await this.crearNotasModalidad(dto, user); //registramos las calificaciones y sus sumas remitido por array

            if ( dto[0].modalidad_evaluacion_tipo_id == 9){ //si son notas recuperatorias
                console.log('ingresando a modo recuperatorio', dto[0])
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

//  async registroYearNotaByAulaId(aula_id, carrera_autorizada_id, periodo_tipo_id)
//  {
//     const students = await this.institutoEstudianteInscripcionRepository.find(
//         {
//             relations: {
//                 matriculaEstudiante: {
//                     institucionEducativaEstudiante:{
//                         persona:true
//                     },
                    
//                 },
//                 estadoMatriculaTipo: true,
//             },
//             select: {
//                 id: true,
//                 matriculaEstudiante: {
//                     id: true,
//                     institucionEducativaEstudiante: {
//                         id: true,
//                         persona: {
//                             carnetIdentidad: true,
//                             complemento: true,
//                             nombre: true,
//                             paterno: true,
//                             materno:true
//                         }
//                     },
                    
//                 },
//                 estadoMatriculaTipo:{
//                     id: true,
//                     estadoMatricula: true,
//                 }
//             },
//             where: { aulaId: aula_id}, 
//             // take : 10,           
//         }
//     )

//     const operativos = await this.operativoCarreraRepository.find({
//         relations: {
//             periodoTipo: true,
//             eventoTipo: true,
//             modalidadEvaluacionTipo: true,
//         },
//         select:{
//             id: true,
//             periodoTipo: {
//                 id: true,
//                 periodo: true,
//             },
//             eventoTipo: {
//                 id: true,
//                 evento: true,
//             },
//             modalidadEvaluacionTipo: {
//                 id:true,
//                 modalidadEvaluacion: true,
//             }
//         },  
//         where: {
//             carreraAutorizadaId:carrera_autorizada_id,
//             eventoTipoId: 2,//calificaciones,
//             modalidadEvaluacionTipo: In([1,2,3,4,5,6,7,9]),
//             periodoTipoId: periodo_tipo_id
//         },
//         order: {
//             modalidadEvaluacionTipoId: 'ASC'
//         }

//     })

//     const carrera_autorizada = await this.carreraAutorizadaRepository.findOne({
//         relations: {
//             institucionEducativaSucursal: {
//                 institucionEducativa: true,
//             },
//             // areaTipo: true, //dato no correcto
//             carreraTipo: true,
//         },
//         where: { id: carrera_autorizada_id }
//     })

//     const aula = await this.aulaRepository.findOne({
//         relations:{
//             paraleloTipo: true,
//             ofertaCurricular:{
//                 periodoTipo:true,
//                 planEstudioAsignatura:{
//                     asignaturaTipo: true,
//                     planEstudioCarrera:{
//                         planEstudioResolucion: true,
//                     },
//                     regimenGradoTipo: true,
//                 },
                
//             },
//         },
//         where: {id:aula_id}
//     })

//     console.log('aula', aula)
//     console.log(carrera_autorizada)

//     console.log(operativos)
//     let ids = []
//     for( const operativo  of operativos)
//     {
//         ids.push(operativo.modalidadEvaluacionTipo.id)
//     }
//     console.log('IDS ====>',ids)
//     const registro_notas = []
//     let persona = null;

//     for(const student of students)
//     {

//         let calificaciones = await this.calificacionesRepository.find({
//             relations: {
//                 notaTipo:true,
//                 modalidadEvaluacionTipo: true,
//                 aulaDocente:{
//                     maestroInscripcion:{
//                         persona:true
//                     }
//                 }
//             },
//             select:{
//                 id:true,
//                 cuantitativa: true,
//                 notaTipo:{
//                     id: true,
//                     nota: true,
//                 },
//                 modalidadEvaluacionTipo: {
//                     id: true,
//                     modalidadEvaluacion: true
//                 },
//                 aulaDocente: {
//                     id:true,
//                     maestroInscripcion:{
//                         personaId: true,
//                     }
//                 }
//             },
//             where:{ institutoEstudianteInscripcionId: student.id, periodoTipoId: periodo_tipo_id },
//             order:{
//                 modalidadEvaluacionTipoId : 'ASC',
//                 notaTipoId: 'ASC'
//             }
//         })
//         let notas = []
//         let count = 0
//         for( const id of ids)
//         {
//             count = 0
//             for(const calificacion of calificaciones)
//             {
//                 if(!persona)
//                 {
//                     persona = await this.personaRepository.findOne({
//                         select:{
//                           carnetIdentidad:true,
//                           complemento: true,
//                           nombre: true,
//                           paterno: true,
//                           materno: true,
//                         },
//                         where:{ id: calificacion.aulaDocente.maestroInscripcion.personaId}
//                     })
//                 }

//                 // console.log(calificacion)
//                 if(calificacion.modalidadEvaluacionTipo.id == id && calificacion.modalidadEvaluacionTipo.id !== 9 && calificacion.modalidadEvaluacionTipo.id !==7 )
//                 {
//                     // console.log("",calificacion.cuantitativa)
//                     notas.push({
//                         cuantitativa: calificacion.cuantitativa,
//                         modalidad_evaluacion: calificacion.modalidadEvaluacionTipo.modalidadEvaluacion,
//                         nota_tipo: calificacion.notaTipo.nota
//                     })
//                     count++;
//                 }else{

//                     if(calificacion.modalidadEvaluacionTipo.id == id && (calificacion.modalidadEvaluacionTipo.id === 9 || calificacion.modalidadEvaluacionTipo.id ===7) )
//                     {
//                         if(calificacion.notaTipo.id === 7)
//                         {
//                             notas.push({
//                                 cuantitativa: calificacion.cuantitativa,
//                                 modalidad_evaluacion: calificacion.modalidadEvaluacionTipo.modalidadEvaluacion,
//                                 nota_tipo: calificacion.notaTipo.nota
//                             })
//                             count = 3
//                         }   
//                     }
//                 }
//             }

//             if( id=== 9 || id === 7)
//             {
//                 if(count=== 0)
//                 {
//                     count = 2
//                 }
//             } 

//             while(count < 3)
//             {
//                 notas.push({
//                     cuantitativa: null ,
//                     modalidad_evaluacion: 'sin modalidad',
//                     nota_tipo: 'sin nota'
//                 })
//                 count++
//             }
//         }
//         // let calificaciones = await this.calificacionesRepository.createQueryBuilder
        
//         // console.log('calificaciones', calificaciones)

//         let registro = {
//             ci: student.matriculaEstudiante.institucionEducativaEstudiante.persona.carnetIdentidad,
//             nombre: `${student.matriculaEstudiante.institucionEducativaEstudiante.persona.paterno} ${student.matriculaEstudiante.institucionEducativaEstudiante.persona.materno} ${student.matriculaEstudiante.institucionEducativaEstudiante.persona.nombre} `,
//             estado: student.estadoMatriculaTipo.estadoMatricula,
//             notas: notas,
         
//         }

//         registro_notas.push(registro)
//     }

//     return {
//         operativos: operativos,
//         estudiantes: registro_notas ,
//         aula: aula,
//         carrera_autorizada: carrera_autorizada,
//         docente: persona
//     } 
//  }
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
            // take : 10,           
        }
    )
    
    const aula = await this.aulaRepository.findOne({
        relations:{
            paraleloTipo: true,
            ofertaCurricular:{
                periodoTipo: true,
                planEstudioAsignatura:{
                    asignaturaTipo: true,
                    planEstudioCarrera:{
                        planEstudioResolucion: true,
                    },
                    regimenGradoTipo: true,
                },
                institutoPlanEstudioCarrera:{
                    planEstudioCarrera:{ intervaloGestionTipo:true }
                }
                
            },
        },
        where: {id:aula_id}
    })

    console.log('aula', aula)
    const regimen = aula.ofertaCurricular.institutoPlanEstudioCarrera.planEstudioCarrera.intervaloGestionTipo.intervaloGestion;
    console.log('regimen de estudio', regimen)

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
            eventoTipoId: 2,//calificaciones,
            modalidadEvaluacionTipo: In([1,2,3,4,5,6,7,9]),
            periodoTipoId: aula.ofertaCurricular.periodoTipoId
        },
        order: {
            modalidadEvaluacionTipoId: 'ASC'
        }

    })
    // console.log('operativos', operativos)

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

   
    console.log(carrera_autorizada)
    let registro_notas =[]
    console.log(operativos)
    if(regimen === 'AÑO')
    {
        registro_notas = await this.institutoEstudianteInscripcionRepository.query(`
            select p.carnet_identidad, p.complemento, p.paterno , p.materno ,p.nombre,
            (select ieidc.cuantitativa as pb_teorico from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 3 and ieidc.nota_tipo_id = 5 ),
            (select ieidc.cuantitativa as pb_practico from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 3 and ieidc.nota_tipo_id = 6 ),
            (select ieidc.cuantitativa as pb_suma from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 3 and ieidc.nota_tipo_id = 7 ),
            (select ieidc.cuantitativa as sb_teorico from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 4 and ieidc.nota_tipo_id = 5 ),
            (select ieidc.cuantitativa as sb_practico from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 4 and ieidc.nota_tipo_id = 6 ),
            (select ieidc.cuantitativa as sb_suma from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 4 and ieidc.nota_tipo_id = 7 ),
            (select ieidc.cuantitativa as tb_teorico from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 5 and ieidc.nota_tipo_id = 5 ),
            (select ieidc.cuantitativa as tb_practico from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 5 and ieidc.nota_tipo_id = 6 ),
            (select ieidc.cuantitativa as tb_suma from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 5 and ieidc.nota_tipo_id = 7 ),
            (select ieidc.cuantitativa as cb_teorico from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 6 and ieidc.nota_tipo_id = 5 ),
            (select ieidc.cuantitativa as cb_practico from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 6 and ieidc.nota_tipo_id = 6 ),
            (select ieidc.cuantitativa as cb_suma from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 6 and ieidc.nota_tipo_id = 7 ),
            (select ieidc.cuantitativa as final_suma from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 7 and ieidc.nota_tipo_id = 7 ),
            (select ieidc.cuantitativa as recuperatorio_suma from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 9 and ieidc.nota_tipo_id = 7 ),
            emt.estado_matricula  
            from instituto_estudiante_inscripcion iei
            inner join matricula_estudiante me on me.id = iei.matricula_estudiante_id 
            inner join institucion_educativa_estudiante iee on iee.id = me.institucion_educativa_estudiante_id 
            inner join persona p on p.id = iee.persona_id
            inner join estado_matricula_tipo emt on emt.id = iei.estadomatricula_tipo_id 
            where iei.aula_id = ${aula.id} 
            order by p.paterno asc, p.materno asc, p.nombre asc;
        
        `)
    }else{

        registro_notas = await this.institutoEstudianteInscripcionRepository.query(`
            select p.carnet_identidad, p.complemento, p.paterno , p.materno ,p.nombre,
            (select ieidc.cuantitativa as pt_teorico from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 1 and ieidc.nota_tipo_id = 5 ),
            (select ieidc.cuantitativa as pt_practico from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 1 and ieidc.nota_tipo_id = 6 ),
            (select ieidc.cuantitativa as pt_suma from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 1 and ieidc.nota_tipo_id = 7 ),
            (select ieidc.cuantitativa as st_teorico from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 2 and ieidc.nota_tipo_id = 5 ),
            (select ieidc.cuantitativa as st_practico from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 2 and ieidc.nota_tipo_id = 6 ),
            (select ieidc.cuantitativa as st_suma from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 2 and ieidc.nota_tipo_id = 7 ),
            (select ieidc.cuantitativa as final_suma from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 7 and ieidc.nota_tipo_id = 7 ),
            (select ieidc.cuantitativa as recuperatorio_suma from instituto_estudiante_inscripcion_docente_calificacion ieidc where ieidc.instituto_estudiante_inscripcion_id = iei.id and ieidc.modalidad_evaluacion_tipo_id = 9 and ieidc.nota_tipo_id = 7 ),
            emt.estado_matricula  
            from instituto_estudiante_inscripcion iei
            inner join matricula_estudiante me on me.id = iei.matricula_estudiante_id 
            inner join institucion_educativa_estudiante iee on iee.id = me.institucion_educativa_estudiante_id 
            inner join persona p on p.id = iee.persona_id
            inner join estado_matricula_tipo emt on emt.id = iei.estadomatricula_tipo_id 
            where iei.aula_id = ${aula.id} 
            order by p.paterno asc, p.materno asc, p.nombre asc;
        `)
    }
    
    const persona = await this.institutoEstudianteInscripcionRepository.query(`
            select p.paterno, p.materno, p.nombre, p.carnet_identidad, p.complemento  from aula_docente ad 
            inner join maestro_inscripcion mi on mi.id = ad.maestro_inscripcion_id 
            inner join persona p on p.id = mi.persona_id 
            where ad.aula_id = ${aula.id} and ad.baja_tipo_id = 0;
    `);

    return {
        operativos: operativos,
        estudiantes: registro_notas ,
        aula: aula,
        carrera_autorizada: carrera_autorizada,
        docente: persona[0],
        regimen: regimen
    } 
 }

//  async aulaFixes(aula_id, modalidad_evaluacion_tipo_id)
//  {
//     const students = await this.institutoEstudianteInscripcionRepository.find(
//         {
//             relations: {
//                 matriculaEstudiante: {
//                     institucionEducativaEstudiante:{
//                         persona:true
//                     },
                    
//                 },
//                 estadoMatriculaTipo: true,
//             },
//             select: {
//                 id: true,
//                 matriculaEstudiante: {
//                     id: true,
//                     institucionEducativaEstudiante: {
//                         id: true,
//                         persona: {
//                             carnetIdentidad: true,
//                             complemento: true,
//                             nombre: true,
//                             paterno: true,
//                             materno:true
//                         }
//                     },
                    
//                 },
//                 estadoMatriculaTipo:{
//                     id: true,
//                     estadoMatricula: true,
//                 }
//             },
//             where: { aulaId: aula_id}, 
//             // take : 10,           
//         }
//     )

//     for(const student of students)
//     {
//         let calificaciones = await this.calificacionesRepository.find({
    
//             where:{ institutoEstudianteInscripcionId: student.id, modalidadEvaluacionTipoId: modalidad_evaluacion_tipo_id },
//             order:{
//                 modalidadEvaluacionTipoId : 'ASC',
//                 notaTipoId: 'ASC'
//             }
//         })
//         console.log('institutoEstudianteInscripcionId',student.id)
//         console.log('cantidad', calificaciones.length)
//         if(calificaciones.length>3)
//         {
//             console.log('aplicando solucion')
//             let teorica = null;
//             let practica = null;
//             let suma = null;

//             for(const calificacion of calificaciones)
//             {
//                 if( !teorica && calificacion.notaTipoId  === 5 )
//                 {
//                     teorica = calificacion

//                 }else{
    
//                     if(teorica && calificacion.notaTipoId === 5 )
//                     {
//                         await this.calificacionesRepository.delete( calificacion.id)
//                     }
//                 }

//                 if(!practica && calificacion.notaTipoId  === 6 ){
                    
//                     practica = calificacion
                    
//                 }else{

//                     if(practica && calificacion.notaTipoId === 6 )
//                     {
//                         await this.calificacionesRepository.delete( calificacion.id)
//                     }

//                 }


//                 if(!suma && calificacion.notaTipoId  === 7 ){
                   
//                     suma = calificacion
                   
//                 }else{
                   
//                     if(suma && calificacion.notaTipoId  === 7 ){
//                         await this.calificacionesRepository.delete( calificacion.id)
//                     }
//                 }

//             }
//             try {
            
//                 console.log('teorica', teorica.cuantitativa )
//                 console.log('practica', practica.cuantitativa )
//                 console.log('suma', suma.cuantitativa )

//                 suma.cuantitativa = parseInt(teorica.cuantitativa ) +  parseInt(practica.cuantitativa);


//                 suma = await this.calificacionesRepository.save(suma)
//                 console.log('suma actualizado', suma)
                
//                 suma = null;
//                 teorica = null;
//                 practica = null;

//             } catch (error) {
//                 console.log(error)
//             }
            

    
//         }
//     }


//     return students;
//  }

//  async aulaFixesAll()
//  {
//     let aulaFixes = await this.calificacionesRepository.query(`select instituto_estudiante_inscripcion.aula_id,ieidc.modalidad_evaluacion_tipo_id, count(ieidc.modalidad_evaluacion_tipo_id) as cantidad  from instituto_estudiante_inscripcion
//     inner join instituto_estudiante_inscripcion_docente_calificacion ieidc on ieidc.instituto_estudiante_inscripcion_id = instituto_estudiante_inscripcion.id
//     where ieidc.cuantitativa > 100
//     group by instituto_estudiante_inscripcion.aula_id,ieidc.modalidad_evaluacion_tipo_id order by cantidad desc;`)
    
//     await Promise.all( aulaFixes.map(async (aula) =>{
//         await this.aulaFixes(aula.aula_id, aula.modalidad_evaluacion_tipo_id)
//     } ) )
//     return { message: 'todo ok ', aulaFixes: aulaFixes}
//  }

    async saveNotes(students: MasiveCreateTeacherCalification[], user: UserEntity)
    {
        // const new_student = new CreateTeacherCalification();

        // new_student.aulaDocenteId = 10638
        // new_student.institutoEstudianteInscripcionId = 275087
        // new_student.modalidadEvaluacionTipoId = 1
        // new_student.periodoTipoId = 53
        // new_student.cuantitativa = 999
        // new_student.notaTipoId = 5
        // new_student.usuarioId = user.id
        // new_student.valoracionTipoId = 1

        // const student = await this.teacherCalificationRepository.save(new_student);

        await Promise.all( students.map(async (student)=>{

            const aula = await this.aulaRepository.findOne({
                relations:{
                    ofertaCurricular:{ 
                        institutoPlanEstudioCarrera:{
                            planEstudioCarrera: true
                        }
                    }
                },
                where: { id: student.aula_id }
            })
            
            console.log('studente',student)
            let teoric_note: InstitutoEstudianteInscripcionDocenteCalificacion = null
            let practice_note: InstitutoEstudianteInscripcionDocenteCalificacion = null
            await Promise.all(student.notes.map(async (note)=>{

                const recod_note = await this.teacherCalificationRepository.findOne({
                    where: { 
                        aulaDocenteId: student.aula_docente_id,
                        institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                        modalidadEvaluacionTipoId: student.modalidad_evaluacion_tipo_id,
                        periodoTipoId: student.periodo_tipo_id,
                        notaTipoId: note.nota_tipo_id                                            

                    }
                })


                if(recod_note)
                {
                    recod_note.cuantitativa = note.cuantitativa
                    if( recod_note.notaTipoId === 5) //teorico
                    {
                        teoric_note = await this.teacherCalificationRepository.save(recod_note)
                    }

                    if(recod_note.notaTipoId === 6) //practico
                    {
                        practice_note = await this.teacherCalificationRepository.save(recod_note)
                    }
                }

                if(!recod_note)
                {
                    const new_student = new CreateTeacherCalification();

                    new_student.aulaDocenteId = student.aula_docente_id
                    new_student.institutoEstudianteInscripcionId = student.instituto_estudiante_inscripcion_id
                    new_student.modalidadEvaluacionTipoId = student.modalidad_evaluacion_tipo_id
                    new_student.periodoTipoId = student.periodo_tipo_id
                    new_student.cuantitativa = note.cuantitativa
                    new_student.notaTipoId = note.nota_tipo_id
                    new_student.usuarioId = user.id
                    new_student.valoracionTipoId = 1

                    if( new_student.notaTipoId === 5) //teorico
                    {
                        teoric_note = await this.teacherCalificationRepository.save(new_student)
                    }

                    if(new_student.notaTipoId === 6) //practico
                    {
                        practice_note = await this.teacherCalificationRepository.save(new_student)
                    }
                }

            }))
            
            // once get teoric note and practice note we need add sum note but find first if not found create sum note
            let record_sum:InstitutoEstudianteInscripcionDocenteCalificacion = null
            if(teoric_note && practice_note)
            {
                const sum_note = await this.teacherCalificationRepository.findOne({
                    where: { 
                        aulaDocenteId: student.aula_docente_id,
                        institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                        modalidadEvaluacionTipoId: student.modalidad_evaluacion_tipo_id,
                        periodoTipoId: student.periodo_tipo_id,
                        notaTipoId: 7 //final 

                    }
                })
                if(sum_note)
                {
                    sum_note.cuantitativa = teoric_note.cuantitativa + practice_note.cuantitativa
                    record_sum =  await this.teacherCalificationRepository.save(sum_note)
                }   

                if(!sum_note)
                {
                    const new_sum_note = new CreateTeacherCalification();

                    new_sum_note.aulaDocenteId = student.aula_docente_id
                    new_sum_note.institutoEstudianteInscripcionId = student.instituto_estudiante_inscripcion_id
                    new_sum_note.modalidadEvaluacionTipoId = student.modalidad_evaluacion_tipo_id
                    new_sum_note.periodoTipoId = student.periodo_tipo_id
                    new_sum_note.cuantitativa =  teoric_note.cuantitativa + practice_note.cuantitativa
                    new_sum_note.notaTipoId = 7
                    new_sum_note.usuarioId = user.id
                    new_sum_note.valoracionTipoId = 1

                    record_sum =  await this.teacherCalificationRepository.save(new_sum_note)
                }

            }

            if(practice_note.modalidadEvaluacionTipoId === 9 || practice_note.modalidadEvaluacionTipoId === 10) //si es recuperatorio
            {
                const sum_note = await this.teacherCalificationRepository.findOne({
                    where: { 
                        aulaDocenteId: student.aula_docente_id,
                        institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                        modalidadEvaluacionTipoId: student.modalidad_evaluacion_tipo_id,
                        periodoTipoId: student.periodo_tipo_id,
                        notaTipoId: 7 //final 

                    }
                })
                if(sum_note)
                {
                    sum_note.cuantitativa = practice_note.cuantitativa
                    record_sum =  await this.teacherCalificationRepository.save(sum_note)
                }   

                if(!sum_note)
                {
                    const new_sum_note = new CreateTeacherCalification();

                    new_sum_note.aulaDocenteId = student.aula_docente_id
                    new_sum_note.institutoEstudianteInscripcionId = student.instituto_estudiante_inscripcion_id
                    new_sum_note.modalidadEvaluacionTipoId = student.modalidad_evaluacion_tipo_id
                    new_sum_note.periodoTipoId = student.periodo_tipo_id
                    new_sum_note.cuantitativa =  practice_note.cuantitativa
                    new_sum_note.notaTipoId = 7
                    new_sum_note.usuarioId = user.id
                    new_sum_note.valoracionTipoId = 1

                    record_sum =  await this.teacherCalificationRepository.save(new_sum_note)
                }
            }


            console.log('teoric', teoric_note)
            console.log('practice', practice_note)
            console.log('sum note', record_sum)
            let average = 0
            if(aula) //actualiza el promedio de  notas 
            {
                if(aula.ofertaCurricular.institutoPlanEstudioCarrera.planEstudioCarrera.intervaloGestionTipoId === 1 && student.modalidad_evaluacion_tipo_id !== 9 && student.modalidad_evaluacion_tipo_id !== 10) // semestre
                {   
                    //tiene 2 notas tericas
                    const teoric_notes = await this.teacherCalificationRepository.find({
                        where: { 
                            aulaDocenteId: student.aula_docente_id,
                            institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                            periodoTipoId: student.periodo_tipo_id,
                            notaTipoId: 5, // teorica
                            modalidadEvaluacionTipoId: In([1,2])
                         }
                    })
                    
                    let teoric_sum = 0 

                    await Promise.all(teoric_notes.map((teoric)=>{
                        teoric_sum += parseFloat(teoric.cuantitativa+"") 
                    }))

                    console.log('teoric ', teoric_sum)

                    const teoric_final = await this.teacherCalificationRepository.findOne({
                        where: { 
                            aulaDocenteId: student.aula_docente_id,
                            institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                            periodoTipoId: student.periodo_tipo_id,
                            notaTipoId: 5, // teorica
                            modalidadEvaluacionTipoId: 7
                        }
                    })

                    average = 0
                    if(teoric_sum > 0)
                    {
                        average = parseFloat((teoric_sum /2).toFixed(2) ) 
                    }
                    
                    if(teoric_final)
                    {
                        teoric_final.cuantitativa = average;
                        await this.teacherCalificationRepository.save(teoric_final)

                    }else{

                        const new_teoric_final_note = new CreateTeacherCalification();

                        new_teoric_final_note.aulaDocenteId = student.aula_docente_id
                        new_teoric_final_note.institutoEstudianteInscripcionId = student.instituto_estudiante_inscripcion_id
                        new_teoric_final_note.modalidadEvaluacionTipoId = 7
                        new_teoric_final_note.periodoTipoId = student.periodo_tipo_id
                        new_teoric_final_note.cuantitativa =  average
                        new_teoric_final_note.notaTipoId = 5
                        new_teoric_final_note.usuarioId = user.id
                        new_teoric_final_note.valoracionTipoId = 1
    
                        await this.teacherCalificationRepository.save(new_teoric_final_note)
                    }



                    //tiene 2 notas  practicas
                    const practice_notes = await this.teacherCalificationRepository.find({
                        where: { 
                            aulaDocenteId: student.aula_docente_id,
                            institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                            periodoTipoId: student.periodo_tipo_id,
                            notaTipoId: 6, // teorica
                            modalidadEvaluacionTipoId: In([1,2])
                         }
                    })

                    let practice_sum = 0 

                    await Promise.all(practice_notes.map((practice)=>{
                        practice_sum += parseFloat(practice.cuantitativa+"") 
                    }))

                    console.log('practice', practice_sum)
                    const practice_final = await this.teacherCalificationRepository.findOne({
                        where: { 
                            aulaDocenteId: student.aula_docente_id,
                            institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                            periodoTipoId: student.periodo_tipo_id,
                            notaTipoId: 6, // teorica
                            modalidadEvaluacionTipoId: 7
                        }
                    })
                    average = 0
                    if(practice_sum > 0)
                    {
                        average = parseFloat((practice_sum /2).toFixed(2) ) 
                    }

                    

                    if(practice_final)
                    {
                        practice_final.cuantitativa = average;
                        await this.teacherCalificationRepository.save(practice_final)

                    }else{

                        const new_practice_final_note = new CreateTeacherCalification();

                        new_practice_final_note.aulaDocenteId = student.aula_docente_id
                        new_practice_final_note.institutoEstudianteInscripcionId = student.instituto_estudiante_inscripcion_id
                        new_practice_final_note.modalidadEvaluacionTipoId = 7
                        new_practice_final_note.periodoTipoId = student.periodo_tipo_id
                        new_practice_final_note.cuantitativa =  average
                        new_practice_final_note.notaTipoId = 6
                        new_practice_final_note.usuarioId = user.id
                        new_practice_final_note.valoracionTipoId = 1
    
                        await this.teacherCalificationRepository.save(new_practice_final_note)
                    }

                    //tiene 2 notas finales
                    const sum_notes = await this.teacherCalificationRepository.find({
                        where: { 
                            aulaDocenteId: student.aula_docente_id,
                            institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                            periodoTipoId: student.periodo_tipo_id,
                            notaTipoId: 7, // teorica
                            modalidadEvaluacionTipoId: In([1,2])
                         }
                    })

                    let sum_sum = 0 

                    await Promise.all(sum_notes.map((sum)=>{
                        sum_sum += parseFloat(sum.cuantitativa+"") 
                    }))

                    const sum_final = await this.teacherCalificationRepository.findOne({
                        where: { 
                            aulaDocenteId: student.aula_docente_id,
                            institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                            periodoTipoId: student.periodo_tipo_id,
                            notaTipoId: 7, // teorica
                            modalidadEvaluacionTipoId: 7
                        }
                    })
                    average = 0
                    if(sum_sum > 0)
                    {
                        average = parseFloat((sum_sum /2).toFixed(2) ) 
                    }

                    console.log('suma final',sum_sum)
                    //aqui calcular estado del estudiante
                    // en el estado va 0 como no asistido 

                    let final_note: InstitutoEstudianteInscripcionDocenteCalificacion = null 

                    if(sum_final)
                    {
                        sum_final.cuantitativa = average;
                       final_note = await this.teacherCalificationRepository.save(sum_final)

                    }else{

                        const new_sum_final_note = new CreateTeacherCalification();

                        new_sum_final_note.aulaDocenteId = student.aula_docente_id
                        new_sum_final_note.institutoEstudianteInscripcionId = student.instituto_estudiante_inscripcion_id
                        new_sum_final_note.modalidadEvaluacionTipoId = 7
                        new_sum_final_note.periodoTipoId = student.periodo_tipo_id
                        new_sum_final_note.cuantitativa =  average
                        new_sum_final_note.notaTipoId = 7
                        new_sum_final_note.usuarioId = user.id
                        new_sum_final_note.valoracionTipoId = 1
    
                       final_note = await this.teacherCalificationRepository.save(new_sum_final_note)
                    }

                    //revisar si existe nota recuperatoria




                    if(final_note)
                    {
                        let estado_matricula_id = 1
                        if(final_note.cuantitativa === 0)
                        {
                            estado_matricula_id = 49 //no se presento
                        }else{
                            if( Math.round(final_note.cuantitativa) >= 61)
                            {
                                estado_matricula_id = 30 //aprobado
                            }else{
                                estado_matricula_id = 43 //reprobado
                            }
                        }

                        const inscription = await  this.institutoEstudianteInscripcionRepository.findOne({ where: { id: student.instituto_estudiante_inscripcion_id }})

                        inscription.estadoMatriculaTipoId = estado_matricula_id

                        await this.institutoEstudianteInscripcionRepository.save(inscription)
                        
                    }
                    


                }

                if(aula.ofertaCurricular.institutoPlanEstudioCarrera.planEstudioCarrera.intervaloGestionTipoId === 1 && (student.modalidad_evaluacion_tipo_id === 9 || student.modalidad_evaluacion_tipo_id === 10 )) // semestre recuperatorio
                {

                    const final_recovery = await this.teacherCalificationRepository.findOne({
                        where: { 
                            aulaDocenteId: student.aula_docente_id,
                            institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                            periodoTipoId: student.periodo_tipo_id,
                            notaTipoId: 7, // teorica
                            modalidadEvaluacionTipoId: 9
                        }
                    })

                    const sum_final = await this.teacherCalificationRepository.findOne({
                        where: { 
                            aulaDocenteId: student.aula_docente_id,
                            institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                            periodoTipoId: student.periodo_tipo_id,
                            notaTipoId: 7, // teorica
                            modalidadEvaluacionTipoId: 7
                        }
                    })
                   
                    console.log('suma final recuperatorio',final_recovery)
                    
                    let final_note: InstitutoEstudianteInscripcionDocenteCalificacion = null 

                    if(sum_final && final_recovery.cuantitativa >= 61 )
                    {
                        sum_final.cuantitativa = 61 ;
                       final_note = await this.teacherCalificationRepository.save(sum_final)

                    }

                    //revisar si existe nota recuperatoria




                    if(final_note)
                    {
                        let estado_matricula_id = 1
                        if(final_note.cuantitativa === 0)
                        {
                            estado_matricula_id = 49 //no se presento
                        }else{
                            if(Math.round(final_note.cuantitativa) >= 61)
                            {
                                estado_matricula_id = 30 //aprobado
                            }else{
                                estado_matricula_id = 43 //reprobado
                            }
                        }

                        const inscription = await  this.institutoEstudianteInscripcionRepository.findOne({ where: { id: student.instituto_estudiante_inscripcion_id }})

                        inscription.estadoMatriculaTipoId = estado_matricula_id

                        await this.institutoEstudianteInscripcionRepository.save(inscription)
                        
                    }
                }



                if(aula.ofertaCurricular.institutoPlanEstudioCarrera.planEstudioCarrera.intervaloGestionTipoId === 4 && student.modalidad_evaluacion_tipo_id !== 9  && student.modalidad_evaluacion_tipo_id !== 10) // anual
                {
                    //tiene 4 notas 

                     //tiene 4 notas  tericas
                    const teoric_notes = await this.teacherCalificationRepository.find({
                        where: { 
                            aulaDocenteId: student.aula_docente_id,
                            institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                            periodoTipoId: student.periodo_tipo_id,
                            notaTipoId: 5, // teorica
                            modalidadEvaluacionTipoId: In([3,4,5,6])
                         }
                    })
                    
                    let teoric_sum = 0 

                    await Promise.all(teoric_notes.map((teoric)=>{
                        teoric_sum += parseFloat(teoric.cuantitativa+"") 
                    }))

                    console.log('teoric ', teoric_sum)

                    const teoric_final = await this.teacherCalificationRepository.findOne({
                        where: { 
                            aulaDocenteId: student.aula_docente_id,
                            institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                            periodoTipoId: student.periodo_tipo_id,
                            notaTipoId: 5, // teorica
                            modalidadEvaluacionTipoId: 7
                        }
                    })

                    average = 0
                    if(teoric_sum > 0)
                    {
                        average = parseFloat((teoric_sum /4).toFixed(2) ) 
                    }
                    
                    if(teoric_final)
                    {
                        teoric_final.cuantitativa = average;
                        await this.teacherCalificationRepository.save(teoric_final)

                    }else{

                        const new_teoric_final_note = new CreateTeacherCalification();

                        new_teoric_final_note.aulaDocenteId = student.aula_docente_id
                        new_teoric_final_note.institutoEstudianteInscripcionId = student.instituto_estudiante_inscripcion_id
                        new_teoric_final_note.modalidadEvaluacionTipoId = 7
                        new_teoric_final_note.periodoTipoId = student.periodo_tipo_id
                        new_teoric_final_note.cuantitativa =  average
                        new_teoric_final_note.notaTipoId = 5
                        new_teoric_final_note.usuarioId = user.id
                        new_teoric_final_note.valoracionTipoId = 1
    
                        await this.teacherCalificationRepository.save(new_teoric_final_note)
                    }



                    //tiene 4 notas  practicas
                    const practice_notes = await this.teacherCalificationRepository.find({
                        where: { 
                            aulaDocenteId: student.aula_docente_id,
                            institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                            periodoTipoId: student.periodo_tipo_id,
                            notaTipoId: 6, // teorica
                            modalidadEvaluacionTipoId: In([3,4,5,6])
                         }
                    })

                    let practice_sum = 0 

                    await Promise.all(practice_notes.map((practice)=>{
                        practice_sum += parseFloat(practice.cuantitativa+"") 
                    }))

                    console.log('practice', practice_sum)
                    const practice_final = await this.teacherCalificationRepository.findOne({
                        where: { 
                            aulaDocenteId: student.aula_docente_id,
                            institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                            periodoTipoId: student.periodo_tipo_id,
                            notaTipoId: 6, // teorica
                            modalidadEvaluacionTipoId: 7
                        }
                    })
                    average = 0
                    if(practice_sum > 0)
                    {
                        average = parseFloat((practice_sum /4).toFixed(2) ) 
                    }

                    

                    if(practice_final)
                    {
                        practice_final.cuantitativa = average;
                        await this.teacherCalificationRepository.save(practice_final)

                    }else{

                        const new_practice_final_note = new CreateTeacherCalification();

                        new_practice_final_note.aulaDocenteId = student.aula_docente_id
                        new_practice_final_note.institutoEstudianteInscripcionId = student.instituto_estudiante_inscripcion_id
                        new_practice_final_note.modalidadEvaluacionTipoId = 7
                        new_practice_final_note.periodoTipoId = student.periodo_tipo_id
                        new_practice_final_note.cuantitativa =  average
                        new_practice_final_note.notaTipoId = 6
                        new_practice_final_note.usuarioId = user.id
                        new_practice_final_note.valoracionTipoId = 1
    
                        await this.teacherCalificationRepository.save(new_practice_final_note)
                    }

                    //tiene 2 notas finales
                    const sum_notes = await this.teacherCalificationRepository.find({
                        where: { 
                            aulaDocenteId: student.aula_docente_id,
                            institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                            periodoTipoId: student.periodo_tipo_id,
                            notaTipoId: 7, // teorica
                            modalidadEvaluacionTipoId: In([3,4,5,6])
                         }
                    })

                    let sum_sum = 0 

                    await Promise.all(sum_notes.map((sum)=>{
                        sum_sum += parseFloat(sum.cuantitativa+"") 
                    }))

                    const sum_final = await this.teacherCalificationRepository.findOne({
                        where: { 
                            aulaDocenteId: student.aula_docente_id,
                            institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                            periodoTipoId: student.periodo_tipo_id,
                            notaTipoId: 7, // teorica
                            modalidadEvaluacionTipoId: 7
                        }
                    })
                    average = 0
                    if(sum_sum > 0)
                    {
                        average = parseFloat((sum_sum /4).toFixed(2) ) 
                    }

                    console.log('suma final',sum_sum)
                    //aqui calcular estado del estudiante
                    // en el estado va 0 como no asistido 

                    let final_note: InstitutoEstudianteInscripcionDocenteCalificacion = null 

                    if(sum_final)
                    {
                        sum_final.cuantitativa = average;
                       final_note = await this.teacherCalificationRepository.save(sum_final)

                    }else{

                        const new_sum_final_note = new CreateTeacherCalification();

                        new_sum_final_note.aulaDocenteId = student.aula_docente_id
                        new_sum_final_note.institutoEstudianteInscripcionId = student.instituto_estudiante_inscripcion_id
                        new_sum_final_note.modalidadEvaluacionTipoId = 7
                        new_sum_final_note.periodoTipoId = student.periodo_tipo_id
                        new_sum_final_note.cuantitativa =  average
                        new_sum_final_note.notaTipoId = 7
                        new_sum_final_note.usuarioId = user.id
                        new_sum_final_note.valoracionTipoId = 1
    
                       final_note = await this.teacherCalificationRepository.save(new_sum_final_note)
                    }

                    //revisar si existe nota recuperatoria




                    if(final_note)
                    {
                        let estado_matricula_id = 1
                        if(final_note.cuantitativa === 0)
                        {
                            estado_matricula_id = 49 //no se presento
                        }else{
                            if(Math.round(final_note.cuantitativa) >= 61)
                            {
                                estado_matricula_id = 30 //aprobado
                            }else{
                                estado_matricula_id = 43 //reprobado
                            }
                        }

                        const inscription = await  this.institutoEstudianteInscripcionRepository.findOne({ where: { id: student.instituto_estudiante_inscripcion_id }})

                        inscription.estadoMatriculaTipoId = estado_matricula_id

                        await this.institutoEstudianteInscripcionRepository.save(inscription)
                        
                    }

                }

                if(aula.ofertaCurricular.institutoPlanEstudioCarrera.planEstudioCarrera.intervaloGestionTipoId === 4 && (student.modalidad_evaluacion_tipo_id === 9 || student.modalidad_evaluacion_tipo_id === 10 ) ) // anual recuperatorio
                {

                    const final_recovery = await this.teacherCalificationRepository.findOne({
                        where: { 
                            aulaDocenteId: student.aula_docente_id,
                            institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                            periodoTipoId: student.periodo_tipo_id,
                            notaTipoId: 7, // teorica
                            modalidadEvaluacionTipoId: 9
                        }
                    })

                    const sum_final = await this.teacherCalificationRepository.findOne({
                        where: { 
                            aulaDocenteId: student.aula_docente_id,
                            institutoEstudianteInscripcionId: student.instituto_estudiante_inscripcion_id,
                            periodoTipoId: student.periodo_tipo_id,
                            notaTipoId: 7, // teorica
                            modalidadEvaluacionTipoId: 7
                        }
                    })
                   
                    console.log('suma final recuperatorio',final_recovery)
                    
                    let final_note: InstitutoEstudianteInscripcionDocenteCalificacion = null 

                    if(sum_final && final_recovery.cuantitativa >= 61 )
                    {
                        sum_final.cuantitativa = 61 ;
                       final_note = await this.teacherCalificationRepository.save(sum_final)

                    }

                    //revisar si existe nota recuperatoria

                    if(final_note)
                    {
                        let estado_matricula_id = 1
                        if(final_note.cuantitativa === 0)
                        {
                            estado_matricula_id = 49 //no se presento
                        }else{
                            if(Math.round(final_note.cuantitativa) >= 61)
                            {
                                estado_matricula_id = 30 //aprobado
                            }else{
                                estado_matricula_id = 43 //reprobado
                            }
                        }

                        const inscription = await  this.institutoEstudianteInscripcionRepository.findOne({ where: { id: student.instituto_estudiante_inscripcion_id }})

                        inscription.estadoMatriculaTipoId = estado_matricula_id

                        await this.institutoEstudianteInscripcionRepository.save(inscription)
                        
                    }
                }
                
            }
            
        }) )



       return students
        // return students;
    }

    async studentNotes(payload: any)
    {
        const regimenes_grado = await this.teacherCalificationRepository.query(`
            select rgt.id, rgt.regimen_grado, oc.gestion_tipo_id 
            from institucion_educativa_estudiante iee 
            inner join matricula_estudiante me on me.institucion_educativa_estudiante_id = iee.id
            inner join instituto_estudiante_inscripcion iei on iei.matricula_estudiante_id  = me.id
            inner join aula a on a.id = iei.aula_id 
            inner join oferta_curricular oc on oc.id = a.oferta_curricular_id 
            inner join plan_estudio_asignatura pea on pea.id = oc.plan_estudio_asignatura_id 
            inner join asignatura_tipo at2 on at2.id = pea.asignatura_tipo_id 
            inner join regimen_grado_tipo rgt on rgt.id = pea.regimen_grado_tipo_id 
            inner join estado_matricula_tipo emt on emt.id = iei.estadomatricula_tipo_id 
            where iee.institucion_educativa_sucursal_id  =  ${payload.institucion_educativa_sucursal_id} and iee.persona_id = ${payload.persona_id} and me.instituto_plan_estudio_carrera_id = ${payload.instituto_plan_estudio_carrera_id} and iei.estadomatricula_tipo_id = 30 
            group by rgt.regimen_grado, rgt.id, oc.gestion_tipo_id ;
        `)

        await Promise.all( regimenes_grado.map(async (regimen_grado: any)=>{
      
            let notes  = await this.teacherCalificationRepository.query(`
                select rgt.regimen_grado, oc.gestion_tipo_id  ,at2.asignatura, at2.abreviacion, emt.estado_matricula,
                        (select iedc.cuantitativa as nota_final from instituto_estudiante_inscripcion_docente_calificacion iedc where iedc.instituto_estudiante_inscripcion_id = iei.id and iedc.modalidad_evaluacion_tipo_id = 7 and iedc.nota_tipo_id = 7 )
                from institucion_educativa_estudiante iee 
                inner join matricula_estudiante me on me.institucion_educativa_estudiante_id = iee.id
                inner join instituto_estudiante_inscripcion iei on iei.matricula_estudiante_id  = me.id
                inner join aula a on a.id = iei.aula_id 
                inner join oferta_curricular oc on oc.id = a.oferta_curricular_id 
                inner join plan_estudio_asignatura pea on pea.id = oc.plan_estudio_asignatura_id 
                inner join asignatura_tipo at2 on at2.id = pea.asignatura_tipo_id 
                inner join regimen_grado_tipo rgt on rgt.id = pea.regimen_grado_tipo_id 
                inner join estado_matricula_tipo emt on emt.id = iei.estadomatricula_tipo_id 
                where iee.institucion_educativa_sucursal_id  = ${payload.institucion_educativa_sucursal_id} and iee.persona_id = ${payload.persona_id} and me.instituto_plan_estudio_carrera_id = ${payload.instituto_plan_estudio_carrera_id} and iei.estadomatricula_tipo_id = 30 and pea.regimen_grado_tipo_id = ${regimen_grado.id};
            `)

            regimen_grado.notes = notes

        }))

        return regimenes_grado
        
    }

    async saveNotesHomologation(payload: any[], user: UserEntity)
    {
        let note= null
        await Promise.all( payload.map(async (subject)=>{

            let oferta_curricular = await this.ofertaCurricularRepository.findOne({
                where:  {
                            institutoPlanEstudioCarreraId: subject.instituto_plan_estudio_carrera_id,
                            gestionTipoId: subject.gestion_tipo_id,
                            periodoTipoId: subject.periodo_tipo_id,
                            planEstudioAsignaturaId: subject.plan_estudio_asignatura_id
                        }
            })

            if(!oferta_curricular)
            {
                let new_oferta_curricular = new NewOfertaCurricularDTO()
                new_oferta_curricular.institutoPlanEstudioCarreraId = subject.instituto_plan_estudio_carrera_id
                new_oferta_curricular.planEstudioAsignaturaId = subject.plan_estudio_asignatura_id
                new_oferta_curricular.gestionTipoId = subject.gestion_tipo_id
                new_oferta_curricular.periodoTipoId = subject.periodo_tipo_id
                new_oferta_curricular.usuarioId = user.id
                new_oferta_curricular.observacion = 'homologacion/reincorporacion'

                oferta_curricular = await this.ofertaCurricularRepository.save(new_oferta_curricular)
            }
            let paralelo_tipo_id = 49; //homologation
            let turno_tipo_id = 1; //mañana
            

            if(oferta_curricular)
            {
                let aula = await this.aulaRepository.findOne({
                    where: { ofertaCurricularId: oferta_curricular.id, paraleloTipoId: paralelo_tipo_id, turnoTipoId: turno_tipo_id }
                })

                if(!aula)
                {
                    let new_aula = new NewAulaDTO()
                    new_aula.ofertaCurricularId = oferta_curricular.id
                    new_aula.cupo = 1
                    new_aula.usuarioId = user.id
                    new_aula.paraleloTipoId = paralelo_tipo_id
                    new_aula.turnoTipoId = turno_tipo_id

                    aula = await this.aulaRepository.save(new_aula)
                }

                if(aula)
                {

                    //aula docente Solo el director puede realizar esta accion si no lo  es no se deberia continuar con el registro
                    let maestro_inscripcion = await this.maestroInscripcionRepository.findOne({
                        where: { institucionEducativaSucursalId: subject.institucion_educativa_sucursal_id, personaId: user.personaId , cargoTipoId: 2 } 
                    })

                    if(!maestro_inscripcion)
                    {
                        throw new NotFoundException('Director not found!'); // solo el director puede adicionar notas
                    }



                    let instituto_estudiante_inscripcion = await this.institutoEstudianteInscripcionRepository.findOne(
                        {
                            where:  { 
                                        matriculaEstudianteId: subject.matricula_estudiante_id,
                                        aulaId: aula.id,
                                        ofertaCurricularId: oferta_curricular.id,
                                        inscripcionTipoId: subject.inscripcion_tipo_id

                                    }
                        }
                    )
                    
                    let estado_matricula_tipo = null

                    switch (subject.inscripcion_tipo_id) {
                        case 3:  //APROBADO HOMOLOGACION
                            estado_matricula_tipo = 24
                            break;
                        case 4: //REINCORPORACION HOMOLOGACION
                            estado_matricula_tipo = 45
                    }

                    if(!instituto_estudiante_inscripcion)
                    {
                        let new_instituto_estudiante_inscripcion = new CreateInstitutoEstudianteInscripcion()
                        new_instituto_estudiante_inscripcion.aulaId = aula.id
                        new_instituto_estudiante_inscripcion.inscripcionTipoId = subject.inscripcion_tipo_id
                        new_instituto_estudiante_inscripcion.ofertaCurricularId = oferta_curricular.id
                        new_instituto_estudiante_inscripcion.matriculaEstudianteId = subject.matricula_estudiante_id
                        new_instituto_estudiante_inscripcion.estadoMatriculaInicioTipoId = 0
                        new_instituto_estudiante_inscripcion.estadoMatriculaTipoId = estado_matricula_tipo
                        new_instituto_estudiante_inscripcion.usuarioId = user.id
                        
                        instituto_estudiante_inscripcion = await this.institutoEstudianteInscripcionRepository.save(new_instituto_estudiante_inscripcion)

                    }

                                       
                    //aula docente calificacion 

                    let aula_docente = await this.aulaDocenteRepository.findOne({
                        where: { maestroInscripcionId: maestro_inscripcion.id, aulaId: aula.id}
                    })

                    if(!aula_docente)
                    {
                        let new_aula_docente = new NewAulaDocenteDto()
                        new_aula_docente.aulaId = aula.id
                        new_aula_docente.maestroInscripcionId = maestro_inscripcion.id
                        new_aula_docente.asignacionFechaInicio = new Date().toDateString()
                        new_aula_docente.asignacionFechaFin = new Date().toDateString()
                        new_aula_docente.usuarioId = user.id
                        new_aula_docente.bajaTipoId = 0 //normal

                        aula_docente = await this.aulaDocenteRepository.save(new_aula_docente)
                    }
                    

                    //docente calificaicon

                    let teacher_calification = await this.teacherCalificationRepository.findOne({
                        where:  { 
                                    institutoEstudianteInscripcionId: instituto_estudiante_inscripcion.id,
                                    periodoTipoId: subject.periodo_tipo_id,
                                    aulaDocenteId: aula_docente.id,
                                    notaTipoId: 7,
                                    modalidadEvaluacionTipoId: 7
                                }
                    })

                    if(teacher_calification)
                    {
                        //se asume que la nota es mayor a 61 sin embargo colocar validador front
                        teacher_calification.cuantitativa = subject.nota_final
                        //update note
                       note =  await this.teacherCalificationRepository.save(teacher_calification)


                    }


                    if(!teacher_calification)
                    {
                        let new_teacher_calification =new NewInstitutoInscripcionDocenteCalificacionDto()
                        new_teacher_calification.institutoEstudianteInscripcionId = instituto_estudiante_inscripcion.id
                        new_teacher_calification.aulaDocenteId = aula_docente.id
                        new_teacher_calification.periodoTipoId = subject.periodo_tipo_id
                        new_teacher_calification.cuantitativa = subject.nota_final
                        new_teacher_calification.notaTipoId = 7
                        new_teacher_calification.modalidadEvaluacionTipoId = 7
                        new_teacher_calification.valoracionTipoId = 1

                        note = await this.teacherCalificationRepository.save(new_teacher_calification)

                    }



                }
            }


        }))


        return note
        
    }

    async saveNotesHomologationGestion(payload: any[], user: UserEntity)
    {
        console.log('payload gestion homologation',payload)
        let saved = true
        await Promise.all(payload.map( async(item,index)=>{
            let homologation = await this.homologadosGestionEstudianteRepository.findOne({
                where: { 
                    fromInstitutoPlanEstudioCarreraId: item.from_instituto_plan_estudio_carrera_id,
                    toInstitutoPlanEstudioCarreraId: item.to_instituto_plan_estudio_carrera_id,
                    institutoEstudianteInscripcionId: item.instituto_estudiante_inscripcion_id,
                    institutoEstudianteInscripcionDocenteCalificacionId: item.instituto_estudiante_inscripcion_docente_calificacion_id,
                    regimenGradoTipoId: item.regimen_grado_tipo_id

                 }
            })

            let estado_matricula_tipo = null

            switch (item.inscripcion_tipo_id) {
                case 3:  //APROBADO HOMOLOGACION
                    estado_matricula_tipo = 24
                    break;
                case 4: //REINCORPORACION HOMOLOGACION
                    estado_matricula_tipo = 45
            }


            if(!homologation)
            {
              const new_homologation = new CreateHomologationGestionEstudiante()
              new_homologation.fromInstitutoPlanEstudioCarreraId = item.from_instituto_plan_estudio_carrera_id
              new_homologation.toInstitutoPlanEstudioCarreraId = item.to_instituto_plan_estudio_carrera_id
              new_homologation.institutoEstudianteInscripcionId = item.instituto_estudiante_inscripcion_id
              new_homologation.institutoEstudianteInscripcionDocenteCalificacionId = item.instituto_estudiante_inscripcion_docente_calificacion_id
              new_homologation.regimenGradoTipoId = item.regimen_grado_tipo_id
              new_homologation.toEstadoMatriculaTipoId = estado_matricula_tipo //APROBADO HOMOLOGACION  revisar en base de datos hay 2 borrar uno
              new_homologation.indexSort = index
              new_homologation.userId = user.id

                homologation =  await this.homologadosGestionEstudianteRepository.save(new_homologation)
                if(!homologation)
                {
                    if(saved)
                    {
                        saved = false
                    }
                }
            }
        } ))

        return saved?'Se registro la gestion':'hubo un problema al registrar la homologacion';
    }

}
