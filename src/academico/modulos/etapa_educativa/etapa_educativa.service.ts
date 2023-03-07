import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EtapaEducativa } from 'src/academico/entidades/etapaEducativa.entity';
import { EntityManager, Repository } from 'typeorm';


@Injectable()
export class EtapaEducativaService {
    constructor(
        @InjectRepository(EtapaEducativa) private etapaEducativaRepository: Repository<EtapaEducativa>,
    ){}
  async getById(id: number){
    const etapa = await this.etapaEducativaRepository.findOneBy({ id : id })
    return etapa
  }
  async findAllRecursiveHijos( id:number ){
        const sql =
        'WITH RECURSIVE etapa AS (\n' +
        '    SELECT\n' +
        '        e0.id,\n' +
        '        e0.etapa_educativa_id,\n' +
        '        e0.etapa_educativa,\n' +
        '        e0.activo,\n' +
        '        e0.etapa_educativa_tipo_id,\n' +
        '        t0.etapa_educativa as etapa_educativa_tipo\n' +
        '    FROM\n' +
        '        etapa_educativa e0, etapa_educativa_tipo t0\n' +
        '    WHERE\n' +
        '        e0.id = $1 and e0.activo = true and e0.etapa_educativa_tipo_id=t0.id\n' +
        '    UNION\n' +
        '        SELECT\n' +
        '            e.id,\n' +
        '            e.etapa_educativa_id,\n' +
        '            e.etapa_educativa,\n' +
        '            e.activo,\n' +
        '            e.etapa_educativa_tipo_id,\n' +
        '            t.etapa_educativa as estapa_educativa_tipo\n' +
        '        FROM\n' +
        '            etapa_educativa e\n' +
        '        INNER JOIN etapa_educativa_tipo t ON t.id = e.etapa_educativa_tipo_id\n' +
        '        INNER JOIN etapa s ON s.id = e.etapa_educativa_id\n' +
        ') SELECT\n' +
        '    *\n' +
        'FROM\n' +
        '    etapa where id<>$1;\n';
      const values = [id];
      const data  = this.etapaEducativaRepository.query(sql, values);
      console.log(data);
      return data;

   }

  async findAllRecursivePadres( id:number ){

      const sql =
      'WITH RECURSIVE buscandoPadre AS (\n' +
      '    SELECT\n' +
      '        e0.id,\n' +
      '        e0.etapa_educativa_id,\n' +
      '        e0.etapa_educativa,\n' +
      '        e0.activo,\n' +
      '        e0.etapa_educativa_tipo_id,\n' +
      '        t0.etapa_educativa as etapa_educativa_tipo\n' +
      '    FROM\n' +
      '        etapa_educativa e0,\n' +
      '        etapa_educativa_tipo t0\n' +
      '    WHERE\n' +
      '        e0.id = $1 and e0.activo = true and t0.id = e0.etapa_educativa_tipo_id \n' +
      '        UNION\n' +
      '        SELECT\n' +
      '            e.id,\n' +
      '            e.etapa_educativa_id,\n' +
      '            e.etapa_educativa,\n' +
      '            e.activo,\n' +
      '            e.etapa_educativa_tipo_id,\n' +
      '            t.etapa_educativa as etapa_educativa_tipo\n' +
      '        FROM\n' +
      '            etapa_educativa e \n' +
      '        INNER JOIN etapa_educativa_tipo t ON t.id = e.etapa_educativa_tipo_id\n' +
      '        INNER JOIN buscandoPadre s ON e.id = s.etapa_educativa_id\n' +
      '        \n' +
      ') SELECT\n' +
      '    *\n' +
      'FROM\n' +
      '    buscandoPadre where id>0 order by id ';
    const values = [id];
    const data = await this.etapaEducativaRepository.query(sql, values);
    console.log(data);
    return data;

  }

    async findCarrerasBySie( id:number ){
      const values = ['etapa_educativa_tipo',25,28,id,'etapa_educativa','codigo','etapa_educativa','etapa_educativa_tipo_id'];
      const sql = 'select * from sp_genera_acreditacion_oferta_json($1,$2,$3,$4,$5,$6,$7,$8)';
      const data = await this.etapaEducativaRepository.query(sql, values);
      console.log(data);
      return data;
  }
    
  async findAsignaturasRegimenCarrera( id:number ){
    const asignaturas = await this.etapaEducativaRepository
    .createQueryBuilder("a")
    .innerJoinAndSelect("a.etapasEducativasAsignaturas", "b")
    .innerJoinAndSelect("b.asignaturaTipo", "c")
    .where('a.etapaEducativaId = :id ', { id })
    .orderBy('a.id', 'ASC')
    .getMany();
    return asignaturas;
}

   
}
