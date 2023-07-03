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
    //carrera reporte 
    @Get('reporte/lugar-carreras/:lugar/:dependencia')
    async getListaLugarDependenciasCarreras(
        @Param('lugar', ParseIntPipe) lugar: number,
        @Param('dependencia', ParseIntPipe) dependencia: number
    ){
        console.log("total por lugar y dependencia");
        let result = await this.institucionEducativaService.getListaLugarDependenciasEstudiantes(lugar, dependencia);
        console.log('old',result)
        let career_count =[]
        let contador = 0
        let carrera_contador = []
        let insituto_carreras = []
        let j=0
        let x=0
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
                            await new Promise((resolve,reject)=>{
                                let estudiante = _.find(estudiantes,(o)=>{return matricula.institucionEducativaEstudiante.persona.id === o.persona.id} )
                                // console.log(carrera )
                                
                                if(estudiante){
                                    // console.log('esudiante',estudiante)
                                    let index = estudiantes.indexOf(estudiante)
                                    estudiantes.splice(index,1)
                                    career_count.push(carrera.carreraTipo.id)
                                    console.log(career_count.length)
                                    // contador++
                                    j++
                                    console.log(j)
                                    resolve(contador++)
                                }else{
                                    resolve(true)
                                }
                            })
                        }))
                        x+=contador
                        
                        carrera_contador.push({carrera_tipo_id: carrera.carreraTipo.id, cantidad: contador})
                        console.log(carrera_contador)
                        console.log( `${carrera.carreraTipo.carrera} contador: ${contador}  j:${j} x:${x}`  )
                        let career = 
                        {
                            carrera_autorizada_id:carrera.id,
                            carrera_tipo_id: carrera.carreraTipo.id,
                            modalidad: '',
                            carrera: carrera.carreraTipo.carrera,
                            institucion_educativa_id: instituto.institucion_educativa_id,
                            institucion_educativa: instituto.institucion_educativa,
                            sucursal_nombre: instituto.sucursal_nombre,
                            estudiantes: contador
                        }
                        console.log(career)
                        let resolucion = await this.institucionEducativaService.getCarreraAutorizadaResolucion(carrera.id)
                        // console.log(resolucion)

                        // let career = 
                        //         {
                        //             carrera_autorizada_id:carrera.id,
                        //             carrera_tipo_id: carrera.carreraTipo.id,
                        //             modalidad: resolucion.intervaloGestionTipo.intervaloGestion,
                        //             carrera: carrera.carreraTipo.carrera,
                        //             institucion_educativa_id: instituto.institucion_educativa_id,
                        //             institucion_educativa: instituto.institucion_educativa,
                        //             sucursal_nombre: instituto.sucursal_nombre,
                        //             estudiantes: contador
                        //         }
                        career.modalidad = resolucion.intervaloGestionTipo.intervaloGestion
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
        let i=0
        insituto_carreras.forEach(carrera => {
            // let finder = career_count.filter((o)=>o === carrera.carrera_tipo_id)
            i += carrera.estudiantes
            // console.log(finder.length)
        });
        console.log('total',i)
        console.log('total j',j)
        console.log('total x',x)
        console.log('career',career_count)
        
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
    async createCurso(@Body() dto: CreateInstitucionEducativaDto){
        console.log('controller insert',dto);
        
        //console.log(Math.floor(Math.random() * 1000000000));

        return  await this.institucionEducativaService.createInstitucionEducativa(dto);        
    }
      
}
