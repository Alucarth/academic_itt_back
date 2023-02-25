import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EtapaEducativa } from 'src/academico/entidades/etapaEducativa.entity';
import { EntityManager, Repository } from 'typeorm';


@Injectable()
export class EtapaEducativaService {
    constructor(
        @InjectRepository(EtapaEducativa) private etapaEducativaRepository: Repository<EtapaEducativa>,
        @InjectEntityManager() private entityManager: EntityManager,
        
    ){}
    async findAllRecursiveHijos( id:number ){

        const sql =
        'WITH RECURSIVE etapa AS (\n' +
        '    SELECT\n' +
        '        id,\n' +
        '        etapa_educativa_id,\n' +
        '        etapa_educativa,\n' +
        '        activo\n' +
        '    FROM\n' +
        '        etapa_educativa\n' +
        '    WHERE\n' +
        '        id = $1 and activo = true\n' +
        '    UNION\n' +
        '        SELECT\n' +
        '            e.id,\n' +
        '            e.etapa_educativa_id,\n' +
        '            e.etapa_educativa,\n' +
        '            e.activo\n' +
        '        FROM\n' +
        '            etapa_educativa e\n' +
        '        INNER JOIN etapa s ON s.id = e.etapa_educativa_id\n' +
        ') SELECT\n' +
        '    *\n' +
        'FROM\n' +
        '    etapa;\n';
      const values = [id];
      const data  = this.entityManager.query(sql, values);
      console.log(data);
      return data;

    }
}
