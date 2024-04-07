import { Body, Controller, Get, Param, ParseIntPipe, Post, Res, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { InstitucionEducativaImagen } from 'src/academico/entidades/institucionEducativaImagen.entity';
import { fileName, fileFilter } from 'src/common/helpers/file.utils';
import { CreateInstitucionEducativaImagenDto } from './dto/createInstitucionEducativaImagen.dto';
import { InstitucionEducativaImagenService } from './institucion_educativa_imagen.service';
import { createReadStream } from 'fs';
import { join } from 'path';

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

   @Get('certificado/:institucion_educativa_id')
   async getCertificado( @Res() res, @Param('institucion_educativa_id', ParseIntPipe) institucion_educativa_id: number  ) : Promise<void>{
      const buffer = await this.institucionEducativaImagenService.getCertificado(institucion_educativa_id)
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=certificado.pdf',
        'Content-Length': buffer.length,
      })
  
      res.end(buffer)
   }

}
