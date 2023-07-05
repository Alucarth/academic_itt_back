import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InstitucionEducativa } from 'src/academico/entidades/institucionEducativa.entity';
import { CreateInstitucionEducativaDto } from './dto/createInstitucionEducativa.dto';
import { InstitucionEducativaService } from './institucion_educativa.service';
import { MatriculaEstudianteService } from '../mantricula_estudiante/matricula_estudiante.service';
import { InstitucionEducativaEstudianteService } from '../Institucion_educativa_estudiante/institucion_educativa_estudiante.services';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { fileName, fileFilter } from 'src/common/helpers/file.utils';
import { InstitucionEducativaImagenService } from '../institucion_educativa_imagen/institucion_educativa_imagen.service';

const _ = require('lodash');
@ApiTags('institucion-educativa')
@Controller('institucion-educativa')
export class InstitucionEducativaController {
    constructor (
        private readonly institucionEducativaService: InstitucionEducativaService,
        private readonly institucionEducativaImagenService: InstitucionEducativaImagenService,
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
    //carrera reporte 
    @Get('reporte/lugar-carreras/:lugar/:dependencia')
    async getListaLugarDependenciasCarreras(
        @Param('lugar', ParseIntPipe) lugar: number,
        @Param('dependencia', ParseIntPipe) dependencia: number
    ){
        console.log("total por lugar y dependencia");
        let result = await this.institucionEducativaService.getListaLugarDependenciasEstudiantes(lugar, dependencia);
        console.log('old',result)
        let contador = 0
        let insituto_carreras = []
        await Promise.all(result.map(async (instituto)=>{
            let instituto_career = await this.institucionEducativaService.getCareersInstitution(instituto.institucion_educativa_id)
            

            await Promise.all(instituto_career.sucursales.map(async (sucursal)=>{
                let estudiantes = await this.institucionEducactivaEstudianteService.getEstudiantesBySucursal(sucursal.id)
                console.log('estudiantes',estudiantes.length)
                
                await Promise.all(sucursal.carreras.map(async (carrera)=>{
                   
                    await Promise.all(carrera.institutosPlanesCarreras.map(async(plan)=>{
                        let matriculas = await this.matriculaEstudianteService.getMatriculadosByPlan(plan.id)
                        // matriculas.forEach(matricula => {
                        //     let estudiante = estudiantes.find((o)=>{return matricula.institucionEducativaEstudiante.persona.id === o.persona.id})
                        //     if(estudiante){
                        //         console.log('esudiante',estudiante)
                        //         let index = estudiantes.indexOf(estudiante)
                        //         estudiantes.splice(index,1)
                        //         contador++
                        //     }
                        // });
                        //find solution for this bug
                        contador = 0
                        await Promise.all(matriculas.map(async (matricula)=>{
                            // let estudiante = estudiantes.find((o)=>{return  matricula.institucionEducativaEstudiante.persona.id === o.persona.id })
                            let estudiante = _.find(estudiantes,(o)=>{return matricula.institucionEducativaEstudiante.persona.id === o.persona.id} )
                            if(estudiante){
                                console.log('esudiante',estudiante)
                                let index = estudiantes.indexOf(estudiante)
                                estudiantes.splice(index,1)
                                contador++
                            }
                        }))
                        let resolucion = await this.institucionEducativaService.getCarreraAutorizadaResolucion(carrera.id)
                        // console.log(resolucion)
                        let career = 
                                {
                                    carrera_autorizada_id:carrera.id,
                                    carrera_tipo_id: carrera.carreraTipo.id,
                                    modalidad: resolucion.intervaloGestionTipo.intervaloGestion,
                                    carrera: carrera.carreraTipo.carrera,
                                    institucion_educativa_id: instituto.institucion_educativa_id,
                                    institucion_educativa: instituto.institucion_educativa,
                                    sucursal_nombre: instituto.sucursal_nombre,
                                    estudiantes: contador
                                }
                        insituto_carreras.push(career)
                        contador = 0
                        // console.log(matriculas)
                        // await Promise.all(matriculas)
                    }))
                    // let resolucion = await this.carreraAutorizadaResolucionServide.getAll(1)
                    // console.log(resolucion)
                   
                }))
                //sobra un estudiante raro 
                console.log('estudiantes',estudiantes)
            }))

            
            // let matriculas = await this.matriculaEstudianteService.find({})
    
        }))
        console.log('new',result)
        console.log('count',contador)
        
        return insituto_carreras
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
    @UseInterceptors(
        FileInterceptor('file', {
          storage: diskStorage({
            destination: './uploads',
            filename:fileName
          }),
          fileFilter:fileFilter
        }),
      )
    async createInstituto(@UploadedFile() file: Express.Multer.File,  @Body() dto: CreateInstitucionEducativaDto) {
        console.log('file', file);
        console.log('file', file.filename);
        return  await this.institucionEducativaService.createInstitucionEducativa(dto, file.filename);        
    }
   
    @Put()
    @UseInterceptors(
        FileInterceptor('file', {
          storage: diskStorage({
            destination: './uploads',
            filename:fileName
          }),
          fileFilter:fileFilter
        }),
      )
    async updateInstituto( @Param('id') id: number, @UploadedFile() file: Express.Multer.File,  @Body() dto: CreateInstitucionEducativaDto) {
        console.log('file', file);
        console.log('file', file.filename);
        return  await this.institucionEducativaService.updateInstitucionEducativa(id, dto, file.filename);        
    }

    @Get('download/:id')
    async downloadFile(@Res() res, @Param('id', ParseIntPipe) id: number) {
     const data = await this.institucionEducativaImagenService.getOneActivoBySieId(id);
     
      res.download('./uploads/'+data.nombreArchivo)      
 
   }
   
      
}
