import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {  InjectRepository } from '@nestjs/typeorm';
import { InstitucionEducativa } from 'src/academico/entidades/institucionEducativa.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager, Repository } from 'typeorm';
import { InstitucionEducativaAcreditacionRepository } from '../institucion_educativa_acreditacion/institucion_educativa_acreditacion.repository';
import { InstitucionEducativaImagenRepository } from '../institucion_educativa_imagen/institucion_educativa_imagen.repository';
import { InstitucionEducativaSucursalRepository } from '../institucion_educativa_sucursal/institucion_educativa_sucursal.repository';
import { CreateInstitucionEducativaDto } from './dto/createInstitucionEducativa.dto';
import { InstitucionEducativaRepository } from './institucion_educativa.repository';
import { User as UserEntity } from 'src/users/entity/users.entity';

//para exportar a xls
import { Workbook } from "exceljs";
import * as tmp from "tmp";
import { writeFile } from "fs/promises";
import { workerData } from 'worker_threads';
@Injectable()
export class InstitucionEducativaService {
    constructor(
        @InjectRepository(InstitucionEducativa) private institucionEducativaRepository: Repository<InstitucionEducativa>,
        @Inject(InstitucionEducativaRepository) private institucionEducativaRepositorio: InstitucionEducativaRepository,
        @Inject(InstitucionEducativaAcreditacionRepository) private institucionEducativaAcreditacionRepositorio: InstitucionEducativaAcreditacionRepository,
        @Inject(InstitucionEducativaSucursalRepository) private institucionEducativaSucursalRepositorio: InstitucionEducativaSucursalRepository,
        @Inject(InstitucionEducativaImagenRepository) private institucionEducativaImagenRepositorio: InstitucionEducativaImagenRepository,
        private _serviceResp: RespuestaSigedService, 
    ){}

    async getAll(){
        return await this.institucionEducativaRepositorio.getAll();
    }

    async getAllItt(){
        const itt = await this.institucionEducativaRepositorio.getAllItt();
        return itt;
    }
    async getTotalItt(){
        const itt = await this.institucionEducativaRepositorio.findTotalItt();
        return itt;
    }
    async getTotalDependencias(){
        const lista = await this.institucionEducativaRepositorio.findTotalDependencias();
        console.log(lista);
        return lista;
    }

