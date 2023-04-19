import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaestroInscripcion } from 'src/academico/entidades/maestroInscripcion.entity';
import { OfertaAcademica } from 'src/academico/entidades/ofertaAcademica.entity';
import { OfertaAcademicaMaestroInscripcion } from 'src/academico/entidades/ofertaAcademicaMaestroInscripcion.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { Repository } from 'typeorm';
import { CreateOfertaAcademicaMaestroInscripcionDto } from './dto/createOfertaAcademicaMaestroInscripcion.dto';

@Injectable()
export class OfertaAcademicaMaestroInscripcionService {
    constructor(
        @InjectRepository(OfertaAcademicaMaestroInscripcion)
        private oaMaeRepository: Repository<OfertaAcademicaMaestroInscripcion>,
        private _serviceResp: RespuestaSigedService,
    ){}

    async createOFertaAcademicaMaestroInscripcion(dto: CreateOfertaAcademicaMaestroInscripcionDto) {

        console.log("servicio de insercion inicio");
        /*const maestroInscripcion = new MaestroInscripcion();
          maestroInscripcion.id = 125
          const ofertaAcademica = new OfertaAcademica();
          ofertaAcademica.id = 19694218;*/
        /*
        const ofertaAcademicaMaestroInscripcion  = new OfertaAcademicaMaestroInscripcion();
        ofertaAcademicaMaestroInscripcion.maestroInscripcionId = 125;
        ofertaAcademicaMaestroInscripcion.ofertaAcademicaId = 19694218;
            
        console.log("servicio de insercion fin");
        return await this.oaMaeRepository.save(ofertaAcademicaMaestroInscripcion);*/

        const ofertasAcademicas: OfertaAcademicaMaestroInscripcion[] = dto.ofertaAcademica.map((item) => {     
          const ofertaAcademicaMaestroInscripcion  = new OfertaAcademicaMaestroInscripcion();
          ofertaAcademicaMaestroInscripcion.maestroInscripcionId = dto.maestroInscripcionId;
          ofertaAcademicaMaestroInscripcion.ofertaAcademicaId =  item.id;
          return ofertaAcademicaMaestroInscripcion;
        });
    
        const ofertaMaestro = await this.oaMaeRepository.save(ofertasAcademicas);
        console.log(ofertaMaestro);
        if(ofertaMaestro != undefined){
            return this._serviceResp.respuestaHttp201(
                ofertaMaestro,
                'Registro de curso y maestro  Creado !!',
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
