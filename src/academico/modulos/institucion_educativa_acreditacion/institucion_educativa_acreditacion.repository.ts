import { Injectable } from '@nestjs/common'
import { EtapaEducativaAsignatura } from 'src/academico/entidades/etapaEducativaAsignatura.entity';
import { InstitucionEducativaAcreditacion } from 'src/academico/entidades/institucionEducativaAcreditacion.entity';
import { DataSource } from 'typeorm'
import { CreateInstitucionEducativaDto } from '../institucion_educativa/dto/createInstitucionEducativa.dto';
import { CreateInstitucionEducativaCursoDto } from '../institucion_educativa_curso/dto/createInstitucionEducativaCurso.dto';

@Injectable()
export class InstitucionEducativaAcreditacionRepository {
    
    constructor(
        private dataSource: DataSource
    ) {}

    async getAll(){
        return  await this.dataSource.getRepository(InstitucionEducativaAcreditacion).find();
    }
    
    async findAcreditacion(id){
        return  await this.dataSource.getRepository(InstitucionEducativaAcreditacion).findOneBy({
            institucionEducativaId:id
        });
    }
    

    async createInstitucionEducativaAcreditacion(idUsuario,id:number,dto:CreateInstitucionEducativaDto, transaction) {
          
          const acreditacion  = new InstitucionEducativaAcreditacion()
          acreditacion.institucionEducativaId = id;
          acreditacion.convenioTipoId = 0;
          acreditacion.dependenciaTipoId = dto.dependencia_tipo_id;
          acreditacion.acreditacionTipoId = 2;
          acreditacion.numeroResolucion = dto.numero_resolucion;
          acreditacion.fechaResolucion = dto.fecha_resolucion;
          acreditacion.usuarioId = idUsuario;
          acreditacion.vigente = true;
          acreditacion.observacion = dto.observacion;         
        return await transaction.getRepository(InstitucionEducativaAcreditacion).save(acreditacion)
    }
   
}
