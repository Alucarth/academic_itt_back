import { Injectable } from '@nestjs/common'
import { InstitucionEducativaImagen } from 'src/academico/entidades/institucionEducativaImagen.entity';
import { DataSource, EntityManager} from 'typeorm'


@Injectable()
export class InstitucionEducativaImagenRepository {
    
    constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(InstitucionEducativaImagen).find();
    }
    async findOneInstitutoLogo(id:number) {
          
      return await this.dataSource.getRepository(InstitucionEducativaImagen)
      .createQueryBuilder('im')
      .where('im.institucionEducativaId = :id', {id} )
      .andWhere('im.activo = true' )
      .getRawOne();
      
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
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
      return this.dataSource.manager.transaction<T>(op)
  }

}