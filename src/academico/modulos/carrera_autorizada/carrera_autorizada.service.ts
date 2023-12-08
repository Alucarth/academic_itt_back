import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { CarreraAutorizadaRepository } from './carrera_autorizada.repository';

//para exportar a xls
import { Workbook } from "exceljs";
import * as tmp from "tmp";
import { writeFile } from "fs/promises";
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CarreraAutorizadaService {
    constructor(
        @Inject(CarreraAutorizadaRepository)
        private carreraAutorizadaRepositorio: CarreraAutorizadaRepository,
      
        @InjectRepository(CarreraAutorizada)
        private _carreraAutorizadaRepository: Repository<CarreraAutorizada>,
        private _serviceResp: RespuestaSigedService
      ) {}
      async getCarrerasBySucursalId(id: number) {
        const carreras = await this.carreraAutorizadaRepositorio.geAllCarrerasBySucursalId(id);
        
        return this._serviceResp.respuestaHttp201(
            carreras,
            "Datos Encontrados !!",
            ""
          );
      }
      async getCarrerasByIeId(id: number) {
        console.log('add students an teachers')
        const carreras = await this.carreraAutorizadaRepositorio.geAllCarrerasByIeId(id);
        await Promise.all( carreras.map(async (carrera)=>{
          console.log('carrera',carrera);
          let total_estudiantes = await this._carreraAutorizadaRepository.query(`select count(*) as total_estudiantes from matricula_estudiante me 
          inner join instituto_plan_estudio_carrera ipec on me.instituto_plan_estudio_carrera_id  = ipec.id
          where ipec.carrera_autorizada_id  = ${carrera.carrera_autorizada_id};`)
          console.log(total_estudiantes)

          let total_docentes = await this._carreraAutorizadaRepository.query(`select count(*) as total_docentes from oferta_curricular oc
          inner join instituto_plan_estudio_carrera ipec on oc.instituto_plan_estudio_carrera_id = ipec.id
          inner join aula a on a.oferta_curricular_id = oc.id 
          inner join aula_docente ad on ad.aula_id = a.id 
          where ipec.carrera_autorizada_id = ${carrera.carrera_autorizada_id};`)
          // console.log(total_estudiiantes)
          carrera.total_estudiantes = total_estudiantes[0].total_estudiantes;
          carrera.total_docentes = total_docentes[0].total_docentes
          // let total_docentes

        }))

        if(carreras.length>0){
            return this._serviceResp.respuestaHttp201(
                carreras,
                "Datos Encontrados !!",
                ""
              );    
        }
        return this._serviceResp.respuestaHttp404(
            "",
            'No se encontraron resultados !!',
            '',
        );
      }

      async getTotalInsitution(insitution_educativa_id: number )
      {
        let total_estudiantes = await this._carreraAutorizadaRepository.query(`select count( distinct(mi.persona_id)) as total_docentes from institucion_educativa_sucursal ies 
        inner join maestro_inscripcion mi on mi.institucion_educativa_sucursal_id  = ies.id 
        where ies.institucion_educativa_id  = ${insitution_educativa_id};`)

        let total_docentes = await this._carreraAutorizadaRepository.query(`select count( distinct(iee.persona_id)) as total_estudiantes from institucion_educativa_sucursal ies 
        inner join institucion_educativa_estudiante iee on iee.institucion_educativa_sucursal_id = ies.id
        where ies.institucion_educativa_id  = ${insitution_educativa_id};`)

        return {total_docentes: total_docentes[0], total_estudiantes: total_estudiantes[0]}
        
      }

      async getCursosByIeId(id: number) {
        const cursos = await this.carreraAutorizadaRepositorio.getAllCursosByIeId(id);
        if(cursos.length>0){
            return this._serviceResp.respuestaHttp201(
                cursos,
                "Datos Encontrados !!",
                ""
              );    
        }
        return this._serviceResp.respuestaHttp404(
            "",
            'No se encontraron resultados !!',
            '',
        );
      }
      async getCarreraById(id: number) {
        const carrera = await this.carreraAutorizadaRepositorio.getCarreraAutorizadaById(id);
        if(carrera){
        return this._serviceResp.respuestaHttp201(
            carrera,
            "Datos Encontrados !!",
            ""
          );
        } 
        return this._serviceResp.respuestaHttp404(
            "",
            'No se encontraron resultados !!',
            '',
        );
      }
      async getTotalCarreras(){
        const carreras = await this.carreraAutorizadaRepositorio.findTotalCarreras();
        return carreras;
      }

      async getListaCarreras(){
        const carreras = await this.carreraAutorizadaRepositorio.findListaCarreras();
        return carreras;
      }

      async getTotalEstudiantes(id:number){
        const carreras = await this.carreraAutorizadaRepositorio.findListaCarrerasEstudiantes(id);
        return carreras;
      }
      async getTotalDepartamentoDependencias(){
        const carreras = await this.carreraAutorizadaRepositorio.findTotalDependencias();
        return carreras;
      }
      async getListaParalelosEstudiantes(id:number){
        const carreras = await this.carreraAutorizadaRepositorio.findListParalelosaCarrerasEstudiantes(id);
        return carreras;
      }

      /* aqui reporte por genero */
      async getListaAsignaturaParaleloEstudianteCarrera(id:number){
       console.log("id", id); 
        const carreras = await this.carreraAutorizadaRepositorio.findListAsignaturaParaleloCarreraEstudiante(id);
        return carreras;
      }
      async getListaAsignaturasParaleloEstudiantes(id:number){
        const carreras = await this.carreraAutorizadaRepositorio.findListaAsignaturasParaleloEstudiantes(id);
        return carreras;
      }

      async getListaCarrerasRegimen(lugar:number, dependencia:number){
        const carreras = await this.carreraAutorizadaRepositorio.findListaRegimenCarrerasEstudiantes(lugar, dependencia);
        return carreras;
      }


      async xlsGetCarrerasByIeId(id: number) {

        const instituto = await this.carreraAutorizadaRepositorio.geXlsAllCarrerasByIeIdNombre(id) ;
        
        const data = await this.carreraAutorizadaRepositorio.geXlsAllCarrerasByIeId(id);        
        let rows = [];
        data.forEach((doc) => {
          rows.push(Object.values(doc));
        });
  
        //creating a workbook
        let book = new Workbook();
  
        //adding a worksheet to workbook
        let sheet = book.addWorksheet("sheet1");
        sheet.addRow([`UNIDAD EDUCATIVA: ${instituto}`]);
        sheet.addRow([`LISTADO DE CARRERAS - GESTION 2023`]);
  
        sheet.getRow(1).font = { size: 16, bold: true };
        sheet.getRow(2).font = { size: 12, bold: true };
  
        sheet.addRow([]);
  
         //add the header
        
        rows.unshift(Object.keys(data[0]));
        console.log(Object.keys(data[0]));
  
        //add multiple rows
        sheet.addRows(rows);
  
        sheet.getRow(1).height = 30.5;
        sheet.getRow(2).height = 30.5;
  
        [
          "A4",
          "B4",
          "C4",
          "D4",
          "E4",
          "F4",         
          "G4",         
          "H4",         
          "I4",         
          "J4",         
        ].map((key) => {
          sheet.getCell(key).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "cccccc" },
          };
          sheet.getCell(key).font = {
            bold: true,
          };
          sheet.getCell(key).border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        };
        });

        //autosize columns
        sheet.columns.forEach(function (column) {
          var dataMax = 0;
          column.eachCell({ includeEmpty: true }, function (cell) {
            dataMax = cell.value?cell.value.toString().length:0;
          })
          column.width = dataMax < 10 ? 10 : dataMax;
        });
  
        // write te file
        let File = await new Promise((resolve, reject) => {
          tmp.file(
            {
              discardDescriptor: true,
              prefix: `testXls`,
              postfix: ".xlsx",
              mode: parseInt("0600", 8),
            },
            async (err, file) => {
              if (err) throw new BadRequestException(err);
  
              //write temporary file
              book.xlsx
                .writeFile(file)
                .then((_) => {
                  resolve(file);
                })
                .catch((err) => {
                  throw new BadRequestException(err);
                });
            }
          );
        });
  
      return File;
  

      }

      async getCarrerasByIeIdGestionPeriodo(id: number, gestion: number, periodo: number) {
        const carreras = await this.carreraAutorizadaRepositorio.geAllCarrerasByIeIdGestionPeriodo(id, gestion, periodo);
        if(carreras.length>0){
            return this._serviceResp.respuestaHttp201(
                carreras,
                "Datos Encontrados !!",
                ""
              );    
        }
        return this._serviceResp.respuestaHttp404(
            "",
            'No se encontraron resultados.. !!',
            '',
        );
      }


}
