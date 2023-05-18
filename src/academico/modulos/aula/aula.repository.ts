import { Injectable } from '@nestjs/common'
import { Aula } from 'src/academico/entidades/aula.entity';
import { DataSource, EntityManager } from 'typeorm'

@Injectable()
export class AulaRepository {
constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(Aula).find();
    }
   
    async crearAula(idUsuario, id, aulas, transaction) {

        const det: Aula[] = aulas.map((item) => {
          const det  = new Aula()
          det.ofertaCurricularId =id;
          return det;
        });
    
        return await transaction.getRepository(Aula).save(det);
    }
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}