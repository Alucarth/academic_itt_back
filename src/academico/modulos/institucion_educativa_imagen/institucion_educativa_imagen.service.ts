import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager, Repository } from 'typeorm';
import { CreateInstitucionEducativaImagenDto } from './dto/createInstitucionEducativaImagen.dto';
import { InstitucionEducativaImagenRepository } from './institucion_educativa_imagen.repository';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { TblAuxiliarSie } from 'src/academico/entidades/tblAuxiliarSie';
import e from 'express';
@Injectable()
export class InstitucionEducativaImagenService {
    constructor(
        @Inject(InstitucionEducativaImagenRepository) private institucionEducativaImagenRepositorio: InstitucionEducativaImagenRepository,
        @InjectRepository(TblAuxiliarSie, "siedb")
        private sieRepository: Repository<TblAuxiliarSie>,
        private _serviceResp: RespuestaSigedService, 
    ){}

    async getAll(){
        return await this.institucionEducativaImagenRepositorio.getAll();
    }

    async getOneActivoBySieId(id:number){
        return await this.institucionEducativaImagenRepositorio.getActivoById(id);
    }
    
    async getById(id: number){
        const file = await this.institucionEducativaImagenRepositorio.findOneInstitutoLogo(id)
        return file
    }
    async createInstitucionEducativaImagen(dto:CreateInstitucionEducativaImagenDto, file){
        if(file!=''){ //insertar la imagen
            console.log("guardar");
            const op = async (transaction: EntityManager) => {
            await this.institucionEducativaImagenRepositorio.inhabilitaImagen(dto.institucion_educativa_id);
           const imagen = await this.institucionEducativaImagenRepositorio.createInstitucionEducativaImagen(
                1, 
                dto.institucion_educativa_id,
                file,  
                transaction
                );
                return imagen;
            }
            const crearResult = await this.institucionEducativaImagenRepositorio.runTransaction(op)
            if(crearResult){
                return this._serviceResp.respuestaHttp201(
                    crearResult,
                    'Registro de Institución Educativa Imagen Creado !!',
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

    async getCertificado(institucion_educativa_id: number): Promise<Buffer>
    {

        const sie_response = await this.sieRepository.query(`
        select d.* from documento d 
        inner join tramite t on t.id = d.tramite_id
        inner join institucioneducativa i on i.id = t.institucioneducativa_id 
        where i.id = ${institucion_educativa_id};
        `)
        console.log('document',sie_response)
        if(sie_response.length>0)
        {
            const document = sie_response[0];
            const response = await axios({
                method: 'GET',
                url: `http://100.0.101.46:8080/birt-viewer/frameset?__report=siged/rie_cert_certificadottec_v3_afv.rptdesign&documento_id=${document.id}&__format=pdf`,
                responseType: 'arraybuffer'
              }).catch(() => {
                throw new ForbiddenException('API not available');
              });
              console.log('array buffer',response.data) 
            
              return response.data

        }else{
            throw new NotFoundException('document not found')
        }
          
    }
}
