import { Body, Controller, Get, Param, ParseIntPipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { InstitucionEducativaImagen } from 'src/academico/entidades/institucionEducativaImagen.entity';
import { fileName, fileFilter } from 'src/common/helpers/file.utils';
import { CreateInstitucionEducativaImagenDto } from './dto/createInstitucionEducativaImagen.dto';
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

    async createInstitutoImagen(@UploadedFile() file: Express.Multer.File,  @Body() dto: CreateInstitucionEducativaImagenDto) {

        console.log("subiendo imagen")
        console.log('dto', dto);
        console.log('file', file);
        console.log('filename', file.filename);
        return  await this.institucionEducativaImagenService.createInstitucionEducativaImagen(dto, file.filename);        
    }


    @Post('upload')
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: './uploads',
            filename:fileName
          }),
          fileFilter:fileFilter
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
      console.log('file =====>: ', file);
      return file;
    }

    @Get('download-logo/:id')
    async downloadFile(@Res() res, @Param('id', ParseIntPipe) id: number) {
     const data = await this.institucionEducativaImagenService.getById(id);
        console.log(data);
        
        res.download('./uploads/'+data.nombreArchivo)      
   }

   @Get('nombre-logo/:id')
   async getLogo(@Param('id', ParseIntPipe) id: number){
        const data = await this.institucionEducativaImagenService.getById(id);
        return data.nombreArchivo;  
   }

   @Get('certificado')
   async getCertificado(){
      return await this.institucionEducativaImagenService.getCertificado()
   }
}
