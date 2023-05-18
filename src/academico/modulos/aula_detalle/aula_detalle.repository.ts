import { Injectable } from '@nestjs/common'
import { AulaDetalle } from 'src/academico/entidades/aulaDetalle.entity';
import { DataSource, EntityManager } from 'typeorm'

@Injectable()
export class AulaDetalleRepository {
constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(AulaDetalle).find();
    }
   
    async crearAulaDetalle(idUsuario, id, detalles, transaction) {

        const det: AulaDetalle[] = detalles.map((item) => {
          const det  = new AulaDetalle()
          det.aulaId =id;
          return det;
        });
    
        return await transaction.getRepository(AulaDetalle).save(det);
    }
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}