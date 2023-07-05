import { Injectable } from '@nestjs/common'
import { InstitucionEducativaImagen } from 'src/academico/entidades/institucionEducativaImagen.entity';
import { DataSource} from 'typeorm'


@Injectable()
export class InstitucionEducativaImagenRepository {
    
    constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(InstitucionEducativaImagen).find();
    }
    async createInstitucionEducativaImagen(idUsuario,id:number,filename, transaction) {
          
        const imagen  = new InstitucionEducativaImagen()
        imagen.institucionEducativaId = id;
        imagen.nombreArchivo = filename;
        imagen.usuarioId = idUsuario;
        imagen.descripcion = "logo";
        imagen.activo = true;
        
      return await transaction.getRepository(InstitucionEducativaImagen).save(imagen);
    }

   async inhabilitaImagen(id) {
    await this.dataSource.getRepository(InstitucionEducativaImagen)
          .createQueryBuilder()
          .update(InstitucionEducativaImagen)
          .set({
            activo: false,
          })
          .where({ institucionEducativaId: id })
          .execute();
   }
   async getActivoById(id:number){
        const imagen = await this.dataSource.getRepository(InstitucionEducativaImagen)
        .createQueryBuilder("a")
        .where('a.institucionEducativaId = :id ', { id })
        .andWhere('a.activo = true ')
        .getOne();
        return imagen;
    }
}