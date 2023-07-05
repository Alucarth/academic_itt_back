import { Inject, Injectable } from '@nestjs/common';
import { InstitucionEducativaImagenRepository } from './institucion_educativa_imagen.repository';

@Injectable()
export class InstitucionEducativaImagenService {
    constructor(
        @Inject(InstitucionEducativaImagenRepository) private institucionEducativaImagenRepositorio: InstitucionEducativaImagenRepository,
        
    ){}

    async getAll(){
        return await this.institucionEducativaImagenRepositorio.getAll();
    }

    async getOneActivoBySieId(id:number){
        return await this.institucionEducativaImagenRepositorio.getActivoById(id);
    }
}
