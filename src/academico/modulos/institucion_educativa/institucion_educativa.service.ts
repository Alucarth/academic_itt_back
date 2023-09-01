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
         sheet.addRow([`NUMERO DE INSTITUTOS TECNICO TECNOLOGICOS   `]);
         sheet.addRow(["GESTION 2023"]);
         sheet.getRow(1).font = { size: 16, bold: true };
         sheet.getRow(2).font = { size: 12, bold: true };
   
         sheet.addRow([]);
          //add the header
         sheet.addRow(['DEPARTAMENTO','URBANO','RURAL','TOTAL']);
         institution_list.forEach(city => {
             sheet.addRow([city.departamento,city.urbano, city.rural, city.total])
         });
 
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
        let privado = []
        let fiscal = []
        let convenio = []
        let ciudades = [] 
        let city = this.getCity('La Paz',lista)
        console.log(city)
        ciudades.push('LP')
        institution_list.push(city)

        fiscal.push(city.fiscal)
        privado.push(city.privado)
        convenio.push(city.convenio)

        city = this.getCity('Cochabamba',lista)
        ciudades.push('CBB')
        institution_list.push(city)

        fiscal.push(city.fiscal)
        privado.push(city.privado)
        convenio.push(city.convenio)

        city = this.getCity('Chuquisaca',lista)
        ciudades.push('CHU')
        institution_list.push(city)

        fiscal.push(city.fiscal)
        privado.push(city.privado)
        convenio.push(city.convenio)

        city = this.getCity('Oruro',lista)
        ciudades.push('OR')
        institution_list.push(city)

        fiscal.push(city.fiscal)
        privado.push(city.privado)
        convenio.push(city.convenio)

        city = this.getCity('Potosi',lista)
        ciudades.push('PT')
        institution_list.push(city)

        fiscal.push(city.fiscal)
        privado.push(city.privado)
        convenio.push(city.convenio)

        city = this.getCity('Tarija',lista)
        ciudades.push('TJ')
        institution_list.push(city)

        fiscal.push(city.fiscal)
        privado.push(city.privado)
        convenio.push(city.convenio)

        city = this.getCity('Santa Cruz',lista)
        ciudades.push('SZC')
        institution_list.push(city)

        fiscal.push(city.fiscal)
        privado.push(city.privado)
        convenio.push(city.convenio)

        city = this.getCity('Beni',lista)
        ciudades.push('BN')
        institution_list.push(city)

        fiscal.push(city.fiscal)
        privado.push(city.privado)
        convenio.push(city.convenio)

        city = this.getCity('Pando',lista)
        ciudades.push('PN')
        institution_list.push(city)

        fiscal.push(city.fiscal)
        privado.push(city.privado)
        convenio.push(city.convenio)

        //creating a workbook
        let book = new Workbook();
        const sheet = book.addWorksheet('hoja1', {views: [{showGridLines: false}]});
        sheet.addRow([]);
        sheet.addRow([`NUMERO DE INSTITUTOS TECNICO TECNOLOGICOS   `]);
        sheet.addRow(["GESTION 2023"]);
        sheet.getRow(1).font = { size: 16, bold: true };
        sheet.getRow(2).font = { size: 12, bold: true };
  
        sheet.addRow([]);
         //add the header
        sheet.addRow(['DEPARTAMENTO','CONVENIO','FISCAL','PRIVADO','TOTAL']);
        institution_list.forEach(city => {
            sheet.addRow([city.departamento,city.convenio, city.fiscal, city.privado, city.total])
        });

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
        sheet.addRow([]);
        sheet.addRow([`NUMERO DE INSTITUTOS TECNICO TECNOLOGICOS POR TIPO DE CARRERA Y DEPENDENCIA  `]);
        sheet.addRow(["GESTION 2023"]);
        sheet.getRow(1).font = { size: 16, bold: true };
        sheet.getRow(2).font = { size: 12, bold: true };
  
        sheet.addRow([]);
         //add the header
        sheet.addRow(['DEPARTAMENTO','CONVENIO_TECNICO','CONVENIO_TECNOLOGICO','CONVENIO_TECNICO_TECNOLOGICO','CONVENIO_TOTAL','FISCAL_TECNICO','FISCAL_TECNOLOGICO','FISCAL_TECNICO_TECNOLOGICO','FISCAL_TOTAL','PRIVADO_TECNICO','PRIVADO_TECNOLOGICO','PRIVADO_TECNICO_TECNOLOGICO','PRIVADO_TOTAL','TOTAL']);
        institution_list.forEach(city => {
            sheet.addRow([city.departamento,city.convenio_tecnica,city.convenio_tecnologica,city.convenio_tecnica_tecnologica, city.convenio_total,city.fiscal_tecnica,city.fiscal_tecnologica,city.fiscal_tecnica_tecnologica, city.fiscal_total, city.privada_tecnica,city.privada_tecnologica,city.privada_tecnica_tecnologica, city.privada_total , city.total])
        });

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
        console.log(result)
   
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
}
