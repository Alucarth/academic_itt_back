import { Controller, Get } from '@nestjs/common';
import { InstitucionEducativaImagen } from 'src/academico/entidades/institucionEducativaImagen.entity';
import { InstitucionEducativaImagenService } from './institucion_educativa_imagen.service';

@Controller('institucion-educativa-imagen')
export class InstitucionEducativaImagenController {
    constructor (
        private readonly institucionEducativaImagenService: InstitucionEducativaImagenService,
      
        ){}

    

    @Get()
    async getAll():Promise<InstitucionEducativaImagen[]>{
        //console.log("ins-educ");
        return await this.institucionEducativaImagenService.getAll();
    }
}
