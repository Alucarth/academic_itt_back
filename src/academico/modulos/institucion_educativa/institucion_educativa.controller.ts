import { Body, Controller, Get, Header, Param, ParseIntPipe, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
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
import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';
import { Response } from "express";

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

    @Get('reporte/career-from-institution/:unidad_educativa_id')
    async getCareerFromInstitution(@Param('unidad_educativa_id', ParseIntPipe) unidad_educativa_id: number,)
    {
        return await this.institucionEducativaService.getCareerFromInstitute(unidad_educativa_id)
    }

    @Get('reporte/dependency-teacher')
    async getDependencyTeacherAll()
    {
        return await this.institucionEducativaService.getDependencyTeacherAll()
    }

    @Get('dashboard/teacher/:departamento_id/:dependencia_id/:cargo_tipo_id')
    async getDashboardTeacherByDependency(
        @Param('departamento_id', ParseIntPipe) departamento_id: number,
        @Param('dependencia_id', ParseIntPipe) dependencia_id: number,
        @Param('cargo_tipo_id', ParseIntPipe) cargo_tipo_id: number,
    ){
        return await this.institucionEducativaService.getDashboardTeacherByDependency(departamento_id,dependencia_id,cargo_tipo_id)
    }

    @Get('dashboard/teachers/:carnet_identidad')
    async getDashboardTeacherAll(
        @Param('carnet_identidad') carnet_identidad: string,
    )
    {
        console.log(carnet_identidad)
        return await this.institucionEducativaService.getDashboardTeacherAll(carnet_identidad)
    }
    

    @Get('reporte/lugar-estudiantes/:lugar/:dependencia')
    async getListaLugarDependenciasEstudiantes(
        @Param('lugar', ParseIntPipe) lugar: number,
        @Param('dependencia', ParseIntPipe) dependencia: number
    ){
        console.log("---------------------------------XD");
        let result = await this.institucionEducativaService.getListaLugarDependenciasEstudiantes(lugar, dependencia);
        console.log('old',result)
  
        await Promise.all(result.map(async (instituto)=>{
            let count = await this.institucionEducativaService.getCountCareer(instituto.institucion_educativa_id)
            let count_teacher = await this.institucionEducativaService.getCountTeacher(instituto.institucion_educativa_id)
            let count_student = await this.institucionEducativaService.getCountStudent(instituto.institucion_educativa_id)

            console.log('count_teacher', count_teacher)
            console.log('count_student', count_student)
            console.log('count',count)
            instituto.carreras = count
            instituto.estudiantes = count_student
            instituto.docentes = count_teacher
            
            return instituto
    
        }))
        console.log('new',result)
        return result
    }

    @Get('reporte/lugar-estudiantes-excel/:lugar/:dependencia') //revisar problemas con el reporte
    async getListaLugarDependenciasEstudiantesExcel(
        @Param('lugar', ParseIntPipe) lugar: number,
        @Param('dependencia', ParseIntPipe) dependencia: number,
        @Res() res: Response
    ){
        console.log("total por lugar y dependencia");
        let result = await this.institucionEducativaService.getListaLugarDependenciasEstudiantes(lugar, dependencia);
        console.log('old',result)
  
        await Promise.all(result.map(async (instituto)=>{
            let count = await this.institucionEducativaService.getCountCareer(instituto.institucion_educativa_id)
            let count_teacher = await this.institucionEducativaService.getCountTeacher(instituto.institucion_educativa_id)
            let count_student = await this.institucionEducativaService.getCountStudent(instituto.institucion_educativa_id)

            console.log('count_teacher', count_teacher)
            console.log('count_student', count_student)
            // console.log('count',count)
            instituto.career_quantity = count
            // instituto.studiantes = count_student.total_estudiantes
            // instituto.docentes = count_teacher.total_docentes
            return instituto
    
        }))
        console.log('new',result)
        let data = await this.institucionEducativaService.getExcelInstitutionsDashboard(result)
        res.download(`${data}`);
    }
    //** reporte excel AQUI COMIENZA EL REPORTE DE LA NOTA 0690/2023 */
    @Get('reporte/insituto_departamento')
    @Header("Content-Type", "text/xlsx")
    async getReporteInstitutoDependencia( @Res() res: Response )
    {
        let result = await this.institucionEducativaService.getReporteInstitutoDependencia()
        res.download(`${result}`);
    }

    @Get('reporte/institutos_area_geografica')
    @Header("Content-Type", "text/xlsx")
    async getReporteListaInstitutosAreaGeografica(@Res() res: Response )
    {   
        // return 'hola'
        let result = await this.institucionEducativaService.getReporteListaInstitutosAreaGeografica()
        res.download(`${result}`);
    }

    @Get('reporte/lista_carreras_institutos_dependencia')
    @Header("Content-Type", "text/xlsx")
    async getListaCarrerasInstitutosDependencia(@Res() res: Response)
    {
        let result = await this.institucionEducativaService.getListaCarrerasInstitutosDependencia()
        res.download(`${result}`);
    
    }

    @Get('reporte/lista_dependencia_area_geografica')
    @Header("Content-Type", "text/xlsx")
    async getInsitutosDependenciaUbicacionGeografica(@Res() res: Response)
    {
        // return 'hola';
        let result = await this.institucionEducativaService.findInsitutosDependenciaUbicacionGeografica()
        
        res.download(`${result}`);
    }

    @Get('reporte/lista_inscritos_departamento_dependencia')
    @Header("Content-Type", "text/xlsx")
    async findInscritosInsitutosDependenciaDepartamento(@Res() res: Response)
    {
        // return 'hola';
        let result = await this.institucionEducativaService.findInscritosInsitutosDependenciaDepartamento()
        
        res.download(`${result}`);
    }

    @Get('reporte/lista_inscritos_carrera_tipo_anual')
    @Header("Content-Type", "text/xlsx")
    async findEstudiantesTipoCarreraDependenciaAnual(@Res() res: Response)
    {
        // return 'hola';
        let result = await this.institucionEducativaService.findEstudiantesTipoCarreraDependenciaAnual()
        // return result;
        res.download(`${result}`);
    }

    @Get('reporte/lista_inscritos_carrera_tipo_semestre')
    @Header("Content-Type", "text/xlsx")
    async findEstudiantesTipoCarreraDependenciaSemestre(@Res() res: Response)
    {
        // return 'hola';
        let result = await this.institucionEducativaService.findEstudiantesTipoCarreraDependenciaSemestre()
        // return result;
        res.download(`${result}`);
    }

    @Get('reporte/lista_inscritos_departamento_genero')
    @Header("Content-Type", "text/xlsx")
    async findEstudiantesDepartamentoGenero(@Res() res: Response)
    {
        // return 'hola';
        let result = await this.institucionEducativaService.findEstudiantesDepartamentoGenero()
        // return result;
        res.download(`${result}`);
    }

    @Get('reporte/lista_detalle_carrera_insituto_dependencia')
    @Header("Content-Type", "text/xlsx")
    async findDetalleCarrerasInsitutosDependencia(@Res() res: Response)
    {
        // return 'hola';
        let result = await this.institucionEducativaService.findDetalleCarrerasInsitutosDependencia()
        
        res.download(`${result}`);
    }

    @Get('reporte/lista_detalle_carrera_tipo')
    @Header("Content-Type", "text/xlsx")
    async getDetalleCarreraTipo(@Res() res: Response)
    {
        // return 'hola';
        let result = await this.institucionEducativaService.getDetalleCarreraTipo()
        // return result
        res.download(`${result}`);
    }

    @Get('reporte/lista_estudiantes_carrera')
    @Header("Content-Type", "text/xlsx")
    async getCantidadEstudianteCarrera(@Res() res: Response)
    {
        
        let result = await this.institucionEducativaService.getCantidadEstudianteCarrera()
        
        res.download(`${result}`);
    }

    @Get('reporte/lista_estudiantes_matriculados_dependencia_area_geografica')
    @Header("Content-Type", "text/xlsx")
    async getNumeroEstudiantesMatriculasdosAreaGeograficaDependencia(@Res() res: Response)
    {
        
        let result = await this.institucionEducativaService.getNumeroEstudiantesMatriculasdosAreaGeograficaDependencia()
        
        res.download(`${result}`);
    }

    @Get('reporte/lista_estudiantes_matriculados')
    @Header("Content-Type", "text/xlsx")
    async getMatriculadosDependenciaAreaGeografica(@Res() res: Response)
    {
        
        let result = await this.institucionEducativaService.getMatriculadosDependenciaAreaGeografica()
        
        res.download(`${result}`);
    }

    @Get('reporte/lista_estudiantes_matriculados_notas')
    @Header("Content-Type", "text/xlsx")
    async getMatriculadosDependenciaAreaGeograficaNotas(@Res() res: Response)
    {
        
        let result = await this.institucionEducativaService.getMatriculadosDependenciaAreaGeograficaNotas()
        
        res.download(`${result}`);
    }

    // getNumeroEstudiantesMatriculasdosAreaGeograficaDependencia

    // HASTA AQUI LOS REPORTES XD DE LA NOTA INTERNA 0690/2023

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
        console.log('sie',sie)
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

    @Auth()
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
    async createInstituto(
        @UploadedFile() file: Express.Multer.File,  
        @Body() dto: CreateInstitucionEducativaDto,
        @Users() user: UserEntity) {
        console.log('dto', dto);
        console.log('file', file);
        console.log('file', file.filename);
        return  await this.institucionEducativaService.createInstitucionEducativa(dto, file.filename, user);        
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
