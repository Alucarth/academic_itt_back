import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InstitucionEducativa } from 'src/academico/entidades/institucionEducativa.entity';
import { CreateInstitucionEducativaDto } from './dto/createInstitucionEducativa.dto';
import { InstitucionEducativaService } from './institucion_educativa.service';
import { MatriculaEstudianteService } from '../mantricula_estudiante/matricula_estudiante.service';
import { InstitucionEducativaEstudianteService } from '../Institucion_educativa_estudiante/institucion_educativa_estudiante.services';
const _ = require('lodash');
@ApiTags('institucion-educativa')
@Controller('institucion-educativa')
export class InstitucionEducativaController {
    constructor (
        private readonly institucionEducativaService: InstitucionEducativaService,
        private readonly matriculaEstudianteService: MatriculaEstudianteService,
        private readonly institucionEducactivaEstudianteService: InstitucionEducativaEstudianteService,
     
        ){}

    

    @Get()
    async getAll():Promise<InstitucionEducativa[]>{
        //console.log("ins-educ");
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
    @Get('reporte/totales')
    async getTotalItt(){
        console.log("total itt");
        return await this.institucionEducativaService.getTotalItt();
    }
    @Get('reporte/dependencias')
    async getTotalDependencias(){
        console.log("total por dependencias");
        return await this.institucionEducativaService.getTotalDependencias();
    }
    @Get('reporte/lugar-dependencia/:lugar/:dependencia')
    async getListaLugarDependencias(
        @Param('lugar', ParseIntPipe) lugar: number,
        @Param('dependencia', ParseIntPipe) dependencia: number
    ){
        console.log("lista institutos, sede,carreras de un lugar y dependencia");
        return await this.institucionEducativaService.getListaInstitutosLugarDependencias(lugar, dependencia);
    }
    @Get('reporte/lugar-estudiantes/:lugar/:dependencia')
    async getListaLugarDependenciasEstudiantes(
        @Param('lugar', ParseIntPipe) lugar: number,
        @Param('dependencia', ParseIntPipe) dependencia: number
    ){
        console.log("total por lugar y dependencia");
        let result = await this.institucionEducativaService.getListaLugarDependenciasEstudiantes(lugar, dependencia);
        console.log('old',result)
  
        await Promise.all(result.map(async (instituto)=>{
            let count = await this.institucionEducativaService.getCountCareer(instituto.institucion_educativa_id)
            console.log('count',count)
            instituto.career_quantity = count
            return instituto
    
        }))
        console.log('new',result)
        return result
    }
   

    @Get('reporte/general')
    async getTotalGeneral(){
        console.log("total general inst, est, doc, carreras");
        return await this.institucionEducativaService.getTotalGeneral();
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
