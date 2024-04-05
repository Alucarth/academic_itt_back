import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager } from 'typeorm';
import { CreateInstitucionEducativaImagenDto } from './dto/createInstitucionEducativaImagen.dto';
import { InstitucionEducativaImagenRepository } from './institucion_educativa_imagen.repository';
import axios from 'axios';
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

    async getCertificado()
    {
        const response = await axios({
            method: 'GET',
            url: 'http://100.0.101.46:8080/birt-viewer/frameset?__report=siged/rie_cert_certificadottec_v3_afv.rptdesign&documento_id=3287165&__format=pdf',
            responseType: 'arraybuffer'
          }).catch(() => {
            throw new ForbiddenException('API not available');
          });
          console.log(response.data)

          const pdfDoc = await PDFDocument.load(response.data);

          // Crear un Blob a partir del PDFDocument
          const pdfBytes = await pdfDoc.save();
          const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      
          // Crear una URL para el Blob
          file.temporal_Path = URL.createObjectURL(pdfBlob);
          return {
            data: {
              fact: response.data?.fact,
            },
          };
    }
}