    async getReporteListaInstitutosAreaGeografica()
    {
        const lista = await this.institucionEducativaRepositorio.findListaInstitutosAreaGeografica()
        // console.log(lista)
        // return lista
        let institution_list = []
             
     
        let city = this.getAreaGeografica('La Paz',lista)
        institution_list.push(city)
        
        city = this.getAreaGeografica('Cochabamba',lista)
        institution_list.push(city)
            
        city = this.getAreaGeografica('Chuquisaca',lista)
        institution_list.push(city)

        city = this.getAreaGeografica('Oruro',lista)        
        institution_list.push(city)

        city = this.getAreaGeografica('Potosi',lista)        
        institution_list.push(city)

        city = this.getAreaGeografica('Tarija',lista)        
        institution_list.push(city)

        city = this.getAreaGeografica('Santa Cruz',lista)        
        institution_list.push(city)

        city = this.getAreaGeografica('Beni',lista)        
        institution_list.push(city)

        city = this.getAreaGeografica('Pando',lista)        
        institution_list.push(city)

        // return lista
         //creating a workbook
         let book = new Workbook();
         const sheet = book.addWorksheet('hoja1', {views: [{showGridLines: false}]});
         
         sheet.addRow([]);
         sheet.addRow([]);
         sheet.addRow([]);
         sheet.addRow([]);
 
         sheet.addRow([`NUMERO DE INSTITUTOS TÉCNICO TECNOLÓGICOS POR AREA GEOGRAFICA  `]);
         sheet.addRow(["GESTION 2023"]);
         
         sheet.getRow(5).font = { name:'Nimbus Sans', size: 16, bold: true ,color: {'argb': '485ab7'} };
         sheet.getRow(6).font = { name:'Nimbus Sans', size: 10, bold: true ,color: {'argb': '7280c8'}};
   
         sheet.addRow([]);
          //add the header
         sheet.addRow(['DEPARTAMENTO','URBANO','RURAL','TOTAL']);
         
         institution_list.forEach(city => {
             sheet.addRow([city.departamento,city.urbano, city.rural, city.total])
         });

         sheet.getRow(5).height = 30.5;
         [
           'A',
           'B',
           'C',
           'D',
           
          
         ].map((key) => {
           let col = sheet.getColumn(key)
             col.width = 25
             if(key !== 'A')
             {
               col.alignment = { vertical: 'middle', horizontal: 'right' };
             }
         });
 
         [
           'A8',
           'B8',
           'C8',
           'D8',
         ].map((key) => {
           sheet.getCell(key).fill = {
             type: "pattern",
             pattern: "solid",
             fgColor: { argb: "E5E5E5" },
           };
           sheet.getCell(key).font = {
             bold: true,
             name:'Nimbus Sans',
           };
           sheet.getCell(key).border = {
             top: { style: 'thin', color: {'argb': 'E5E5E5'} },
             left: { style: 'thin', color: {'argb': 'E5E5E5'} },
             bottom: { style: 'thin', color: {'argb': 'E5E5E5'} },
             right: { style: 'thin', color: {'argb': 'E5E5E5'} }
           };
         });
        
         const imageId2 = book.addImage({
          base64: this.getImageLogo(),
          extension: 'png',
        });

        sheet.addImage(imageId2, 'A1:B4');
 
         let File = await new Promise((resolve, reject) => {
             tmp.file(
               {
                 discardDescriptor: true,
                 prefix: `institutos_area_geografica`,
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

    async getReporteInstitutoDependencia()
    {
        const lista = await this.institucionEducativaRepositorio.findTotalDependencias();
        console.log(lista)
        let institution_list = []
       
        let city = this.getCity('La Paz',lista)
        institution_list.push(city)

        city = this.getCity('Cochabamba',lista)
        institution_list.push(city)

        city = this.getCity('Chuquisaca',lista)
        institution_list.push(city)

        city = this.getCity('Oruro',lista)
        institution_list.push(city)

        city = this.getCity('Potosi',lista)
        institution_list.push(city)

        city = this.getCity('Tarija',lista)
        institution_list.push(city)

        city = this.getCity('Santa Cruz',lista)
        institution_list.push(city)

        city = this.getCity('Beni',lista)
        institution_list.push(city)

        city = this.getCity('Pando',lista)
        institution_list.push(city)

        //creating a workbook
        let book = new Workbook();
        const sheet = book.addWorksheet('hoja1', {views: [{showGridLines: false}]});
      
        /*set witdth colums by leter column */
        const col_a = sheet.getColumn('A')
        col_a.width = 18

        const col_b = sheet.getColumn('B')
        col_b.width = 12
        col_b.alignment = { vertical: 'middle', horizontal: 'right' };

        const col_c = sheet.getColumn('C')
        col_c.width = 12
        col_c.alignment = { vertical: 'middle', horizontal: 'right' };

        const col_d = sheet.getColumn('D')
        col_d.alignment = { vertical: 'middle', horizontal: 'right' };
        col_d.width = 12

        const col_e = sheet.getColumn('E')
        col_e.alignment = { vertical: 'middle', horizontal: 'right' };
        col_e.width = 12;

        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);
        
        sheet.addRow([`NUMERO DE INSTITUTOS TÉCNICO TECNOLÓGICOS`]);
        sheet.addRow(["GESTIÓN 2023"]);
        
        sheet.getRow(5).font = { name:'Nimbus Sans', size: 16, bold: true ,color: {'argb': '485ab7'} };
        sheet.getRow(6).font = { name:'Nimbus Sans', size: 10, bold: true ,color: {'argb': '7280c8'}};
      
        sheet.addRow([]);
         //add the header
        sheet.addRow(['DEPARTAMENTO','CONVENIO','FISCAL','PRIVADO','TOTAL']);
        // sheet.getRow(3).font = { name:'Nimbus Sans', size: 12, bold: true , color: {'argb': '7280c8'} };
        // sheet.getRow(5).font = { name:'Nimbus Sans', size: 12, bold: true , color: {'argb': '485ab7'} };
        institution_list.forEach(city => {
            sheet.addRow([city.departamento,city.convenio, city.fiscal, city.privado, city.total])
        });
        
        sheet.getRow(5).height = 30.5;
        [
          'A8',
          'B8',
          'C8',
          'D8',
          'E8',
         
        ].map((key) => {
          sheet.getCell(key).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "E5E5E5" },
          };
          sheet.getCell(key).font = {
            bold: true,
            name:'Nimbus Sans',
          };
          sheet.getCell(key).border = {
            top: { style: 'thin', color: {'argb': 'E5E5E5'} },
            left: { style: 'thin', color: {'argb': 'E5E5E5'} },
            bottom: { style: 'thin', color: {'argb': 'E5E5E5'} },
            right: { style: 'thin', color: {'argb': 'E5E5E5'} }
          };
        });

         //para la imagen
         const myBase64Image = "data:image/png;base64,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"
         const imageId2 = book.addImage({
           base64: myBase64Image,
           extension: 'png',
         });
 
         sheet.addImage(imageId2, 'A1:C4');

        let File = await new Promise((resolve, reject) => {
            tmp.file(
              {
                discardDescriptor: true,
                prefix: `institutos_dependencia`,
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
    
        // return institution_list;
    }

    async getListaCarrerasInstitutosDependencia() 
    {
        const lista = await this.institucionEducativaRepositorio.findListaCarrerasInstitutosDependencia();
        let institution_list = []
             
     
        let city = this.getCityPependencia('La Paz',lista)
        institution_list.push(city)
        
        city = this.getCityPependencia('Cochabamba',lista)
        institution_list.push(city)
            
        city = this.getCityPependencia('Chuquisaca',lista)
        institution_list.push(city)

        city = this.getCityPependencia('Oruro',lista)        
        institution_list.push(city)

        city = this.getCityPependencia('Potosi',lista)        
        institution_list.push(city)

        city = this.getCityPependencia('Tarija',lista)        
        institution_list.push(city)

        city = this.getCityPependencia('Santa Cruz',lista)        
        institution_list.push(city)

        city = this.getCityPependencia('Beni',lista)        
        institution_list.push(city)

        city = this.getCityPependencia('Pando',lista)        
        institution_list.push(city)


        let book = new Workbook();
        const sheet = book.addWorksheet('hoja1', {views: [{showGridLines: false}]});

        // let column = sheet.getColumn('A')
        // column.width = 18;
        
    
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);

        sheet.addRow([`NUMERO DE INSTITUTOS TÉCNICO TECNOLÓGICOS POR TIPO DE CARRERA Y DEPENDENCIA  `]);
        sheet.addRow(["GESTION 2023"]);

        sheet.getRow(5).font = { name:'Nimbus Sans', size: 16, bold: true ,color: {'argb': '485ab7'} };
        sheet.getRow(6).font = { name:'Nimbus Sans', size: 10, bold: true ,color: {'argb': '7280c8'}};
  
        sheet.addRow([]);
         //add the header
        sheet.addRow(['DEPARTAMENTO','CONVENIO_TECNICO','CONVENIO_TECNOLOGICO','CONVENIO_TECNICO_TECNOLOGICO','CONVENIO_TOTAL','FISCAL_TECNICO','FISCAL_TECNOLOGICO','FISCAL_TECNICO_TECNOLOGICO','FISCAL_TOTAL','PRIVADO_TECNICO','PRIVADO_TECNOLOGICO','PRIVADO_TECNICO_TECNOLOGICO','PRIVADO_TOTAL','TOTAL']);
        institution_list.forEach(city => {
            sheet.addRow([city.departamento,city.convenio_tecnica,city.convenio_tecnologica,city.convenio_tecnica_tecnologica, city.convenio_total,city.fiscal_tecnica,city.fiscal_tecnologica,city.fiscal_tecnica_tecnologica, city.fiscal_total, city.privada_tecnica,city.privada_tecnologica,city.privada_tecnica_tecnologica, city.privada_total , city.total])
        });
        
        sheet.getRow(5).height = 30.5;
        [
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',


         
        ].map((key) => {
          let col = sheet.getColumn(key)
            col.width = 25
            if(key !== 'A')
            {
              col.alignment = { vertical: 'middle', horizontal: 'right' };
            }
        });

        [
          'A8',
          'B8',
          'C8',
          'D8',
          'E8',
          'F8',
          'G8',
          'H8',
          'I8',
          'J8',
          'K8',
          'L8',
          'M8',
          'N8',
         
        ].map((key) => {
          sheet.getCell(key).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "E5E5E5" },
          };
          sheet.getCell(key).font = {
            bold: true,
            name:'Nimbus Sans',
          };
          sheet.getCell(key).border = {
            top: { style: 'thin', color: {'argb': 'E5E5E5'} },
            left: { style: 'thin', color: {'argb': 'E5E5E5'} },
            bottom: { style: 'thin', color: {'argb': 'E5E5E5'} },
            right: { style: 'thin', color: {'argb': 'E5E5E5'} }
          };
        });

          //para la imagen
          
          const imageId2 = book.addImage({
            base64: this.getImageLogo(),
            extension: 'png',
          });
          sheet.addImage(imageId2, 'A1:B4');


        let File = await new Promise((resolve, reject) => {
            tmp.file(
              {
                discardDescriptor: true,
                prefix: `institutos_carreras_dependencia`,
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

    async findInsitutosDependenciaUbicacionGeografica()
    {
        const lista = await this.institucionEducativaRepositorio.findDetalleInstitutosAreaGeografica();
        let book = new Workbook();
        const sheet = book.addWorksheet('hoja1', {views: [{showGridLines: false}]});
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);

        sheet.addRow([`DETALLE DE INSTITUTOS TÉCNICOS Y TECNOLOGICOS POR UBICACION GEOGRAFICA  `]);
        sheet.addRow(["GESTION 2023"]);
  
        sheet.getRow(5).font = { name:'Nimbus Sans', size: 16, bold: true ,color: {'argb': '485ab7'} };
        sheet.getRow(6).font = { name:'Nimbus Sans', size: 10, bold: true ,color: {'argb': '7280c8'}};
  
        sheet.addRow([]);
         //add the header
        sheet.addRow(['DEPARTAMENTO','DEPENDENCIA','TIPO','INSTITUTO','AREA_GEOGRAFICA']);

        lista.forEach(item => {
            sheet.addRow([item.departamento,item.dependencia, item.tipo, item.institucion_educativa, item.area_geografica])
        });

        /* configuracion de estilos */
        sheet.getRow(5).height = 30.5;
        [
          'A',
          'B',
          'C',
          'D',
          'E',
           
        ].map((key) => {
          let col = sheet.getColumn(key)
            if(key==='D')
            {
              col.width = 100
            }else{
              col.width = 30
            }
            // if(key !== 'A')
            // {
            //   col.alignment = { vertical: 'middle', horizontal: 'right' };
            // }
        });

        [
          'A8',
          'B8',
          'C8',
          'D8',
          'E8',
  
        ].map((key) => {
          sheet.getCell(key).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "E5E5E5" },
          };
          sheet.getCell(key).font = {
            bold: true,
            name:'Nimbus Sans',
          };
          sheet.getCell(key).border = {
            top: { style: 'thin', color: {'argb': 'E5E5E5'} },
            left: { style: 'thin', color: {'argb': 'E5E5E5'} },
            bottom: { style: 'thin', color: {'argb': 'E5E5E5'} },
            right: { style: 'thin', color: {'argb': 'E5E5E5'} }
          };
        });

          //para la imagen

          const imageId2 = book.addImage({
            base64: this.getImageLogo(),
            extension: 'png',
          });
          sheet.addImage(imageId2, 'A1:A4');


        let File = await new Promise((resolve, reject) => {
            tmp.file(
              {
                discardDescriptor: true,
                prefix: `institutos_dependencia_ubicacion_geografica`,
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

    async findInscritosInsitutosDependenciaDepartamento()
    {
        let lista = await this.institucionEducativaRepositorio.findInscritosInsitutosDependenciaDepartamento()
        console.log('lista',lista)
        let institution_list = []
        
     
        let city = this.getDependencia('La Paz',lista)
        institution_list.push(city)
        
        city = this.getDependencia('Cochabamba',lista)
        institution_list.push(city)
            
        city = this.getDependencia('Chuquisaca',lista)
        institution_list.push(city)

        city = this.getDependencia('Oruro',lista)        
        institution_list.push(city)

        city = this.getDependencia('Potosi',lista)        
        institution_list.push(city)

        city = this.getDependencia('Tarija',lista)        
        institution_list.push(city)

        city = this.getDependencia('Santa Cruz',lista)        
        institution_list.push(city)

        city = this.getDependencia('Beni',lista)        
        institution_list.push(city)

        city = this.getDependencia('Pando',lista)        
        institution_list.push(city)
       
        let book = new Workbook();
        const sheet = book.addWorksheet('hoja1', {views: [{showGridLines: false}]});
        
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);

        sheet.addRow([`CANTIDAD DE ESTUDIANTES INSCRITOS DE INSTITUTOS TÉCNICOS Y TECNOLÓGICOS POR DEPENDENCIA`]);
        sheet.addRow(["GESTION 2023"]);

        sheet.getRow(5).font = { name:'Nimbus Sans', size: 16, bold: true ,color: {'argb': '485ab7'} };
        sheet.getRow(6).font = { name:'Nimbus Sans', size: 10, bold: true ,color: {'argb': '7280c8'}};
  
        sheet.addRow([]);
         //add the header
        sheet.addRow(['DEPARTAMENTO','CONVENIO','FISCAL','PRIVADO','TOTAL']);
        institution_list.forEach(city => {
            sheet.addRow([city.departamento, city.convenio, city.fiscal, city.privado, city.total])
        });

        sheet.getRow(5).height = 30.5;
        [
          'A',
          'B',
          'C',
          'D',
          'E',
          
        ].map((key) => {
          let col = sheet.getColumn(key)
            col.width = 25
            if(key !== 'A')
            {
              col.alignment = { vertical: 'middle', horizontal: 'right' };
            }
        });

        [
          'A8',
          'B8',
          'C8',
          'D8',
          'E8',
         
        ].map((key) => {
          sheet.getCell(key).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "E5E5E5" },
          };
          sheet.getCell(key).font = {
            bold: true,
            name:'Nimbus Sans',
          };
          sheet.getCell(key).border = {
            top: { style: 'thin', color: {'argb': 'E5E5E5'} },
            left: { style: 'thin', color: {'argb': 'E5E5E5'} },
            bottom: { style: 'thin', color: {'argb': 'E5E5E5'} },
            right: { style: 'thin', color: {'argb': 'E5E5E5'} }
          };
        });

          //para la imagen
          
          const imageId2 = book.addImage({
            base64: this.getImageLogo(),
            extension: 'png',
          });
          sheet.addImage(imageId2, 'A1:B4');

        let File = await new Promise((resolve, reject) => {
            tmp.file(
              {
                discardDescriptor: true,
                prefix: `cantidad_inscritos_dependencia`,
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

    async findEstudiantesTipoCarreraDependenciaAnual(){
        let lista  = await this.institucionEducativaRepositorio.findEstudiantesTipoCarreraDependenciaAnual()
        console.log('lista',lista)
        let list = []
        
     
        let educacion = this.getEducacion('Educación Superior Técnica',lista)
        list.push(educacion)
        
        educacion = this.getEducacion('Educación Superior Tecnológica',lista)
        list.push(educacion)
            
        educacion = this.getEducacion('Técnica y Tecnológica',lista)
        list.push(educacion)

        let book = new Workbook();
        const sheet = book.addWorksheet('hoja1', {views: [{showGridLines: false}]});
        
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);

        sheet.addRow([`CANTIDAD DE ESTUDIANTES DE CARRERAS TECNICAS Y TECNOLOGICAS DE REGIMEN ANUAL`]);
        sheet.addRow(["GESTION 2023"]);
       
        sheet.getRow(5).font = { name:'Nimbus Sans', size: 16, bold: true ,color: {'argb': '485ab7'} };
        sheet.getRow(6).font = { name:'Nimbus Sans', size: 10, bold: true ,color: {'argb': '7280c8'}};
  
        sheet.addRow([]);
         //add the header
        sheet.addRow(['CARREAS','CONVENIO','FISCAL','PRIVADO','TOTAL']);
        list.forEach(educacion => {
            sheet.addRow([educacion.departamento, educacion.convenio, educacion.fiscal, educacion.privado, educacion.total])
        });

        sheet.getRow(5).height = 30.5;
        [
          'A',
          'B',
          'C',
          'D',
          'E',
        
        ].map((key) => {
          let col = sheet.getColumn(key)
            col.width = 25
            if(key !== 'A')
            {
              col.alignment = { vertical: 'middle', horizontal: 'right' };
            }
        });

        [
          'A8',
          'B8',
          'C8',
          'D8',
          'E8',
          
        ].map((key) => {
          sheet.getCell(key).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "E5E5E5" },
          };
          sheet.getCell(key).font = {
            bold: true,
            name:'Nimbus Sans',
          };
          sheet.getCell(key).border = {
            top: { style: 'thin', color: {'argb': 'E5E5E5'} },
            left: { style: 'thin', color: {'argb': 'E5E5E5'} },
            bottom: { style: 'thin', color: {'argb': 'E5E5E5'} },
            right: { style: 'thin', color: {'argb': 'E5E5E5'} }
          };
        });

          //para la imagen
          
          const imageId2 = book.addImage({
            base64: this.getImageLogo(),
            extension: 'png',
          });
          sheet.addImage(imageId2, 'A1:B4');

        let File = await new Promise((resolve, reject) => {
            tmp.file(
              {
                discardDescriptor: true,
                prefix: `ANUAL`,
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

    async findEstudiantesTipoCarreraDependenciaSemestre(){
        let lista  = await this.institucionEducativaRepositorio.findEstudiantesTipoCarreraDependenciaSemestre()
        console.log('lista',lista)
        let list = []
        
        
        let educacion = this.getEducacion('Educación Superior Técnica',lista)
        list.push(educacion)
        
        educacion = this.getEducacion('Educación Superior Tecnológica',lista)
        list.push(educacion)
        
        educacion = this.getEducacion('Técnica y Tecnológica',lista)
        list.push(educacion)
        // return list
        
        let book = new Workbook();
        const sheet = book.addWorksheet('hoja1', {views: [{showGridLines: false}]});
      
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);
        
        sheet.addRow([`CANTIDAD DE ESTUDIANTES DE CARRERAS TECNICAS Y TECNOLOGICAS DE REGIMEN SEMESTRE`]);
        sheet.addRow(["GESTION 2023"]);

        sheet.getRow(5).font = { name:'Nimbus Sans', size: 16, bold: true ,color: {'argb': '485ab7'} };
        sheet.getRow(6).font = { name:'Nimbus Sans', size: 10, bold: true ,color: {'argb': '7280c8'}};
  
        sheet.addRow([]);
         //add the header
        sheet.addRow(['CARRERAS','CONVENIO','FISCAL','PRIVADO','TOTAL']);
        list.forEach(educacion => {
            sheet.addRow([educacion.departamento, educacion.convenio, educacion.fiscal, educacion.privado, educacion.total])
        });

        sheet.getRow(5).height = 30.5;
        [
          'A',
          'B',
          'C',
          'D',
          'E',
        
        ].map((key) => {
          let col = sheet.getColumn(key)
            col.width = 25
            if(key !== 'A')
            {
              col.alignment = { vertical: 'middle', horizontal: 'right' };
            }
        });

        [
          'A8',
          'B8',
          'C8',
          'D8',
          'E8',
          
        ].map((key) => {
          sheet.getCell(key).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "E5E5E5" },
          };
          sheet.getCell(key).font = {
            bold: true,
            name:'Nimbus Sans',
          };
          sheet.getCell(key).border = {
            top: { style: 'thin', color: {'argb': 'E5E5E5'} },
            left: { style: 'thin', color: {'argb': 'E5E5E5'} },
            bottom: { style: 'thin', color: {'argb': 'E5E5E5'} },
            right: { style: 'thin', color: {'argb': 'E5E5E5'} }
          };
        });

          //para la imagen
          
          const imageId2 = book.addImage({
            base64: this.getImageLogo(),
            extension: 'png',
          });
          sheet.addImage(imageId2, 'A1:B4');

        let File = await new Promise((resolve, reject) => {
            tmp.file(
              {
                discardDescriptor: true,
                prefix: `reporte_semestre `,
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

    async findEstudiantesDepartamentoGenero()
    {
        let lista = await this.institucionEducativaRepositorio.findEstudiantesDepartamentoGenero()
        console.log('lista',lista)
        let institution_list = []
        
     
        let city = this.getCityGender('La Paz',lista)
        institution_list.push(city)
        
        city = this.getCityGender('Cochabamba',lista)
        institution_list.push(city)
            
        city = this.getCityGender('Chuquisaca',lista)
        institution_list.push(city)

        city = this.getCityGender('Oruro',lista)        
        institution_list.push(city)

        city = this.getCityGender('Potosi',lista)        
        institution_list.push(city)

        city = this.getCityGender('Tarija',lista)        
        institution_list.push(city)

        city = this.getCityGender('Santa Cruz',lista)        
        institution_list.push(city)

        city = this.getCityGender('Beni',lista)        
        institution_list.push(city)

        city = this.getCityGender('Pando',lista)        
        institution_list.push(city)

        let book = new Workbook();
        const sheet = book.addWorksheet('hoja1', {views: [{showGridLines: false}]});
        
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);

        sheet.addRow([`CANTIDAD DE ESTUDIANTES DE INSCRITOS POR SEXO`]);
        sheet.addRow(["GESTION 2023"]);
        
        sheet.getRow(5).font = { name:'Nimbus Sans', size: 16, bold: true ,color: {'argb': '485ab7'} };
        sheet.getRow(6).font = { name:'Nimbus Sans', size: 10, bold: true ,color: {'argb': '7280c8'}};
  
        sheet.addRow([]);
         //add the header
        sheet.addRow(['DEPARTAMENTO','MUJERES','HOMBRES','TOTAL']);
        institution_list.forEach(city => {
            sheet.addRow([city.departamento, city.femenino, city.masculino, city.total])
        });

        sheet.getRow(5).height = 30.5;
        [
          'A',
          'B',
          'C',
          'D',
      
        
        ].map((key) => {
          let col = sheet.getColumn(key)
            col.width = 25
            if(key !== 'A')
            {
              col.alignment = { vertical: 'middle', horizontal: 'right' };
            }
        });

        [
          'A8',
          'B8',
          'C8',
          'D8',
          
          
        ].map((key) => {
          sheet.getCell(key).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "E5E5E5" },
          };
          sheet.getCell(key).font = {
            bold: true,
            name:'Nimbus Sans',
          };
          sheet.getCell(key).border = {
            top: { style: 'thin', color: {'argb': 'E5E5E5'} },
            left: { style: 'thin', color: {'argb': 'E5E5E5'} },
            bottom: { style: 'thin', color: {'argb': 'E5E5E5'} },
            right: { style: 'thin', color: {'argb': 'E5E5E5'} }
          };
        });

          //para la imagen
          
          const imageId2 = book.addImage({
            base64: this.getImageLogo(),
            extension: 'png',
          });
          sheet.addImage(imageId2, 'A1:B4');
        let File = await new Promise((resolve, reject) => {
            tmp.file(
              {
                discardDescriptor: true,
                prefix: `REPORTE_GENERO_DEPARTAMENTO `,
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

    async findDetalleCarrerasInsitutosDependencia()
    {
        let lista = await this.institucionEducativaRepositorio.findDetalleCarrerasInsitutosDependencia()
        // console.log('lista',lista)
        let book = new Workbook();
        const sheet = book.addWorksheet('hoja1', {views: [{showGridLines: false}]});
        
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);

        sheet.addRow([`DETALLE DE CARRERAS TECNICAS Y TECNLOGOCIAS DE INSTITUTOS TECNICOS Y TECNOLOGICOS`]);
        sheet.addRow(["GESTION 2023"]);
        
        sheet.getRow(5).font = { name:'Nimbus Sans', size: 16, bold: true ,color: {'argb': '485ab7'} };
        sheet.getRow(6).font = { name:'Nimbus Sans', size: 10, bold: true ,color: {'argb': '7280c8'}};
  
        sheet.addRow([]);
         //add the header
        sheet.addRow(['CARRERA','INSTITUTO','DEPENDENCIA','DEPARTAMENTO','MUNICIPIO']);
        lista.forEach(item => {
            sheet.addRow([item.carrera, item.institucion_educativa, item.dependencia, item.departamento,  item.municipio])
        });

        sheet.getRow(5).height = 30.5;
        [
          'A',
          'B',
          'C',
          'D',
          'E',
        
        ].map((key) => {
          let col = sheet.getColumn(key)
            col.width = 50
            
        });

        [
          'A8',
          'B8',
          'C8',
          'D8',
          'E8',
          
        ].map((key) => {
          sheet.getCell(key).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "E5E5E5" },
          };
          sheet.getCell(key).font = {
            bold: true,
            name:'Nimbus Sans',
          };
          sheet.getCell(key).border = {
            top: { style: 'thin', color: {'argb': 'E5E5E5'} },
            left: { style: 'thin', color: {'argb': 'E5E5E5'} },
            bottom: { style: 'thin', color: {'argb': 'E5E5E5'} },
            right: { style: 'thin', color: {'argb': 'E5E5E5'} }
          };
        });

          //para la imagen
          
          const imageId2 = book.addImage({
            base64: this.getImageLogo(),
            extension: 'png',
          });
          
        sheet.addImage(imageId2, 'A1:A4');

        let File = await new Promise((resolve, reject) => {
            tmp.file(
              {
                discardDescriptor: true,
                prefix: `REPORTE_DETALLE_CARRERA_INSTITUTO `,
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

    async getDetalleCarreraTipo()
    {
      let lista = await this.institucionEducativaRepositorio.getDetalleCarreraTipo();

      let book = new Workbook();
        const sheet = book.addWorksheet('hoja1', {views: [{showGridLines: false}]});
       
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);
        sheet.addRow([]);

        sheet.addRow([`DETALLE DE CARRERAS POR TIPO`]);
        sheet.addRow(["GESTION 2023"]);
        
        sheet.getRow(5).font = { name:'Nimbus Sans', size: 16, bold: true ,color: {'argb': '485ab7'} };
        sheet.getRow(6).font = { name:'Nimbus Sans', size: 10, bold: true ,color: {'argb': '7280c8'}};
  
        sheet.addRow([]);
         //add the header
        sheet.addRow(['TIPO_DE_CARRERA','CARRERA']);
        lista.forEach(item => {
            sheet.addRow([item.educacion, item.total])
        });
        sheet.getRow(5).height = 30.5;
        [
          'A',
          'B',
         
        
        ].map((key) => {
          let col = sheet.getColumn(key)
            if(key==='A')
            { 
              col.width = 40
            }else{
              col.width = 25
            }
            if(key !== 'A')
            {
              col.alignment = { vertical: 'middle', horizontal: 'right' };
            }
        });

        [
          'A8',
          'B8',
         
          
        ].map((key) => {
          sheet.getCell(key).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "E5E5E5" },
          };
          sheet.getCell(key).font = {
            bold: true,
            name:'Nimbus Sans',
          };
          sheet.getCell(key).border = {
            top: { style: 'thin', color: {'argb': 'E5E5E5'} },
            left: { style: 'thin', color: {'argb': 'E5E5E5'} },
            bottom: { style: 'thin', color: {'argb': 'E5E5E5'} },
            right: { style: 'thin', color: {'argb': 'E5E5E5'} }
          };
        });

          //para la imagen
          
          const imageId2 = book.addImage({
            base64: this.getImageLogo(),
            extension: 'png',
          });
          sheet.addImage(imageId2, 'A1:A4');
        let File = await new Promise((resolve, reject) => {
            tmp.file(
              {
                discardDescriptor: true,
                prefix: `REPORTE_DETALLE_TIPO_CARRARA `,
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
    async getCantidadEstudianteCarrera()
    {
      let lista = await this.institucionEducativaRepositorio.getCantidadEstudianteCarrera();
        
      let book = new Workbook();
      const sheet = book.addWorksheet('hoja1', {views: [{showGridLines: false}]});
      
      sheet.addRow([]);
      sheet.addRow([]);
      sheet.addRow([]);
      sheet.addRow([]);

      sheet.addRow([`CANTIDAD DE ESTUDIANTES POR CARRERA`]);
      sheet.addRow(["GESTION 2023"]);

      sheet.getRow(5).font = { name:'Nimbus Sans', size: 16, bold: true ,color: {'argb': '485ab7'} };
      sheet.getRow(6).font = { name:'Nimbus Sans', size: 10, bold: true ,color: {'argb': '7280c8'}};

      sheet.addRow([]);
       //add the header
      sheet.addRow(['CARRERA','CANTIDAD_ESTUDIANTES']);
      lista.forEach(item => {
          sheet.addRow([item.carrera, item.total])
      });

      sheet.getRow(5).height = 30.5;
        [
          'A',
          'B',
         
        
        ].map((key) => {
          let col = sheet.getColumn(key)
            if(key==='A')
            { 
              col.width = 40
            }else{
              col.width = 25
            }
            if(key !== 'A')
            {
              col.alignment = { vertical: 'middle', horizontal: 'right' };
            }
        });

        [
          'A8',
          'B8',
         
          
        ].map((key) => {
          sheet.getCell(key).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "E5E5E5" },
          };
          sheet.getCell(key).font = {
            bold: true,
            name:'Nimbus Sans',
          };
          sheet.getCell(key).border = {
            top: { style: 'thin', color: {'argb': 'E5E5E5'} },
            left: { style: 'thin', color: {'argb': 'E5E5E5'} },
            bottom: { style: 'thin', color: {'argb': 'E5E5E5'} },
            right: { style: 'thin', color: {'argb': 'E5E5E5'} }
          };
        });

          //para la imagen
          
          const imageId2 = book.addImage({
            base64: this.getImageLogo(),
            extension: 'png',
          });
          sheet.addImage(imageId2, 'A1:A4');

      let File = await new Promise((resolve, reject) => {
          tmp.file(
            {
              discardDescriptor: true,
              prefix: `REPORTE_ESTUDIANTES_CARRERA `,
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

    async getNumeroEstudiantesMatriculasdosAreaGeograficaDependencia()
    {
      let lista = await this.institucionEducativaRepository.query(`select dt.dependencia as dependencia, agt.area_geografica, count(agt.area_geografica) as total_area_geografica from tmp_gen_itt_superior_listado_itts_matricula_fin tgislimf
      inner join institucion_educativa_acreditacion iea on iea.institucion_educativa_id = tgislimf.cod_ue_id 
      inner join institucion_educativa ie on ie.id = tgislimf.cod_ue_id 
      inner join dependencia_tipo dt on dt.id = iea.dependencia_tipo_id
      inner join jurisdiccion_geografica jg on ie.jurisdiccion_geografica_id = jg .id 
      inner join unidad_territorial ut on jg.localidad_unidad_territorial_2001_id = ut.id 
      inner join area_geografica_tipo agt on ut.area_geografica_tipo_id = agt.id
      group by dt.dependencia, agt.area_geografica 
      order by dt.dependencia asc, agt.area_geografica asc;`);
      let total = 0;
      for(let item of lista)
      {
        total += parseInt(item.total_area_geografica)
      }

      lista.push({dependencia:'',area_geografica: 'TOTAL',total_area_geografica: total })
        
      let book = new Workbook();
      const sheet = book.addWorksheet('hoja1', {views: [{showGridLines: false}]});
      
      sheet.addRow([]);
      sheet.addRow([]);
      sheet.addRow([]);
      sheet.addRow([]);

      sheet.addRow([`BOLIVIA: Numero de estudiantes matriculados por área geográfica segun dependencia`]);
      sheet.addRow(["GESTION 2023"]);

      sheet.getRow(5).font = { name:'Nimbus Sans', size: 16, bold: true ,color: {'argb': '485ab7'} };
      sheet.getRow(6).font = { name:'Nimbus Sans', size: 10, bold: true ,color: {'argb': '7280c8'}};

      sheet.addRow([]);
       //add the header
      sheet.addRow(['DEPENDENCIA','ÁREA GEOGRÁFICA','CANTIDAD DE ESTUDIANTES']);
      lista.forEach(item => {
          sheet.addRow([item.dependencia, item.area_geografica, item.total_area_geografica])
      });

      sheet.getRow(5).height = 30.5;
        [
          'A',
          'B',
          'C',
          'D',
          'E',
         
        
        ].map((key) => {
          let col = sheet.getColumn(key)
            if(key==='A')
            { 
              col.width = 15
            }else{
              col.width = 20
            }
            if(key !== 'A')
            {
              col.alignment = { vertical: 'middle', horizontal: 'right' };
            }

            if(key==='C')
            { 
              col.width = 30
              col.alignment = { vertical: 'middle', horizontal: 'right' };
            }
        });

      

          //para la imagen

          lista = await this.institucionEducativaRepository.query(`select tgislimf.id_departamento , tgislimf.desc_departamento, dt.dependencia as dependencia, tgislimf.carrera,  agt.area_geografica, count(agt.area_geografica) as total_area_geografica 
          from tmp_gen_itt_superior_listado_itts_matricula_fin tgislimf
          inner join institucion_educativa_acreditacion iea on iea.institucion_educativa_id = tgislimf.cod_ue_id 
          inner join institucion_educativa ie on ie.id = tgislimf.cod_ue_id 
          inner join dependencia_tipo dt on dt.id = iea.dependencia_tipo_id
          inner join jurisdiccion_geografica jg on ie.jurisdiccion_geografica_id = jg .id 
          inner join unidad_territorial ut on jg.localidad_unidad_territorial_2001_id = ut.id 
          inner join area_geografica_tipo agt on ut.area_geografica_tipo_id = agt.id
          group by dt.dependencia, agt.area_geografica, tgislimf.desc_departamento, tgislimf.carrera, tgislimf.id_departamento
          order by tgislimf.id_departamento asc, dt.dependencia asc, carrera asc;`)

          sheet.addRow([]);
          sheet.addRow([]);
          sheet.addRow(['DEPARTAMENTO','DEPENDENCIA','CARRERA','ÁREA GEOGRÁFICA','CANTIDAD DE ESTUDIANTES']);
          lista.forEach(item => {
              sheet.addRow([item.desc_departamento,item.dependencia, item.carrera , item.area_geografica, item.total_area_geografica])
          });


          const imageId2 = book.addImage({
            base64: this.getImageLogo(),
            extension: 'png',
          });
          
          sheet.addImage(imageId2, 'A1:A4');

          [
            'A8',
            'B8',
            'C8',
            'A15',
            'B15',
            'C15',
  
            'A18',
            'B18',
            'C18',
            'D18',
            'E18',
            
          ].map((key) => {
            sheet.getCell(key).fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "E5E5E5" },
            };
            sheet.getCell(key).font = {
              bold: true,
              name:'Nimbus Sans',
            };
            sheet.getCell(key).border = {
              top: { style: 'thin', color: {'argb': 'E5E5E5'} },
              left: { style: 'thin', color: {'argb': 'E5E5E5'} },
              bottom: { style: 'thin', color: {'argb': 'E5E5E5'} },
              right: { style: 'thin', color: {'argb': 'E5E5E5'} }
            };
          });
      let File = await new Promise((resolve, reject) => {
          tmp.file(
            {
              discardDescriptor: true,
              prefix: `REPORTE_MATRICULADOS_DEPENDENCIA_AREA_GEOGRAFICA `,
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


    async getTotalGeneral(){
        const lista = await this.institucionEducativaRepositorio.findTotalGeneral();
        return lista;
    }
    async getListaInstitutosLugarDependencias(lugar, dependencia){
        const lista = await this.institucionEducativaRepositorio.findListaInstitutosPorLugarDependencia(lugar, dependencia);
        return lista;
    }
    async getListaLugarDependenciasEstudiantes(lugar, dependencia){
        const lista = await this.institucionEducativaRepositorio.findListaLugarDependenciasEstudiantes(lugar, dependencia);
        return lista;
    }

    //para reporte 
    async getCountCareer(unidad_educativa_id: number)
    {
        let instituto = await this.institucionEducativaRepositorio.getInsititution(unidad_educativa_id)
        
        return new Promise((resolve)=>{
            let count = 0
            instituto.sucursales.forEach(sucursal => {
                count += sucursal.carreras.length
            });
            console.log(count)
            resolve(count)
        })
    }

    //para reporte de carreras ->asignautas estudiantes
    async getCareersInstitution(unidad_educativa_id:number)
    {
        let instituto = await this.institucionEducativaRepositorio.getInsititution(unidad_educativa_id)
   
        return instituto
    }

    async getCarreraAutorizadaResolucion(carrera_autorizada_id)
    {
        return await this.institucionEducativaRepositorio.getCarreraAutorizadaResolution(carrera_autorizada_id)
    }

    
    async getBySieId(id:number){

        const itt = await this.institucionEducativaRepositorio.getBySieId(id);
                
        if(!itt){
            return this._serviceResp.respuestaHttp404(
                id,
                'Registro No Encontrado !!',
                '',
              );
        }

        return this._serviceResp.respuestaHttp200(
            itt,
            '',
            '',
          );
          //return itt;
    }
   
    async findBySie( id:number ){
        const itts = await this.institucionEducativaRepositorio.findBySie(id);
        if(!itts){
            return this._serviceResp.respuestaHttp404(
                id,
                'Registro No Encontrado !!',
                '',
              );
        }

        return this._serviceResp.respuestaHttp200(
            itts,
            '',
            '',
          );
          //return itt;
    }
    async findAcreditacionBySie( id:number ){
        const itts = await this.institucionEducativaRepositorio.findAcreditacionBySie(id);
        return itts;
    }

    async findOneAcreditadoBySie( id:number ){
        console.log(id);
        const itt = await this.institucionEducativaRepositorio.findOneAcreditadoBySie(id);
        return itt;
    }
    async findEspecialidadBySie( id:number ){

        const itts = await this.institucionEducativaRepositorio.findEspecialidadBySie(id);
        
        return itts;
    }
    async findEtapasBySie( id:number ){
        const carreras = await this.institucionEducativaRepositorio.findEtapasBySie(id);
        return carreras;
    }

    async findCarrerasBySie( id:number ){
        const data = await this.institucionEducativaRepositorio.findCarrerasBySie(id);
        console.log(data);
        return data;
    }
    async findSucursalGestion( sie:number, gestion:number ){

        console.log("consulta");
        console.log(sie);
        console.log(gestion);
        const sucursal = await this.institucionEducativaRepositorio.findSucursalGestion(sie, gestion);
        return sucursal;
    }

    async generateCodigo(id:number){
        const codigo =  await this.institucionEducativaRepositorio.getCodigo(id);

        return codigo;
       
   }
    

    async createInstitucionEducativa (dto: CreateInstitucionEducativaDto, file, user:UserEntity) {

        const institucion =  await this.institucionEducativaRepositorio.findInstitucionEducativaLugarNombre(dto.jurisdiccion_geografica_id, dto.institucion_educativa);
        
        if(!institucion){
            //console.log(dto);
            const codigo =  await this.generateCodigo(dto.jurisdiccion_geografica_id);
            dto.codigo = codigo;
            console.log("objeto: " + dto);
            const op = async (transaction: EntityManager) => {
              const nuevaInstitucion =  await this.institucionEducativaRepositorio.crearInstitucionEducativa(
                dto,
                transaction
              )
  
              if(nuevaInstitucion.id){
                  console.log(nuevaInstitucion);    
                  //Obtener la acreditación
                  const acreditacion  = await this.institucionEducativaAcreditacionRepositorio.findAcreditacion(codigo);
                  console.log(acreditacion);   
      
                  if(!acreditacion){
                      //Crear la acreditación 
                      await this.institucionEducativaAcreditacionRepositorio.createInstitucionEducativaAcreditacion(
                          user.id,
                          codigo, 
                          dto, 
                          transaction
                      );
                  }
                  
                  //Obtener la sucursal
                  const sucursal  = await this.institucionEducativaSucursalRepositorio.findSucursalBySieVigente(codigo);
                  console.log(sucursal);  
                  if(!sucursal){
                    await this.institucionEducativaSucursalRepositorio.createInstitucionEducativaSucursal(
                        user.id,
                        codigo, 
                        dto, 
                        transaction
                    );
                  }
                  if(file!=''){ //insertar la imagen
                    await this.institucionEducativaImagenRepositorio.inhabilitaImagen(nuevaInstitucion.id);
                    await this.institucionEducativaImagenRepositorio.createInstitucionEducativaImagen(
                        user.id,
                        nuevaInstitucion.id, 
                        file,  
                        transaction
                        );
                  }
              }
              return nuevaInstitucion;
            }
  
            const crearResult = await this.institucionEducativaRepositorio.runTransaction(op)
  
            if(crearResult){
              return this._serviceResp.respuestaHttp201(
                  crearResult,
                  'Registro de Institución Educativa Creado !!',
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

    async updateInstitucionEducativa (id:number,dto: CreateInstitucionEducativaDto, file) {

        const institucion =  await this.institucionEducativaRepositorio.getBySieId(id);
        if(institucion){
            const op = async (transaction: EntityManager) => {
             const institucion =  await this.institucionEducativaRepositorio.updateInstitucionEducativa(
                id,
                dto,
                transaction
              )
              const acreditacion  = await this.institucionEducativaAcreditacionRepositorio.findAcreditacion(id);
                if(acreditacion){
                await this.institucionEducativaAcreditacionRepositorio.updateInstitucionEducativaAcreditacion(
                    id,
                    dto, 
                    transaction
                    );
                }
                const sucursal  = await this.institucionEducativaSucursalRepositorio.findSucursalBySieVigente(id);
                 
                if(sucursal){
                  await this.institucionEducativaSucursalRepositorio.updateInstitucionEducativaSucursal(
                      id, 
                      dto, 
                      transaction
                  );
                }
                if(file!=''){
                    await this.institucionEducativaImagenRepositorio.inhabilitaImagen(id);
                    await this.institucionEducativaImagenRepositorio.createInstitucionEducativaImagen(
                        1, 
                        id, 
                        file,  
                        transaction
                        );
                  }
              return institucion;
            }
            const crearResult = await this.institucionEducativaRepositorio.runTransaction(op)
            if(crearResult){
              return this._serviceResp.respuestaHttp201(
                  crearResult,
                  'Registro de Institución Educativa Creado !!',
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
    /**helpers */
    getCity (value,list )
    {
        let result = list.filter((o)=>{return o.departamento === value})
        let object = null
        let departamento_id=0
        let fiscal_id = 0
        let privado_id = 0
        let convenio_id = 0 
        if(result.length > 0)
        {
            //populate data
            object = {}
            result.forEach(element => {
                if(element.dependencia==='FISCAL')
                {
                    object.fiscal = parseInt(element.total) 
                    fiscal_id = element.dependencia_id
                }

                if(element.dependencia==='PRIVADO')
                {
                    object.privado = parseInt(element.total) 
                    privado_id = element.dependencia_id
                }

                if(element.dependencia==='CONVENIO')
                {
                    object.convenio = parseInt(element.total) 
                    convenio_id = element.dependencia_id
                }
                departamento_id = element.departamento_id
            });

            if (!('fiscal' in object))
            {
                object.fiscal = 0
            }

            if (!('privado' in object))
            {
                object.privado = 0
            }

            if (!('convenio' in object))
            {
                object.convenio = 0
            }
        }

        if(!object)
        {   
            object = {}
            object.fiscal = 0
            object.privado = 0
            object.convenio = 0
        
        }
        object.fiscal_id = fiscal_id
        object.privado_id = privado_id
        object.convenio_id = convenio_id
        object.departamento_id = departamento_id
        object.departamento = value
        object.total = object.convenio + object.fiscal + object.privado
        return object
    }

    getDependencia(value, list)
    {
        console.log('iniciando busqueda')
        console.log('ciudad',value)
        let result = list.filter((o)=>{return o.lugar === value})
        console.log(result)
        let object = null
       
       
        if(result.length > 0)
        {
            //populate data
            object = {}
            result.forEach(element => {
                //  console.log(element)
                if(element.dependencia === 'FISCAL')
                {
                    
                    object.fiscal = parseInt(element.total) 
       
                }

                if(element.dependencia === 'CONVENIO')
                {
                    object.convenio = parseInt(element.total) 
        
                }

                if(element.dependencia === 'PRIVADO')
                {
                    object.privado = parseInt(element.total) 
        
                }

                console.log('objeto',object)
            });

            if (!('fiscal' in object))
            {
                object.fiscal = 0
            }

            if (!('convenio' in object))
            {
                object.convenio = 0
            }

            if (!('privado' in object))
            {
                object.privado = 0
            }
        }
        // console.log('objeto2',object)
        if(!object)
        {   
            object = {}
            object.fiscal = 0
            object.convenio = 0
            object.privado = 0
           
        }
        // console.log('objeto3',object)
        object.departamento = value
        object.total =  object.fiscal + object.convenio + object.privado

        return object
    }

    getAreaGeografica(value, list)
    {
        console.log('iniciando busqueda')
        let result = list.filter((o)=>{return o.departamento === value})
        console.log(result)
        let object = null
        let departamento_id=0
        let rural_id = 0
        let urbano_id = 0
    
        if(result.length > 0)
        {
            //populate data
            object = {}
            result.forEach(element => {
                //  console.log(element)
                if(element.area_geografica === 'Rural')
                {
                    
                    object.rural = parseInt(element.total) 
                    rural_id = element.area_geografica_tipo_id
                }

                if(element.area_geografica === 'Urbano')
                {
                    object.urbano = parseInt(element.total) 
                    urbano_id = element.area_geografica_tipo_id
                }

                console.log('objeto',object)
                departamento_id = element.departamento_id
            });

            if (!('rural' in object))
            {
                object.rural = 0
            }
            if (!('urbano' in object))
            {
                object.urbano = 0
            }
        }
        // console.log('objeto2',object)
        if(!object)
        {   
            object = {}
            object.urbano = 0
            object.rural = 0
           
        }
        // console.log('objeto3',object)
        object.rural_id = rural_id
        object.urbano_id = urbano_id
        object.departamento_id = departamento_id
        object.departamento = value
        object.total =  object.urbano + object.rural
        return object
    }
    getCityPependencia(value, list)
    {
        // console.log('iniciando busqueda')
        let result = list.filter((o)=>{return o.departamento === value})
        // console.log(result)
   
        let privada_tecnica_tecnologica = 0
        let privada_tecnica = 0
        let privada_tecnologica = 0
        let fiscal_tecnica_tecnologica = 0
        let fiscal_tecnica = 0
        let fiscal_tecnologica = 0
        let convenio_tecnica_tecnologica = 0
        let convenio_tecnica = 0
        let convenio_tecnologica = 0

        if(result.length > 0)
        {
           
            result.forEach(element => {
            
                if(element.dependencia === 'PRIVADO')
                {
                    if(element.educacion === 'Técnica y Tecnológica')
                    {
                        privada_tecnica_tecnologica += parseInt(element.total)
                    } 
                    
                    if(element.educacion === 'Educación Superior Técnica')
                    {
                        privada_tecnica += parseInt(element.total)
                    } 
                    if(element.educacion === 'Educación Superior Tecnológica')
                    {
                        privada_tecnologica += parseInt(element.total)
                    }      
                }

                if(element.dependencia === 'FISCAL')
                {
                    if(element.educacion === 'Técnica y Tecnológica')
                    {
                        fiscal_tecnica_tecnologica += parseInt(element.total)
                    } 
                    
                    if(element.educacion === 'Educación Superior Técnica')
                    {
                        fiscal_tecnica += parseInt(element.total)
                    } 
                    if(element.educacion === 'Educación Superior Tecnológica')
                    {
                        fiscal_tecnologica += parseInt(element.total)
                    }      
                }


                if(element.dependencia === 'CONVENIO')
                {
                    if(element.educacion === 'Técnica y Tecnológica')
                    {
                        convenio_tecnica_tecnologica += parseInt(element.total)
                    } 
                    
                    if(element.educacion === 'Educación Superior Técnica')
                    {
                        convenio_tecnica += parseInt(element.total)
                    } 
                    if(element.educacion === 'Educación Superior Tecnológica')
                    {
                        convenio_tecnologica += parseInt(element.total)
                    }      
                }

              
               
            });

        }
        let object = {
            privada_tecnica_tecnologica: privada_tecnica_tecnologica,
            privada_tecnica: privada_tecnica,
            privada_tecnologica: privada_tecnologica,
            privada_total: privada_tecnica_tecnologica + privada_tecnica + privada_tecnologica,
            fiscal_tecnica_tecnologica: fiscal_tecnica_tecnologica,
            fiscal_tecnica: fiscal_tecnica,
            fiscal_tecnologica: fiscal_tecnologica,
            fiscal_total: fiscal_tecnica_tecnologica + fiscal_tecnica + fiscal_tecnologica,
            convenio_tecnica_tecnologica: convenio_tecnica_tecnologica,
            convenio_tecnica: convenio_tecnica,
            convenio_tecnologica: convenio_tecnologica,
            convenio_total: convenio_tecnica_tecnologica + convenio_tecnica + convenio_tecnologica,
            departamento: value,
            total: 0
        }
        object.total = object.fiscal_total + object.privada_total + object.convenio_total
    
        return object
    }

    getEducacion(value,list)
    {
        console.log('iniciando busqueda')
        console.log('educacion',value)
        let result = list.filter((o)=>{
            console.log('o.educacion:',o.educacion)
            console.log('value:',o.educacion)
            return o.educacion === value
        })
        console.log('resultado',result)
        let object = null
       
       
        if(result.length > 0)
        {
            //populate data
            object = {}
            result.forEach(element => {
                //  console.log(element)
                if(element.dependencia === 'FISCAL')
                {
                    
                    object.fiscal = parseInt(element.total) 
       
                }

                if(element.dependencia === 'CONVENIO')
                {
                    object.convenio = parseInt(element.total) 
        
                }

                if(element.dependencia === 'PRIVADO')
                {
                    object.privado = parseInt(element.total) 
        
                }

                console.log('objeto',object)
            });

            if (!('fiscal' in object))
            {
                object.fiscal = 0
            }

            if (!('convenio' in object))
            {
                object.convenio = 0
            }

            if (!('privado' in object))
            {
                object.privado = 0
            }
        }
        // console.log('objeto2',object)
        if(!object)
        {   
            object = {}
            object.fiscal = 0
            object.convenio = 0
            object.privado = 0
           
        }
        // console.log('objeto3',object)
        object.departamento = value
        object.total =  object.fiscal + object.convenio + object.privado

        return object
    }

    getCityGender(value, list)
    {
        console.log('iniciando busqueda')
        console.log('ciudad',value)
        let result = list.filter((o)=>{return o.lugar === value})
        console.log(result)
        let object = null
       
       
        if(result.length > 0)
        {
            //populate data
            object = {}
            result.forEach(element => {
                //  console.log(element)
                if(element.genero === 'Masculino')
                {
                    
                    object.masculino = parseInt(element.total) 
       
                }

                if(element.genero === 'Femenino')
                {
                    object.femenino = parseInt(element.total) 
        
                }

                console.log('objeto',object)
            });

            if (!('masculino' in object))
            {
                object.masculino = 0
            }

            if (!('femenino' in object))
            {
                object.femenino = 0
            }
        }
        // console.log('objeto2',object)
        if(!object)
        {   
            object = {}
            object.femenino = 0
            object.masculino = 0           
        }
        // console.log('objeto3',object)
        object.departamento = value
        object.total =  object.masculino + object.femenino

        return object
    }

    getImageLogo()
    {
      return "data:image/png;base64,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"
    }
}
