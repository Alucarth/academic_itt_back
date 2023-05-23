import { Injectable } from '@nestjs/common'
import { AulaDetalle } from 'src/academico/entidades/aulaDetalle.entity';
import { DataSource, EntityManager } from 'typeorm'

@Injectable()
export class AulaDetalleRepository {
constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(AulaDetalle).find();
    }
    async getDatoAulaDetalle(id, cupo, paralelo){

        return  await this.dataSource.getRepository(AulaDetalle).findOne({where:{
            aulaId:id,
            diaTipoId:id,
            horaInicio:id,
            horaFin:id,
            
            },
        });
    }
    async getDetallesByAulaId(id){

        return  await this.dataSource.getRepository(AulaDetalle).find({where:{
            aulaId:id
            },
        });
    }
    verificarAulasDetalles(aulaDetalles, detalles) {
        console.log("iniciooooo")
        console.log(aulaDetalles);
        console.log("medio")
        console.log(detalles);
        console.log("finnnnn")
        const nuevos = detalles.filter((d) =>
            aulaDetalles.every((ad) => d.dia_tipo_id != ad.diaTipoId )
        );
        return  nuevos;
    }
    async createAulaDetalle(idUsuario, id, detalles) {
        const det: AulaDetalle[] = detalles.map((item) => {
          const det  = new AulaDetalle()
          det.aulaId =id;
          det.diaTipoId =item.dia_tipo_id;
          det.horaInicio =item.hora_inicio;
          det.horaFin =item.hora_fin;
          det.numeroAula =item.numero_aula;
          det.usuarioId =idUsuario;
          return det;
        });
        return await this.dataSource.getRepository(AulaDetalle).save(det);
    }
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}