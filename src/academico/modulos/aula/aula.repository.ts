import { Injectable } from '@nestjs/common'
import { Aula } from 'src/academico/entidades/aula.entity';
import { DataSource, EntityManager } from 'typeorm'

@Injectable()
export class AulaRepository {
constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(Aula).find();
    }
    async getDatoAula(id, cupo, paralelo){

        return  await this.dataSource.getRepository(Aula).findOne({where:{
            ofertaCurricularId:id,
            cupo:cupo,
            paraleloTipoId:paralelo,
            },
        });
    }
   
    async createAula(aula, transaction) {
          
        const au  = new Aula();
        au.ofertaCurricularId = aula.oferta_curricular_id;
        au.activo = true;
        au.cupo = aula.cupo;
        au.paraleloTipoId = aula.paralelo_tipo_id;
        au.usuarioId = aula.usuario_id;
        
      return await transaction.getRepository(Aula).save(au);
    }
    async crearAulaArray(idUsuario, id, aulas, transaction) {

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