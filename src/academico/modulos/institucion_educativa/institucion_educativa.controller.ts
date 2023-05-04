import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InstitucionEducativa } from 'src/academico/entidades/institucionEducativa.entity';
import { CreateInstitucionEducativaDto } from './dto/createInstitucionEducativa.dto';
import { InstitucionEducativaService } from './institucion_educativa.service';

@ApiTags('institucion-educativa')
@Controller('institucion-educativa')
export class InstitucionEducativaController {
    constructor (
        private readonly institucionEducativaService: InstitucionEducativaService 
        ){}
    @Get()
    async getAll():Promise<InstitucionEducativa[]>{
        return await this.institucionEducativaService.getAll();
    }
    
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number){
        console.log("ssss");
        const resp  = await this.institucionEducativaService.getBySieId(id);
        console.log(resp);
        return resp;
    }
    @Get('institutos')
    async getListaInstitutos(){
        console.log("lista institutos");
        return await this.institucionEducativaService.getAllItt();
    }


    @Get('itt')
    async getListaItt(){
        console.log("lista itts");
        return await this.institucionEducativaService.getAllItt();
    }

    @Get('sie/:sie')
    async getBySie(@Param('sie', ParseIntPipe) sie: number){
        return await this.institucionEducativaService.findBySie(sie);
    }

    @Get('acreditacion/:sie')
    async getAcreditdoBySie(@Param('sie', ParseIntPipe) sie: number):Promise<InstitucionEducativa[]>{
        return await this.institucionEducativaService.findAcreditacionBySie(sie);
    }
    @Get('itt/:sie')
    async getOneIttBySie(@Param('sie', ParseIntPipe) sie: number):Promise<InstitucionEducativa>{
        return await this.institucionEducativaService.findOneAcreditadoBySie(sie);
    }

    @Get('carreras/:sie')
    async getEtapasBySie(@Param('sie', ParseIntPipe) sie: number):Promise<InstitucionEducativa[]>{
        return await this.institucionEducativaService.findEtapasBySie(sie);
    }
       
    @Get('lista-carreras/:sie')
    async getCarrerasBySie(@Param('sie', ParseIntPipe) sie: number):Promise<InstitucionEducativa[]>{
        return await this.institucionEducativaService.findCarrerasBySie(sie);
    }

    @Get('sucursal/:sie/:gestion')
    async getSucursalGestion(@Param('sie', ParseIntPipe) sie: number, @Param('gestion', ParseIntPipe) gestion: number):Promise<InstitucionEducativa>{
        return await this.institucionEducativaService.findSucursalGestion(sie, gestion);
    }

    @Post()
    async createCurso(@Body() dto: CreateInstitucionEducativaDto){
        console.log('controller insert',dto);
        
        //console.log(Math.floor(Math.random() * 1000000000));

        return  await this.institucionEducativaService.createInstitucionEducativa(dto);        
    }
      
}
