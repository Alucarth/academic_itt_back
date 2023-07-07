import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager } from 'typeorm';
import { CreateInstitucionEducativaImagenDto } from './dto/createInstitucionEducativaImagen.dto';
import { InstitucionEducativaImagenRepository } from './institucion_educativa_imagen.repository';

@Injectable()
export class InstitucionEducativaImagenService {
    constructor(
        @Inject(InstitucionEducativaImagenRepository) private institucionEducativaImagenRepositorio: InstitucionEducativaImagenRepository,
        private _serviceResp: RespuestaSigedService, 
    ){}

    async getAll(){
        return await this.institucionEducativaImagenRepositorio.getAll();
    }

    async getOneActivoBySieId(id:number){
        return await this.institucionEducativaImagenRepositorio.getActivoById(id);
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
}
