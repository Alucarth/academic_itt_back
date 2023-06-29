import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {  InjectRepository } from '@nestjs/typeorm';
import { InstitucionEducativa } from 'src/academico/entidades/institucionEducativa.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager, Repository } from 'typeorm';
import { InstitucionEducativaAcreditacionRepository } from '../institucion_educativa_acreditacion/institucion_educativa_acreditacion.repository';
import { InstitucionEducativaSucursalRepository } from '../institucion_educativa_sucursal/institucion_educativa_sucursal.repository';
import { CreateInstitucionEducativaDto } from './dto/createInstitucionEducativa.dto';
import { InstitucionEducativaRepository } from './institucion_educativa.repository';


@Injectable()
export class InstitucionEducativaService {
    constructor(
        @InjectRepository(InstitucionEducativa) private institucionEducativaRepository: Repository<InstitucionEducativa>,
        @Inject(InstitucionEducativaRepository) private institucionEducativaRepositorio: InstitucionEducativaRepository,
        @Inject(InstitucionEducativaAcreditacionRepository) private institucionEducativaAcreditacionRepositorio: InstitucionEducativaAcreditacionRepository,
        @Inject(InstitucionEducativaSucursalRepository) private institucionEducativaSucursalRepositorio: InstitucionEducativaSucursalRepository,
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
        const list = await this.institucionEducativaRepositorio.findTotalDependencias();
        
        const lista = list.reduce((acc, curr) => {
            const { departamento, dependencia, total } = curr;
            const dependenciaData = { dependencia, total: parseInt(total, 10) };
          
            if (acc[departamento]) {
              acc[departamento].push(dependenciaData);
            } else {
              acc[departamento] = [dependenciaData];
            }
          
            return acc;
          }, {});
          
         // console.log(lista);

        return lista;
    }
    async getListaLugarDependencias(lugar, dependencia){
        const lista = await this.institucionEducativaRepositorio.findListaLugarDependencias(lugar, dependencia);
        /*
        const lista = list.reduce((acc, curr) => {
            const { departamento, dependencia, total } = curr;
            const dependenciaData = { dependencia, total: parseInt(total, 10) };
          
            if (acc[departamento]) {
              acc[departamento].push(dependenciaData);
            } else {
              acc[departamento] = [dependenciaData];
            }
          
            return acc;
          }, {});*/
          
         // console.log(lista);

        return lista;
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
    

    async createInstitucionEducativa (dto: CreateInstitucionEducativaDto) {

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
                  //Obtener todas las asignaturas
                  const acreditacion  = await this.institucionEducativaAcreditacionRepositorio.findAcreditacion(codigo);
                  console.log(acreditacion);   
      
                  if(!acreditacion){
                      //Crear la oferta academica 
                      await this.institucionEducativaAcreditacionRepositorio.createInstitucionEducativaAcreditacion(
                          1, 
                          codigo, 
                          dto, 
                          transaction
                      );
                  }
                  
                  //Obtener todas las asignaturas
                  const sucursal  = await this.institucionEducativaSucursalRepositorio.findSucursalBySieVigente(codigo);
                  console.log(sucursal);  
                  if(!sucursal){
                    await this.institucionEducativaSucursalRepositorio.createInstitucionEducativaSucursal(
                        1, 
                        codigo, 
                        dto, 
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
}
